"use client";

import * as React from "react";
import ReactMarkdown from "react-markdown";
import toast from "react-hot-toast";
import { Bot, Send, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";
import type { ChatMessage } from "@/types";

interface Props {
  documentId: string;
  initialMessages: ChatMessage[];
}

export function ChatPanel({ documentId, initialMessages }: Props) {
  const [messages, setMessages] = React.useState<Partial<ChatMessage>[]>(initialMessages);
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const endRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const question = input.trim();
    if (!question || loading) return;

    setInput("");
    setMessages((m) => [...m, { role: "user", content: question }]);
    setLoading(true);

    try {
      const res = await fetch(`/api/documents/${documentId}/chat`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Fehler");
      setMessages((m) => [...m, { role: "assistant", content: data.answer }]);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Fehler");
      setMessages((m) => m.slice(0, -1));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="flex h-[600px] flex-col">
      <CardContent className="flex-1 overflow-y-auto p-6">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">
              <Bot className="h-6 w-6" />
            </div>
            <h3 className="font-semibold">Chatte mit deinem Dokument</h3>
            <p className="mt-1 max-w-xs text-sm text-muted-foreground">
              Stelle eine Frage. Die Antwort basiert nur auf diesem Dokument.
            </p>
            <div className="mt-6 grid w-full max-w-md grid-cols-1 gap-2">
              {[
                "Fasse das Dokument in 3 Sätzen zusammen.",
                "Welche Begriffe sollte ich kennen?",
                "Erstelle eine Stichpunktliste der Kernaussagen.",
              ].map((q) => (
                <button
                  key={q}
                  onClick={() => setInput(q)}
                  className="rounded-lg border border-border bg-card/50 px-3 py-2 text-left text-sm transition-all hover:border-primary/50 hover:bg-accent"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={cn("flex gap-3", m.role === "user" ? "flex-row-reverse" : "flex-row")}
              >
                <div
                  className={cn(
                    "grid h-8 w-8 shrink-0 place-items-center rounded-lg",
                    m.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-foreground",
                  )}
                >
                  {m.role === "user" ? <UserIcon className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm",
                    m.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-foreground",
                  )}
                >
                  <div className="prose prose-sm max-w-none dark:prose-invert prose-p:my-1 prose-p:leading-relaxed">
                    <ReactMarkdown>{m.content ?? ""}</ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-3">
                <div className="grid h-8 w-8 place-items-center rounded-lg bg-secondary">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="flex items-center gap-1 rounded-2xl bg-secondary px-4 py-3">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" />
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>
        )}
      </CardContent>
      <form onSubmit={send} className="flex gap-2 border-t border-border p-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Frage zum Dokument stellen …"
          disabled={loading}
          className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <Button type="submit" loading={loading} disabled={!input.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </Card>
  );
}
