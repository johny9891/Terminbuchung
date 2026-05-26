import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { openai, CHAT_MODEL } from "@/lib/openai/client";
import { SYSTEM_SUMMARY } from "@/lib/openai/prompts";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(_request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });

  const { data: doc } = await supabase
    .from("documents")
    .select("id")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!doc) return NextResponse.json({ error: "Nicht gefunden" }, { status: 404 });

  const { data: chunks } = await supabase
    .from("document_chunks")
    .select("content, chunk_index")
    .eq("document_id", params.id)
    .order("chunk_index", { ascending: true })
    .limit(40);

  const text = (chunks ?? []).map((c) => c.content).join("\n\n").slice(0, 14000);
  if (!text) return NextResponse.json({ error: "Keine Inhalte gefunden" }, { status: 400 });

  const completion = await openai().chat.completions.create({
    model: CHAT_MODEL,
    messages: [
      { role: "system", content: SYSTEM_SUMMARY },
      { role: "user", content: text },
    ],
    temperature: 0.3,
  });

  const summary = completion.choices[0]?.message?.content ?? "";

  const admin = createAdminClient();
  await admin
    .from("documents")
    .update({ summary, updated_at: new Date().toISOString() })
    .eq("id", params.id);

  return NextResponse.json({ summary });
}
