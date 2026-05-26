"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, LayoutDashboard, MessageSquare, Settings } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const nav = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/documents", label: "Docs", icon: FileText },
  { href: "/chat", label: "Chat", icon: MessageSquare },
  { href: "/settings", label: "Mehr", icon: Settings },
];

export function MobileNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex h-16 items-center justify-around border-t border-border bg-background/95 backdrop-blur-xl lg:hidden">
      {nav.map((item) => {
        const isActive =
          pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-1 flex-col items-center gap-1 py-2 text-xs",
              isActive ? "text-primary" : "text-muted-foreground",
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
