import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, FileText } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DocumentTabs } from "@/components/documents/document-tabs";
import { formatBytes, formatRelative } from "@/lib/utils/format";
import type { ChatMessage, Document, Flashcard } from "@/types";

export const dynamic = "force-dynamic";

export default async function DocumentDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: doc }, { data: messages }, { data: cards }] = await Promise.all([
    supabase.from("documents").select("*").eq("id", params.id).eq("user_id", user!.id).maybeSingle(),
    supabase
      .from("chat_messages")
      .select("*")
      .eq("document_id", params.id)
      .eq("user_id", user!.id)
      .order("created_at", { ascending: true }),
    supabase
      .from("flashcards")
      .select("*")
      .eq("document_id", params.id)
      .eq("user_id", user!.id)
      .order("created_at", { ascending: true }),
  ]);

  if (!doc) notFound();
  const document = doc as Document;

  return (
    <div className="container mx-auto max-w-6xl space-y-6 p-6 lg:p-10">
      <Link href="/documents">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="h-3.5 w-3.5" /> Zurück
        </Button>
      </Link>

      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{document.title}</h1>
            <p className="text-sm text-muted-foreground">
              {formatBytes(document.file_size)} · {formatRelative(document.created_at)}
              {document.page_count ? ` · ${document.page_count} Seiten` : ""}
            </p>
          </div>
        </div>
        <Badge
          variant={
            document.status === "ready"
              ? "success"
              : document.status === "processing"
                ? "warning"
                : "destructive"
          }
        >
          {document.status === "ready"
            ? "Bereit"
            : document.status === "processing"
              ? "Verarbeitung läuft"
              : "Fehler"}
        </Badge>
      </div>

      <DocumentTabs
        doc={document}
        initialMessages={(messages ?? []) as ChatMessage[]}
        initialFlashcards={(cards ?? []) as Flashcard[]}
      />
    </div>
  );
}
