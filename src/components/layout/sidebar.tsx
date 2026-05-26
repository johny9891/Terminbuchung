"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, LayoutDashboard, MessageSquare, Settings, Sparkles } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/utils/cn";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/documents", label: "Dokumente", icon: FileText },
  { href: "/chat", label: "Chat-Verlauf", icon: MessageSquare },
  { href: "/settings", label: "Einstellungen", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-card/40 lg:flex">
      <div className="flex h-16 items-center border-b border-border px-6">
        <Logo href="/dashboard" />
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {nav.map((item) => {
          const isActive =
            pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="m-3 rounded-xl border border-border bg-gradient-to-br from-primary/5 to-pink-500/5 p-4">
        <div className="mb-2 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold">Upgrade auf Pro</span>
        </div>
        <p className="mb-3 text-xs text-muted-foreground">
          Unbegrenzte Dokumente, größere Dateien, schnellere KI.
        </p>
        <Link
          href="/pricing"
          className="block w-full rounded-md bg-primary px-3 py-1.5 text-center text-xs font-medium text-primary-foreground hover:opacity-90"
        >
          Mehr erfahren
        </Link>
      </div>
    </aside>
  );
}
