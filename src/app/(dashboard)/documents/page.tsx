import { createClient } from "@/lib/supabase/server";
import { UploadZone } from "@/components/documents/upload-zone";
import { DocumentCard, EmptyDocumentState } from "@/components/documents/document-card";
import type { Document, Plan } from "@/types";

export const dynamic = "force-dynamic";

export default async function DocumentsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: profile }, { data: docs }] = await Promise.all([
    supabase.from("profiles").select("plan").eq("id", user!.id).maybeSingle(),
    supabase
      .from("documents")
      .select("*")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false }),
  ]);

  const plan = (profile?.plan ?? "free") as Plan;

  return (
    <div className="container mx-auto max-w-7xl space-y-8 p-6 lg:p-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Deine Dokumente</h1>
        <p className="text-muted-foreground">
          Alle hochgeladenen Dateien an einem Ort. Klicke ein Dokument an, um zu chatten oder Lernkarten
          zu generieren.
        </p>
      </div>

      <UploadZone plan={plan} />

      {docs && docs.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {(docs as Document[]).map((doc) => (
            <DocumentCard key={doc.id} doc={doc} />
          ))}
        </div>
      ) : (
        <EmptyDocumentState />
      )}
    </div>
  );
}
