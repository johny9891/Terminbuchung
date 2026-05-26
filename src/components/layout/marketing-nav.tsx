import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export function MarketingNav() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/70 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Logo />
        <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
          <a href="#features" className="transition-colors hover:text-foreground">
            Features
          </a>
          <a href="#use-cases" className="transition-colors hover:text-foreground">
            Use Cases
          </a>
          <Link href="/pricing" className="transition-colors hover:text-foreground">
            Preise
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/login" className="hidden sm:block">
            <Button variant="ghost" size="sm">
              Anmelden
            </Button>
          </Link>
          <Link href="/register">
            <Button size="sm">Kostenlos starten</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
