# DocuAI

> Eine moderne KI-SaaS-App: PDFs hochladen, zusammenfassen, mit ihnen chatten, Lernkarten generieren.

Built mit **Next.js 14 App Router**, **Supabase** (Auth + Postgres + Storage + pgvector), **OpenAI** (GPT-4o-mini + Embeddings) und **Tailwind CSS**.

---

## Features

- **Auth** — Supabase Email + OAuth (Google, GitHub)
- **Upload** — PDF, TXT, MD mit serverseitiger Verarbeitung
- **KI-Zusammenfassung** — strukturierte Markdown-Summaries
- **Chat mit Dokument** — RAG via pgvector
- **Lernkarten** — automatisch generiert, CSV-Export
- **Verlauf & Notizen** — alle Konversationen gespeichert
- **Dashboard** — Stats, Nutzung, schneller Upload
- **Dark Mode** — Standard mit System-Sync
- **Responsive** — Sidebar Desktop, Bottom-Nav Mobile
- **Freemium** — Free / Pro / Team mit Limits in Code & DB

---

## Quickstart

```bash
# 1. Dependencies
npm install

# 2. Env vars
cp .env.example .env.local
# → NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, OPENAI_API_KEY

# 3. Datenbank migrieren
# → entweder Supabase CLI:
supabase db push
# → oder den Inhalt von supabase/migrations/0001_init.sql ins SQL-Editor der Supabase-Console kopieren

# 4. Storage-Bucket "documents" wird durch die Migration angelegt (private).

# 5. Dev-Server
npm run dev
```

App läuft auf <http://localhost:3000>.

---

## Deployment auf Vercel

1. Repo nach Vercel importieren
2. Environment-Variablen aus `.env.example` setzen
3. Deploy

Edge-Runtime wird nur für `/api/health` genutzt. Schwerere Routen (Upload, Chat) laufen auf Node.

---

## Projektstruktur

```
src/
├── app/
│   ├── (auth)/              # login, register, callback
│   ├── (dashboard)/         # dashboard, documents, chat, settings
│   ├── api/                 # REST API (upload, chat, summarize, flashcards, health)
│   ├── auth/callback/       # OAuth-Callback
│   ├── pricing/             # Marketing
│   ├── layout.tsx           # Root (Theme, Toaster, Fonts)
│   └── page.tsx             # Landing
├── components/
│   ├── auth/                # AuthForm
│   ├── chat/                # ChatPanel
│   ├── dashboard/           # StatCard
│   ├── documents/           # UploadZone, DocumentCard, Tabs, Flashcards
│   ├── layout/              # Sidebar, Topbar, MobileNav, Theme*
│   └── ui/                  # Button, Card, Input, Badge, Skeleton, Logo
├── lib/
│   ├── openai/              # client, prompts, embeddings
│   ├── supabase/            # client, server, admin, middleware
│   └── utils/               # cn, format, chunk, pdf
├── types/
└── middleware.ts            # Auth-Schutz für /dashboard, /documents, /chat, /settings
supabase/
└── migrations/0001_init.sql
docs/
├── database-schema.md
├── mvp-plan.md
├── monetization.md
├── roadmap.md
└── ui-ux.md
```

---

## Doku

- [Datenbankstruktur](docs/database-schema.md)
- [Seiten- & Komponentenstruktur](docs/architecture.md)
- [MVP-Plan](docs/mvp-plan.md)
- [Monetarisierung](docs/monetization.md)
- [UI/UX-Ideen](docs/ui-ux.md)
- [Roadmap & zukünftige Features](docs/roadmap.md)

---

## Tech-Stack

| Bereich   | Tool                           |
|-----------|--------------------------------|
| Framework | Next.js 14 (App Router)        |
| UI        | Tailwind CSS, Lucide Icons     |
| Auth/DB   | Supabase (Postgres + pgvector) |
| Storage   | Supabase Storage (S3-kompat.)  |
| AI        | OpenAI GPT-4o-mini + Embeddings |
| Hosting   | Vercel                         |
| Payments  | Stripe (vorbereitet)           |

---

## Lizenz

MIT — frei nutzbar, gerne forken.
