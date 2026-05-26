import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PLAN_LIMITS, type Plan } from "@/types";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("email, full_name, plan, usage_tokens, usage_documents, created_at")
    .eq("id", user!.id)
    .maybeSingle();

  const plan = (profile?.plan ?? "free") as Plan;
  const limit = PLAN_LIMITS[plan];

  return (
    <div className="container mx-auto max-w-3xl space-y-6 p-6 lg:p-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Einstellungen</h1>
        <p className="text-muted-foreground">Verwalte dein Profil und deinen Plan.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profil</CardTitle>
          <CardDescription>Deine Kontodaten</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex justify-between border-b border-border pb-3">
            <span className="text-muted-foreground">Name</span>
            <span className="font-medium">{profile?.full_name ?? "—"}</span>
          </div>
          <div className="flex justify-between border-b border-border pb-3">
            <span className="text-muted-foreground">E-Mail</span>
            <span className="font-medium">{profile?.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Mitglied seit</span>
            <span className="font-medium">
              {profile?.created_at ? new Date(profile.created_at).toLocaleDateString("de-DE") : "—"}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-start justify-between space-y-0">
          <div>
            <CardTitle>Abonnement</CardTitle>
            <CardDescription>Aktueller Plan und Nutzung</CardDescription>
          </div>
          <Badge variant={plan === "free" ? "secondary" : "default"} className="capitalize">
            {plan}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="mb-1.5 flex justify-between text-sm">
              <span className="text-muted-foreground">Dokumente</span>
              <span>
                {profile?.usage_documents ?? 0} / {limit.documents}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full bg-primary"
                style={{
                  width: `${Math.min(100, ((profile?.usage_documents ?? 0) / limit.documents) * 100)}%`,
                }}
              />
            </div>
          </div>
          <div>
            <div className="mb-1.5 flex justify-between text-sm">
              <span className="text-muted-foreground">Token (Monat)</span>
              <span>
                {(profile?.usage_tokens ?? 0).toLocaleString("de-DE")} /{" "}
                {limit.tokensPerMonth.toLocaleString("de-DE")}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full bg-primary"
                style={{
                  width: `${Math.min(100, ((profile?.usage_tokens ?? 0) / limit.tokensPerMonth) * 100)}%`,
                }}
              />
            </div>
          </div>
          <Link href="/pricing">
            <Button className="w-full">{plan === "free" ? "Upgrade auf Pro" : "Plan verwalten"}</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
