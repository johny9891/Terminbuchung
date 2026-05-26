import Link from "next/link";
import { Check } from "lucide-react";
import { MarketingNav } from "@/components/layout/marketing-nav";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Preise · DocuAI" };

const plans = [
  {
    name: "Free",
    price: "0 €",
    period: "/ Monat",
    description: "Perfekt zum Ausprobieren",
    features: [
      "3 Dokumente",
      "5 MB pro Datei",
      "50.000 Token / Monat",
      "KI-Zusammenfassung",
      "Chat mit Dokument",
    ],
    cta: "Kostenlos starten",
    href: "/register",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "9 €",
    period: "/ Monat",
    description: "Für Studenten & Freelancer",
    features: [
      "100 Dokumente",
      "25 MB pro Datei",
      "1 Mio. Token / Monat",
      "Lernkarten-Export (Anki, CSV)",
      "Schnellere Modelle",
      "Priority Support",
    ],
    cta: "Pro starten",
    href: "/register?plan=pro",
    highlighted: true,
  },
  {
    name: "Team",
    price: "29 €",
    period: "/ Monat",
    description: "Für Teams und Power-User",
    features: [
      "1.000 Dokumente",
      "100 MB pro Datei",
      "10 Mio. Token / Monat",
      "Team-Workspace (5 Mitglieder)",
      "API-Zugriff",
      "Custom-Integrationen",
    ],
    cta: "Team kontaktieren",
    href: "/register?plan=team",
    highlighted: false,
  },
];

export default function PricingPage() {
  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-purple-500/10 blur-[120px]" />
      </div>
      <MarketingNav />
      <main className="container mx-auto max-w-6xl px-4 py-16">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Einfache, faire <span className="gradient-text">Preise</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Starte kostenlos. Upgrade nur, wenn du mehr brauchst.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={
                plan.highlighted
                  ? "relative border-primary/50 shadow-2xl shadow-primary/10 lg:scale-105"
                  : ""
              }
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                  Beliebt
                </div>
              )}
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold">{plan.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link href={plan.href} className="mt-8 block">
                  <Button
                    className="w-full"
                    variant={plan.highlighted ? "primary" : "outline"}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
