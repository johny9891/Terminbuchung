import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { openai, CHAT_MODEL } from "@/lib/openai/client";
import { SYSTEM_FLASHCARDS } from "@/lib/openai/prompts";

export const runtime = "nodejs";
export const maxDuration = 60;

interface CardInput {
  question: string;
  answer: string;
  difficulty?: "easy" | "medium" | "hard";
}

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
    .limit(30);

  const text = (chunks ?? []).map((c) => c.content).join("\n\n").slice(0, 12000);
  if (!text) return NextResponse.json({ error: "Keine Inhalte gefunden" }, { status: 400 });

  const completion = await openai().chat.completions.create({
    model: CHAT_MODEL,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: SYSTEM_FLASHCARDS },
      { role: "user", content: text },
    ],
    temperature: 0.4,
  });

  const raw = completion.choices[0]?.message?.content ?? "{}";
  let parsed: { cards?: CardInput[] };
  try {
    parsed = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Konnte Lernkarten nicht parsen" }, { status: 500 });
  }

  const cards = (parsed.cards ?? [])
    .filter((c): c is CardInput => Boolean(c?.question && c?.answer))
    .slice(0, 20);

  const admin = createAdminClient();
  await admin.from("flashcards").delete().eq("document_id", params.id).eq("user_id", user.id);

  const insertRows = cards.map((c) => ({
    document_id: params.id,
    user_id: user.id,
    question: c.question,
    answer: c.answer,
    difficulty: c.difficulty ?? "medium",
  }));

  const { data: inserted } = await admin.from("flashcards").insert(insertRows).select();

  return NextResponse.json({ cards: inserted ?? [] });
}
