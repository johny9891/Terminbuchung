import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { PLAN_LIMITS, type Plan } from "@/types";
import { extractPdfText } from "@/lib/utils/pdf";
import { chunkText } from "@/lib/utils/chunk";
import { embedBatch } from "@/lib/openai/embeddings";
import { openai, CHAT_MODEL } from "@/lib/openai/client";
import { SYSTEM_SUMMARY } from "@/lib/openai/prompts";

export const runtime = "nodejs";
export const maxDuration = 60;

const ACCEPTED = ["application/pdf", "text/plain", "text/markdown"];

export async function POST(request: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan, usage_documents")
    .eq("id", user.id)
    .maybeSingle();

  const plan = (profile?.plan ?? "free") as Plan;
  const limit = PLAN_LIMITS[plan];

  if ((profile?.usage_documents ?? 0) >= limit.documents) {
    return NextResponse.json(
      { error: `Dokumentenlimit erreicht (${limit.documents}). Upgrade auf Pro.` },
      { status: 403 },
    );
  }

  const form = await request.formData();
  const file = form.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "Keine Datei" }, { status: 400 });

  if (!ACCEPTED.includes(file.type)) {
    return NextResponse.json({ error: "Dateityp nicht unterstützt" }, { status: 400 });
  }

  if (file.size > limit.maxFileMb * 1024 * 1024) {
    return NextResponse.json(
      { error: `Datei zu groß (max ${limit.maxFileMb} MB)` },
      { status: 400 },
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  // Extract text
  let text = "";
  let pageCount: number | null = null;
  try {
    if (file.type === "application/pdf") {
      const r = await extractPdfText(buffer);
      text = r.text;
      pageCount = r.pages;
    } else {
      text = buffer.toString("utf-8");
    }
  } catch (err) {
    console.error("PDF parse failed", err);
    return NextResponse.json({ error: "Datei konnte nicht gelesen werden" }, { status: 400 });
  }

  if (!text.trim()) {
    return NextResponse.json({ error: "Dokument enthält keinen Text" }, { status: 400 });
  }

  // Upload to Storage
  const filePath = `${user.id}/${Date.now()}-${file.name.replace(/[^a-z0-9.\-_]/gi, "_")}`;
  const { error: uploadErr } = await supabase.storage
    .from("documents")
    .upload(filePath, buffer, { contentType: file.type, upsert: false });

  if (uploadErr) {
    console.error("Storage upload failed", uploadErr);
    return NextResponse.json({ error: "Speicher-Upload fehlgeschlagen" }, { status: 500 });
  }

  // Create document row
  const title = file.name.replace(/\.[^.]+$/, "");
  const { data: doc, error: docErr } = await supabase
    .from("documents")
    .insert({
      user_id: user.id,
      title,
      file_name: file.name,
      file_path: filePath,
      file_size: file.size,
      mime_type: file.type,
      page_count: pageCount,
      status: "processing",
    })
    .select()
    .single();

  if (docErr || !doc) {
    console.error("Document insert failed", docErr);
    await supabase.storage.from("documents").remove([filePath]);
    return NextResponse.json({ error: "Dokument konnte nicht angelegt werden" }, { status: 500 });
  }

  // Process: chunk + embed + summarize. Service role used for chunk inserts.
  const admin = createAdminClient();

  try {
    const chunks = chunkText(text);
    const embeddings = await embedBatch(chunks.map((c) => c.content));
    const rows = chunks.map((c, i) => ({
      document_id: doc.id,
      user_id: user.id,
      chunk_index: c.index,
      content: c.content,
      token_count: c.tokenEstimate,
      embedding: embeddings[i],
    }));

    if (rows.length > 0) {
      const { error: chunkErr } = await admin.from("document_chunks").insert(rows);
      if (chunkErr) throw chunkErr;
    }

    // Summary (first ~12k chars)
    const summaryInput = text.slice(0, 12000);
    const completion = await openai().chat.completions.create({
      model: CHAT_MODEL,
      messages: [
        { role: "system", content: SYSTEM_SUMMARY },
        { role: "user", content: summaryInput },
      ],
      temperature: 0.3,
    });
    const summary = completion.choices[0]?.message?.content ?? "";
    const tokensUsed = completion.usage?.total_tokens ?? 0;

    await admin
      .from("documents")
      .update({ status: "ready", summary, updated_at: new Date().toISOString() })
      .eq("id", doc.id);

    await admin
      .from("profiles")
      .update({
        usage_documents: (profile?.usage_documents ?? 0) + 1,
        usage_tokens: tokensUsed,
      })
      .eq("id", user.id);
  } catch (err) {
    console.error("Processing failed", err);
    await admin.from("documents").update({ status: "failed" }).eq("id", doc.id);
  }

  return NextResponse.json({ id: doc.id });
}
