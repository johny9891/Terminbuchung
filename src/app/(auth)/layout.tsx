import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-purple-500/10 blur-[120px]" />
      </div>
      <header className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-6 py-5">
        <Logo />
        <ThemeToggle />
      </header>
      <main className="flex min-h-screen items-center justify-center px-4 py-24">
        <div className="w-full max-w-md animate-fade-in">{children}</div>
      </main>
      <footer className="absolute inset-x-0 bottom-0 py-6 text-center text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          ← Zurück zur Startseite
        </Link>
      </footer>
    </div>
  );
}
