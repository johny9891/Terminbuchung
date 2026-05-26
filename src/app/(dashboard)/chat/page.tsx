import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { formatRelative, truncate } from "@/lib/utils/format";

export const dynamic = "force-dynamic";

interface MessageRow {
  id: string;
  content: string;
  document_id: string;
  created_at: string;
  documents: { title: string } | null;
}

export default async function ChatHistoryPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data } = await supabase
    .from("chat_messages")
    .select("id, content, document_id, created_at, documents(title)")
    .eq("user_id", user!.id)
    .eq("role", "user")
    .order("created_at", { ascending: false })
    .limit(50);

  const messages = (data ?? []) as unknown as MessageRow[];

  return (
    <div className="container mx-auto max-w-4xl space-y-6 p-6 lg:p-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Chat-Verlauf</h1>
        <p className="text-muted-foreground">Deine letzten Fragen an deine Dokumente.</p>
      </div>

      {messages.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <MessageSquare className="mb-3 h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Noch keine Konversation. Öffne ein Dokument, um zu starten.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {messages.map((m) => (
            <Link key={m.id} href={`/documents/${m.document_id}`}>
              <Card className="transition-all hover:border-primary/50">
                <CardContent className="p-4">
                  <div className="mb-1 flex items-center justify-between gap-3">
                    <p className="line-clamp-1 text-xs font-medium text-primary">
                      {m.documents?.title ?? "Dokument"}
                    </p>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {formatRelative(m.created_at)}
                    </span>
                  </div>
                  <p className="text-sm">{truncate(m.content, 200)}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
