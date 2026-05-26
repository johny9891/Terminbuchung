import Link from "next/link";
import { FileText, MessageSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatBytes, formatRelative, truncate } from "@/lib/utils/format";
import type { Document } from "@/types";

export function DocumentCard({ doc }: { doc: Document }) {
  return (
    <Link href={`/documents/${doc.id}`}>
      <Card className="group h-full transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
        <CardContent className="p-5">
          <div className="mb-4 flex items-start justify-between">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary transition-transform group-hover:scale-110">
              <FileText className="h-5 w-5" />
            </div>
            <Badge
              variant={
                doc.status === "ready"
                  ? "success"
                  : doc.status === "processing"
                    ? "warning"
                    : "destructive"
              }
            >
              {doc.status === "ready" ? "Bereit" : doc.status === "processing" ? "Lädt …" : "Fehler"}
            </Badge>
          </div>
          <h3 className="mb-1 line-clamp-1 font-semibold">{doc.title}</h3>
          <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
            {doc.summary ? truncate(doc.summary, 100) : "Noch keine Zusammenfassung verfügbar."}
          </p>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{formatBytes(doc.file_size)}</span>
            <span>{formatRelative(doc.created_at)}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export function EmptyDocumentState() {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-4 grid h-12 w-12 place-items-center rounded-full bg-muted">
          <MessageSquare className="h-5 w-5 text-muted-foreground" />
        </div>
        <h3 className="mb-1 font-semibold">Noch keine Dokumente</h3>
        <p className="max-w-sm text-sm text-muted-foreground">
          Lade dein erstes PDF hoch, um eine KI-Zusammenfassung und einen Chat zu erhalten.
        </p>
      </CardContent>
    </Card>
  );
}
