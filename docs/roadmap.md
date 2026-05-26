# Roadmap & zukünftige Features

Die Architektur ist bewusst so gewählt, dass sich diese Features später
ohne Rewrite einbauen lassen. Hier der Plan:

## Q1 — Polish & Streaming

- **Streaming-Chat** — `experimental_useObject` / SSE für tippende
  Antworten (Backend bereits Node-Runtime, geringe Migration)
- **In-App-Notes** mit Auto-Save (Tabelle existiert)
- **PDF-Viewer** mit `react-pdf`, klickbare Highlights → Chat
- **Tags & Filter** auf der Documents-Seite
- **Bulk-Upload** (Drag mehrere Files)

## Q2 — Collaboration

### Team-Workspaces
Neue Tabellen:
```sql
create table teams (
  id uuid pk,
  name text,
  owner_id uuid fk auth.users,
  plan text,
  created_at timestamptz
);
create table team_members (
  team_id uuid fk teams,
  user_id uuid fk auth.users,
  role text check (role in ('owner','admin','member')),
  primary key (team_id, user_id)
);
```
- `documents.team_id` (nullable) → geteilte Dokumente
- Workspace-Switcher in Topbar
- Invite-Flow per E-Mail
- Aktivitäts-Feed pro Workspace

### Realtime-Co-Reading
- Supabase Realtime → live Cursor + Highlights im PDF-Viewer
- Geteilte Chat-Sessions („wir besprechen dieses Dokument zusammen")
- Shared Notes mit CRDT (Yjs)

## Q3 — AI Agents & Automatisierung

### Agent-System
```sql
create table agents (
  id uuid pk,
  user_id uuid fk,
  name text,
  description text,
  system_prompt text,
  tools jsonb,                -- ['summarize','extract','export']
  schedule text,              -- cron-string oder null
  enabled boolean default true,
  created_at timestamptz
);
create table agent_runs (
  id uuid pk,
  agent_id uuid fk agents,
  input jsonb,
  output jsonb,
  status text,
  ran_at timestamptz
);
```

Beispiel-Agents:
- **Vertrags-Agent**: läuft auf jedes neue PDF, extrahiert Parteien, Fristen,
  Kündigungsklauseln → speichert strukturierte Notiz
- **Bewerbungs-Agent**: vergleicht Lebenslauf mit Stellenanzeige, schlägt
  Anpassungen vor
- **Lern-Agent**: täglicher Reminder mit den schwierigsten Flashcards
  (Spaced Repetition)

UI: Visual-Workflow-Builder (n8n-Style) für Power-User.

### Webhook-System
- `POST /api/webhooks` mit Events `document.created`, `chat.message`,
  `flashcards.generated` → Integration mit Zapier, Make, n8n.

## Q4 — Voice & Mobile

### Voice-AI
- **Whisper-Transkription** für Audio-Uploads (Vorlesungen, Meetings)
- Audio → Transkript → bestehende Doc-Pipeline
- **Voice-Chat-Eingabe** mit Web-Audio-API
- **TTS-Antworten** (OpenAI TTS) — Doc anhören statt lesen

### PWA + Mobile
- Bereits responsive — PWA-Manifest + Service-Worker dazu
- Offline-Read für gecachte Summaries
- Native-Share-Target: PDFs direkt aus iOS/Android-Browser hochladen
- Push-Notifications für Agent-Runs

## Längerfristig

### Mehrsprachigkeit
- **i18n** mit `next-intl`: DE, EN, FR, ES, IT
- Prompts pro Sprache (KI kann jede Sprache, aber UI muss übersetzt sein)
- Auto-Sprach-Erkennung des Dokuments → Default-Response-Sprache

### Lernsystem
- **Spaced Repetition (SM-2 Algorithmus)** für Flashcards
- **Daily-Quiz** aus allen Dokumenten
- **Lernpfade** — Sammlung von Dokumenten als Kurs strukturieren
- **Progress-Tracking** mit Streaks, Badges, Leaderboards (optional)

### Marketplace
- **Document-Templates**: Verträge, Bewerbungen, Studienskripte
- **Prompt-Pakete** für spezifische Use-Cases
- **Agent-Templates** zum Klonen
- Creator bekommen Revenue-Share

### Enterprise
- **SSO** (SAML, OIDC) über Supabase Auth
- **Audit-Log** für Compliance
- **Custom-Hosting** im Kundennetz (Self-Hosted-Variante)
- **GDPR-Tools**: Data-Export, Right-to-be-Forgotten in einem Klick
- **Custom-Embeddings** mit BYO-Vector-DB (Pinecone, Weaviate)

## Was wir bewusst NICHT bauen

- **Eigenes LLM trainieren** — OpenAI/Anthropic sind besser & günstiger
- **Chrome-Extension** vor Mobile-PWA — Mobile-User sind wertvoller
- **Crypto/Blockchain** — Buzz ohne Mehrwert für unsere User
- **Generative Bilder** — out of scope; Fokus bleibt Text-Dokumente
