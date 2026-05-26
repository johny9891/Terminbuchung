import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  FileText,
  GraduationCap,
  MessageSquare,
  Sparkles,
  Upload,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MarketingNav } from "@/components/layout/marketing-nav";

const features = [
  {
    icon: Upload,
    title: "Sicherer Upload",
    description: "PDFs, Verträge, Skripte — alles bleibt verschlüsselt und privat in deinem Workspace.",
  },
  {
    icon: Sparkles,
    title: "KI-Zusammenfassung",
    description: "Strukturierte TL;DRs mit Kernaussagen, Definitionen und offenen Fragen in Sekunden.",
  },
  {
    icon: MessageSquare,
    title: "Chat mit Dokument",
    description: "Stelle Fragen in natürlicher Sprache. Antworten basieren ausschließlich auf deinem Dokument.",
  },
  {
    icon: BookOpen,
    title: "Lernkarten generieren",
    description: "Automatisch erzeugte Flashcards für effizientes Wiederholen — exportierbar nach Anki & CSV.",
  },
  {
    icon: Zap,
    title: "Sofort einsatzbereit",
    description: "Kein Setup. Login, hochladen, fertig — alle Ergebnisse bleiben in deinem Verlauf.",
  },
  {
    icon: FileText,
    title: "Notizen & Export",
    description: "Speichere eigene Notizen pro Dokument und exportiere Zusammenfassungen als Markdown oder PDF.",
  },
];

const useCases = [
  { icon: GraduationCap, title: "Studenten", body: "Vorlesungsskripte in Minuten verstehen und mit Lernkarten lernen." },
  { icon: Briefcase, title: "Freelancer", body: "Briefings & Verträge schnell analysieren und Risiken identifizieren." },
  { icon: FileText, title: "Bewerbungen", body: "Stellenanzeigen extrahieren, Lebensläufe gezielt anpassen." },
];

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-purple-500/20 blur-[120px]" />
        <div className="absolute right-0 top-1/3 h-[400px] w-[400px] rounded-full bg-pink-500/10 blur-[100px]" />
      </div>

      <MarketingNav />

      <section className="container mx-auto max-w-6xl px-4 pb-24 pt-16 sm:pt-24">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Powered by GPT-4o · Mit Liebe gebaut
          </div>
          <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-6xl">
            Verstehe jedes Dokument in <span className="gradient-text">Sekunden</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-balance text-lg text-muted-foreground">
            Lade PDFs hoch, chatte mit deinen Inhalten, erhalte präzise Zusammenfassungen und generiere
            Lernkarten — alles in einer minimalistischen, schnellen Oberfläche.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/register">
              <Button size="lg" className="group">
                Kostenlos starten
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline">
                Preise ansehen
              </Button>
            </Link>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            3 Dokumente kostenlos · Keine Kreditkarte erforderlich
          </p>
        </div>

        <div className="mt-20 rounded-3xl border border-border bg-gradient-to-br from-card to-background p-2 shadow-2xl shadow-purple-500/10">
          <div className="aspect-[16/9] w-full overflow-hidden rounded-2xl border border-border bg-card">
            <div className="grid h-full grid-cols-12 gap-0">
              <div className="col-span-3 hidden border-r border-border bg-secondary/30 p-4 md:block">
                <div className="space-y-2">
                  <div className="h-3 w-24 rounded bg-muted" />
                  <div className="h-3 w-16 rounded bg-muted" />
                  <div className="mt-6 h-8 rounded bg-primary/20" />
                  <div className="h-8 rounded bg-muted/50" />
                  <div className="h-8 rounded bg-muted/50" />
                </div>
              </div>
              <div className="col-span-12 p-6 md:col-span-9">
                <div className="mb-4 flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  <div className="h-3 w-32 rounded bg-muted" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-full rounded bg-muted/70" />
                  <div className="h-4 w-5/6 rounded bg-muted/70" />
                  <div className="h-4 w-4/6 rounded bg-muted/70" />
                </div>
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-border bg-secondary/20 p-4">
                    <div className="mb-2 h-3 w-20 rounded bg-primary/40" />
                    <div className="h-3 w-full rounded bg-muted/70" />
                  </div>
                  <div className="rounded-xl border border-border bg-secondary/20 p-4">
                    <div className="mb-2 h-3 w-24 rounded bg-pink-400/40" />
                    <div className="h-3 w-full rounded bg-muted/70" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="container mx-auto max-w-6xl px-4 py-20">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Alles, was du für smarte Dokumentenarbeit brauchst
          </h2>
          <p className="mt-4 text-muted-foreground">
            Minimalistisches Design, leistungsstarke KI — kein überladenes Interface.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <Card key={f.title} className="group transition-all hover:border-primary/40 hover:shadow-md">
              <CardContent className="p-6">
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform group-hover:scale-110">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mb-2 font-semibold">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section id="use-cases" className="container mx-auto max-w-6xl px-4 py-20">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Für deinen Workflow</h2>
          <p className="mt-4 text-muted-foreground">Egal, ob Lernen, Arbeiten oder Bewerben.</p>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {useCases.map((u) => (
            <Card key={u.title} className="overflow-hidden">
              <CardContent className="p-6">
                <u.icon className="mb-4 h-6 w-6 text-primary" />
                <h3 className="mb-2 font-semibold">{u.title}</h3>
                <p className="text-sm text-muted-foreground">{u.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="container mx-auto max-w-4xl px-4 py-20 text-center">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/10 via-background to-pink-500/10 p-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Bereit, dein erstes Dokument hochzuladen?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-muted-foreground">
            Starte kostenlos. Upgrade jederzeit. Keine Verpflichtung.
          </p>
          <Link href="/register" className="mt-8 inline-block">
            <Button size="lg" className="group">
              Jetzt loslegen
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </Link>
        </div>
      </section>

      <footer className="border-t border-border/40 py-8">
        <div className="container mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-sm text-muted-foreground md:flex-row">
          <p>© {new Date().getFullYear()} DocuAI. Made with care.</p>
          <div className="flex items-center gap-6">
            <Link href="/pricing" className="hover:text-foreground">Preise</Link>
            <a href="#" className="hover:text-foreground">Datenschutz</a>
            <a href="#" className="hover:text-foreground">AGB</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
