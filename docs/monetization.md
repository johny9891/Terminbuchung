# Monetarisierungsmodell

## Freemium-Architektur

Die App ist **kostenlos nutzbar**, aber begrenzt — sodass jeder Nutzer den
Mehrwert vor dem Bezahlen erleben kann. Premium löst messbare Schmerzpunkte:
mehr Dokumente, größere Dateien, schnellere Modelle, Team-Sharing.

## Plan-Vergleich

| Feature                   | Free            | Pro (9 €/Mo)   | Team (29 €/Mo) |
|---------------------------|-----------------|----------------|----------------|
| Dokumente                 | 3               | 100            | 1.000          |
| Max Dateigröße            | 5 MB            | 25 MB          | 100 MB         |
| Token/Monat               | 50.000          | 1 Mio          | 10 Mio         |
| Modell                    | GPT-4o-mini     | GPT-4o-mini    | GPT-4o + mini  |
| Lernkarten-Export         | nur CSV         | CSV + Anki     | + API          |
| Chat-History speichern    | 30 Tage         | unbegrenzt     | unbegrenzt     |
| Team-Workspaces           | —               | —              | 5 Mitglieder   |
| Support                   | Community       | Priority       | Dedicated      |

Limits sind in `src/types/index.ts` als `PLAN_LIMITS` zentral abgelegt und
werden serverseitig in `/api/documents/upload` durchgesetzt.

## Preisstrategie

- **Niedrige Einstiegshürde**: Free reicht für gelegentliche Nutzer.
- **Pro = klarer Power-User-Sprung**: 33× mehr Dokumente, 20× mehr Token,
  bessere Modelle. Wer 5 Dokumente/Monat hochlädt, upgraded.
- **Team = B2B-Hebel**: Ab dem Moment, wo es kollaborativ wird.
- **Studenten-Rabatt** (50%) via Verifikation über studentbeans/UNiDAYS.
- **Jahresplan** mit -20% als Sticky-Banner im Dashboard.

## Stripe-Integration (vorbereitet)

`stripe_customer_id` ist in `profiles` bereits vorhanden. Geplante Routen:

```
POST /api/stripe/checkout         → Checkout Session erstellen
POST /api/stripe/portal           → Customer Portal Link
POST /api/stripe/webhook          → subscription.created/updated/deleted
```

Webhook-Logik:
- `subscription.created` → `profiles.plan = 'pro' | 'team'`
- `subscription.deleted` → `profiles.plan = 'free'` + Soft-Limit-Warnung
- `invoice.payment_failed` → E-Mail + 7 Tage Grace-Period

## Andere Einnahmequellen (Phase 2)

1. **API-Plan** für Devs: 0,001 €/Token, 99 €/Mo Sockel — andere SaaS
   können DocuAI als Backend für eigene Doc-Workflows nutzen.
2. **Affiliate** mit Anki, Notion, Obsidian (Export-Integration).
3. **Whitelabel-Lizenzen** für Bildungseinrichtungen ab 2.000 €/Jahr.
4. **One-Time-Lifetime-Deal** (LTD) als Launch-Boost auf AppSumo.

## Kosten-Kalkulation pro Nutzer

Bei GPT-4o-mini (~0,15 $ Input / 0,60 $ Output / 1M Token):

- **Free**: 50k Token ≈ 0,05 € → ~95 % Margin, finanziert über Conversion
- **Pro**: 1M Token ≈ 0,75 € + Storage ≈ 1 € → ~88 % Brutto-Margin bei 9 €
- **Team**: 10M Token ≈ 7,50 € + Storage ≈ 3 € → ~64 % Brutto-Margin bei 29 €

Sehr gesund, weil Embeddings nur einmal pro Dokument berechnet werden
und Caching auf Summary-Ebene möglich ist.

## Conversion-Hebel

- **Friction-Free-Trial**: keine Kreditkarte, Sign-Up in 10s.
- **Soft-Paywall**: ab 3. Dokument Banner „Upgrade für 100 Dokumente".
- **In-App-Upgrade-Prompts**: nach erfolgreichem Chat („Pro-User chatten
  bis zu 100× pro Tag — du heute bereits {n}").
- **Annual-Toggle** auf der Pricing-Page (Standard-Trick, +30 % Conversion).
