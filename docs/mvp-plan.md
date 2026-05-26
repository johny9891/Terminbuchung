# MVP-Plan

Ziel: **In 14 Tagen launch-ready**. Eine kostenlose Version, die echten Nutzen
liefert; bezahlte Features klar abgegrenzt.

## Phase 1 — Foundation (Tag 1–2)

- [x] Next.js 14 App Router + Tailwind + TypeScript
- [x] Supabase-Projekt erstellen, Migration `0001_init.sql` deployen
- [x] Auth (Email + OAuth) verkabeln
- [x] Theme-Provider mit Dark Mode
- [x] UI-Kit (Button, Card, Input, Badge, Skeleton)

## Phase 2 — Core (Tag 3–7)

- [x] Marketing-Landing + Pricing-Page
- [x] Dashboard-Layout (Sidebar Desktop, BottomNav Mobile)
- [x] Upload-Zone mit Limits & Validierung
- [x] PDF-Text-Extraktion + Chunking + Embeddings
- [x] Summary-Generierung mit GPT-4o-mini
- [x] Document-Detail mit 3-Tab-Layout
- [x] RAG-Chat mit pgvector
- [x] Flashcard-Generator mit JSON-Mode
- [x] CSV/Markdown-Export

## Phase 3 — Polish (Tag 8–10)

- [ ] **Streaming-Antworten** im Chat (Server-Sent Events)
- [ ] **Document-Delete** im UI (Backend-Route ist da)
- [ ] **Notiz-Feature** mit Auto-Save (Tabelle existiert bereits)
- [ ] **Empty States & Skeletons** für alle Listen
- [ ] **Onboarding-Tour** beim ersten Login
- [ ] **Tastatur-Shortcuts** (CMD+K Search, CMD+/ Help)
- [ ] **Toast-Stacking & Optimistic UI**

## Phase 4 — Monetarisierung (Tag 11–12)

- [ ] **Stripe Checkout** für Pro-Plan (`/api/stripe/checkout`)
- [ ] **Stripe Webhook** für `customer.subscription.*`
- [ ] **Customer-Portal-Link** in Settings
- [ ] **Monatlicher Token-Reset** via Supabase Cron (`pg_cron`)
- [ ] **Hard-Limits enforcen** in allen API-Routes (Chat, Flashcards, …)

## Phase 5 — Launch (Tag 13–14)

- [ ] **Domain + Vercel-Production-Deploy**
- [ ] **Privacy Policy + AGB + Impressum** (Pflicht in DE)
- [ ] **Analytics** (Plausible oder PostHog)
- [ ] **Sentry** für Error-Tracking
- [ ] **OG-Image + Sitemap + Robots.txt**
- [ ] **Product-Hunt-Launch** vorbereiten
- [ ] **Erste 100 Nutzer** über X/LinkedIn/Reddit

## Out-of-Scope für MVP

- Team-Features (Solo first, dann skalieren)
- Mehrsprachigkeit (DE/EN reicht, KI versteht beide)
- API-Zugang für externe Devs
- Mobile Apps (PWA reicht)
- Voice-Input

## Tech-Schulden, die OK sind im MVP

- Synchrone Verarbeitung im Upload (statt Queue + Webhook).
  Akzeptabel, weil PDFs < 25MB in ~10s verarbeitet werden.
- Keine Volltextsuche über Dokumente (nur per-Dokument-Chat).
- Kein Caching von Embeddings über Dokumente hinweg (jedes Dokument hat eigene Chunks).

## Wann zu refactoren

| Trigger                       | Refactor                                              |
|-------------------------------|-------------------------------------------------------|
| > 100 Uploads/Tag             | Queue-Worker (Inngest, Trigger.dev oder Supabase Edge Functions) |
| > 1000 zahlende Nutzer        | Caching-Layer (Upstash Redis) für Embeddings + Summaries |
| Multi-Region nötig            | Vercel Edge + Supabase Read-Replicas                  |
| Team-Features starten         | Workspace-Konzept einführen (`teams`-Tabelle)         |
