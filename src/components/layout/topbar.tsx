"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { LogOut, User } from "lucide-react";
import toast from "react-hot-toast";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import type { Plan } from "@/types";

interface TopbarProps {
  email: string;
  plan: Plan;
}

export function Topbar({ email, plan }: TopbarProps) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const supabase = React.useMemo(() => createClient(), []);

  async function logout() {
    await supabase.auth.signOut();
    toast.success("Abgemeldet");
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <Badge variant={plan === "free" ? "secondary" : "default"} className="capitalize">
          {plan} Plan
        </Badge>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <div className="relative">
          <Button variant="ghost" size="icon" onClick={() => setOpen((v) => !v)}>
            <User className="h-4 w-4" />
          </Button>
          {open && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
              <div className="absolute right-0 top-12 z-50 w-56 overflow-hidden rounded-xl border border-border bg-card shadow-lg">
                <div className="border-b border-border p-3">
                  <p className="truncate text-sm font-medium">{email}</p>
                  <p className="text-xs text-muted-foreground capitalize">{plan} Plan</p>
                </div>
                <div className="p-1">
                  <Link
                    href="/settings"
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent"
                    onClick={() => setOpen(false)}
                  >
                    <User className="h-4 w-4" /> Profil
                  </Link>
                  <button
                    onClick={logout}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-destructive hover:bg-accent"
                  >
                    <LogOut className="h-4 w-4" /> Abmelden
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
