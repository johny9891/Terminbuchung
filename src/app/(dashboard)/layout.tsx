import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { MobileNav } from "@/components/layout/mobile-nav";
import type { Plan } from "@/types";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("email, plan")
    .eq("id", user.id)
    .maybeSingle();

  const email = profile?.email ?? user.email ?? "";
  const plan = (profile?.plan ?? "free") as Plan;

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Topbar email={email} plan={plan} />
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">{children}</main>
      </div>
      <MobileNav />
    </div>
  );
}
