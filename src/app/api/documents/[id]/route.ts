import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });

  const { data: doc } = await supabase
    .from("documents")
    .select("file_path")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!doc) return NextResponse.json({ error: "Nicht gefunden" }, { status: 404 });

  if (doc.file_path) {
    await supabase.storage.from("documents").remove([doc.file_path]);
  }
  await supabase.from("documents").delete().eq("id", params.id);
  return NextResponse.json({ ok: true });
}
