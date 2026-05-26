"use client";

import * as React from "react";
import ReactMarkdown from "react-markdown";
import toast from "react-hot-toast";
import { Download, Loader2, RefreshCw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChatPanel } from "@/components/chat/chat-panel";
import { FlashcardsPanel } from "@/components/documents/flashcards-panel";
import { cn } from "@/lib/utils/cn";
import type { ChatMessage, Document, Flashcard } from "@/types";

type Tab = "summary" | "chat" | "flashcards";

interface Props {
  doc: Document;
  initialMessages: ChatMessage[];
  initialFlashcards: Flashcard[];
}

export function DocumentTabs({ doc, initialMessages, initialFlashcards }: Props) {
  const [tab, setTab] = React.useState<Tab>("summary");
  const [summary, setSummary] = React.useState(doc.summary ?? "");
  const [regenerating, setRegenerating] = React.useState(false);

  async function regenerate() {
    setRegenerating(true);
    try {
      const res = await fetch(`/api/documents/${doc.id}/summarize`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Fehler");
      setSummary(data.summary);
      toast.success("Zusammenfassung aktualisiert");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Fehler");
    } finally {
      setRegenerating(false);
    }
  }

  function downloadMarkdown() {
    const blob = new Blob([`# ${doc.title}\n\n${summary}`], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${doc.title.replace(/[^a-z0-9]/gi, "_")}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "summary", label: "Zusammenfassung" },
    { id: "chat", label: "Chat" },
    { id: "flashcards", label: "Lernkarten" },
  ];

  return (
    <div>
      <div className="mb-6 flex gap-1 rounded-xl border border-border bg-card/50 p-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all",
              tab === t.id
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "summary" && (
        <Card>
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-semibold">
                <Sparkles className="h-4 w-4 text-primary" />
                KI-Zusammenfassung
              </h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={downloadMarkdown} disabled={!summary}>
                  <Download className="h-3.5 w-3.5" /> Export
                </Button>
                <Button variant="outline" size="sm" onClick={regenerate} disabled={regenerating}>
                  {regenerating ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <RefreshCw className="h-3.5 w-3.5" />
                  )}
                  Neu generieren
                </Button>
              </div>
            </div>
            {summary ? (
              <article className="prose prose-sm max-w-none dark:prose-invert prose-headings:font-semibold prose-headings:tracking-tight prose-p:text-muted-foreground prose-strong:text-foreground prose-li:text-muted-foreground">
                <ReactMarkdown>{summary}</ReactMarkdown>
              </article>
            ) : (
              <div className="rounded-lg border border-dashed border-border p-8 text-center">
                <p className="text-sm text-muted-foreground">
                  {doc.status === "processing"
                    ? "Dokument wird gerade analysiert …"
                    : "Noch keine Zusammenfassung."}
                </p>
                <Button onClick={regenerate} disabled={regenerating} className="mt-4">
                  {regenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  Jetzt generieren
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {tab === "chat" && <ChatPanel documentId={doc.id} initialMessages={initialMessages} />}
      {tab === "flashcards" && (
        <FlashcardsPanel documentId={doc.id} initial={initialFlashcards} />
      )}
    </div>
  );
}
