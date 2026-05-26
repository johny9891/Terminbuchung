import Link from "next/link";
import { FileText, MessageSquare, Sparkles, Zap } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { StatCard } from "@/components/dashboard/stat-card";
import { UploadZone } from "@/components/documents/upload-zone";
import { DocumentCard, EmptyDocumentState } from "@/components/documents/document-card";
import { PLAN_LIMITS, type Document, type Plan } from "@/types";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: profile }, { data: docs, count: docCount }, { count: chatCount }] = await Promise.all([
    supabase.from("profiles").select("full_name, plan, usage_tokens").eq("id", user!.id).maybeSingle(),
    supabase
      .from("documents")
      .select("*", { count: "exact" })
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false })
      .limit(6),
    supabase
      .from("chat_messages")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user!.id),
  ]);

  const plan = (profile?.plan ?? "free") as Plan;
  const limit = PLAN_LIMITS[plan];
  const tokensUsed = profile?.usage_tokens ?? 0;
  const tokenPct = Math.min(100, Math.round((tokensUsed / limit.tokensPerMonth) * 100));

  return (
    <div className="container mx-auto max-w-7xl space-y-8 p-6 lg:p-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Willkommen{profile?.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""} 👋
        </h1>
        <p className="text-muted-foreground">Hier ist deine KI-Dokumentenübersicht.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Dokumente"
          value={docCount ?? 0}
          hint={`von ${limit.documents} im ${plan}-Plan`}
          icon={FileText}
          accent="primary"
        />
        <StatCard
          label="Chat-Nachrichten"
          value={chatCount ?? 0}
          hint="insgesamt gestellt"
          icon={MessageSquare}
          accent="pink"
        />
        <StatCard
          label="Token-Nutzung"
          value={`${tokenPct}%`}
          hint={`${tokensUsed.toLocaleString("de-DE")} / ${limit.tokensPerMonth.toLocaleString("de-DE")}`}
          icon={Zap}
          accent="amber"
        />
        <StatCard
          label="Aktueller Plan"
          value={plan.charAt(0).toUpperCase() + plan.slice(1)}
          hint={plan === "free" ? "Upgrade verfügbar" : "Premium aktiv"}
          icon={Sparkles}
          accent="emerald"
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">Neues Dokument</h2>
        <UploadZone plan={plan} />
      </div>

      <div className="space-y-4">
        <div className="flex items-end justify-between">
          <h2 className="text-xl font-semibold tracking-tight">Letzte Dokumente</h2>
          <Link href="/documents" className="text-sm font-medium text-primary hover:underline">
            Alle ansehen →
          </Link>
        </div>
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
    </div>
  );
}
