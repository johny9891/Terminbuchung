"use client";

import * as React from "react";
import toast from "react-hot-toast";
import { Download, Loader2, RotateCw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Flashcard } from "@/types";

export function FlashcardsPanel({
  documentId,
  initial,
}: {
  documentId: string;
  initial: Flashcard[];
}) {
  const [cards, setCards] = React.useState<Flashcard[]>(initial);
  const [generating, setGenerating] = React.useState(false);
  const [revealed, setRevealed] = React.useState<Record<string, boolean>>({});

  async function generate() {
    setGenerating(true);
    try {
      const res = await fetch(`/api/documents/${documentId}/flashcards`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Fehler");
      setCards(data.cards);
      setRevealed({});
      toast.success(`${data.cards.length} Karten generiert`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Fehler");
    } finally {
      setGenerating(false);
    }
  }

  function exportCsv() {
    const rows = [["question", "answer", "difficulty"]];
    cards.forEach((c) =>
      rows.push([
        `"${c.question.replace(/"/g, '""')}"`,
        `"${c.answer.replace(/"/g, '""')}"`,
        c.difficulty ?? "",
      ]),
    );
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `flashcards-${documentId}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Lernkarten</h2>
          <p className="text-sm text-muted-foreground">
            {cards.length > 0
              ? `${cards.length} Karten verfügbar — klicke zum Aufdecken`
              : "Generiere automatisch Lernkarten aus deinem Dokument"}
          </p>
        </div>
        <div className="flex gap-2">
          {cards.length > 0 && (
            <Button variant="outline" size="sm" onClick={exportCsv}>
              <Download className="h-3.5 w-3.5" /> CSV
            </Button>
          )}
          <Button onClick={generate} disabled={generating} size="sm">
            {generating ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : cards.length > 0 ? (
              <RotateCw className="h-3.5 w-3.5" />
            ) : (
              <Sparkles className="h-3.5 w-3.5" />
            )}
            {cards.length > 0 ? "Neu generieren" : "Generieren"}
          </Button>
        </div>
      </div>

      {cards.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Sparkles className="mb-3 h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Klicke „Generieren", um 8–12 hochwertige Lernkarten zu erstellen.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {cards.map((c, i) => (
            <button
              key={c.id ?? i}
              onClick={() => setRevealed((r) => ({ ...r, [c.id ?? i]: !r[c.id ?? i] }))}
              className="group text-left"
            >
              <Card className="h-full transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md">
                <CardContent className="p-5">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">
                      Karte {i + 1}
                    </span>
                    {c.difficulty && (
                      <Badge
                        variant={
                          c.difficulty === "easy"
                            ? "success"
                            : c.difficulty === "medium"
                              ? "warning"
                              : "destructive"
                        }
                      >
                        {c.difficulty}
                      </Badge>
                    )}
                  </div>
                  <p className="mb-3 font-medium">{c.question}</p>
                  {revealed[c.id ?? i] ? (
                    <p className="text-sm text-muted-foreground">{c.answer}</p>
                  ) : (
                    <p className="text-sm italic text-muted-foreground/60">
                      Klicke zum Aufdecken
                    </p>
                  )}
                </CardContent>
              </Card>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
