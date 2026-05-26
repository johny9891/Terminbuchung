import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { embed } from "@/lib/openai/embeddings";
import { openai, CHAT_MODEL } from "@/lib/openai/client";
import { SYSTEM_CHAT, chatContextPrompt } from "@/lib/openai/prompts";

export const runtime = "nodejs";
export const maxDuration = 30;

const Body = z.object({ question: z.string().min(2).max(2000) });

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });

  const json = await request.json().catch(() => null);
  const parsed = Body.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Ungültige Frage" }, { status: 400 });
  const { question } = parsed.data;

  // Confirm ownership
  const { data: doc } = await supabase
    .from("documents")
    .select("id")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!doc) return NextResponse.json({ error: "Nicht gefunden" }, { status: 404 });

  // Embed question + retrieve context
  const queryEmbedding = await embed(question);
  const { data: matches, error: matchErr } = await supabase.rpc("match_document_chunks", {
    p_document_id: params.id,
    p_query_embedding: queryEmbedding,
    p_match_count: 6,
  });

  if (matchErr) {
    console.error("Match RPC failed", matchErr);
    return NextResponse.json({ error: "Kontextsuche fehlgeschlagen" }, { status: 500 });
  }

  const contextChunks = (matches ?? []).map((m: { content: string }) => m.content);

  // Recent conversation for continuity
  const { data: history } = await supabase
    .from("chat_messages")
    .select("role, content")
    .eq("document_id", params.id)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(6);

  const recent = (history ?? []).reverse() as { role: "user" | "assistant"; content: string }[];

  const completion = await openai().chat.completions.create({
    model: CHAT_MODEL,
    messages: [
      { role: "system", content: SYSTEM_CHAT },
      { role: "system", content: chatContextPrompt(contextChunks) },
      ...recent.map((m) => ({ role: m.role, content: m.content })),
      { role: "user", content: question },
    ],
    temperature: 0.3,
  });

  const answer = completion.choices[0]?.message?.content ?? "Keine Antwort.";
  const tokensUsed = completion.usage?.total_tokens ?? 0;

  const admin = createAdminClient();
  await admin.from("chat_messages").insert([
    { document_id: params.id, user_id: user.id, role: "user", content: question },
    { document_id: params.id, user_id: user.id, role: "assistant", content: answer },
  ]);

  const { data: prof } = await admin
    .from("profiles")
    .select("usage_tokens")
    .eq("id", user.id)
    .maybeSingle();
  await admin
    .from("profiles")
    .update({ usage_tokens: (prof?.usage_tokens ?? 0) + tokensUsed })
    .eq("id", user.id);

  return NextResponse.json({ answer });
}
