# Architektur & Struktur

## Seitenstruktur

| Route                          | Zweck                                              | Auth |
|--------------------------------|----------------------------------------------------|------|
| `/`                            | Marketing-Landing mit Hero, Features, CTA          | ❌   |
| `/pricing`                     | Plan-Vergleich Free / Pro / Team                   | ❌   |
| `/login`                       | Email + OAuth                                      | ❌   |
| `/register`                    | Sign-up                                            | ❌   |
| `/auth/callback`               | OAuth-Code-Exchange                                | ❌   |
| `/dashboard`                   | Stats + Quick-Upload + letzte Dokumente            | ✅   |
| `/documents`                   | Alle Dokumente (Grid)                              | ✅   |
| `/documents/[id]`              | Detail mit Tabs: Summary, Chat, Flashcards         | ✅   |
| `/chat`                        | Globaler Konversationsverlauf                      | ✅   |
| `/settings`                    | Profil, Plan, Nutzungsmetriken                     | ✅   |

Middleware unter `src/middleware.ts` schützt alle `(dashboard)`-Routen.

## API-Routen

| Method | Pfad                                            | Beschreibung                                  |
|--------|-------------------------------------------------|-----------------------------------------------|
| GET    | `/api/health`                                   | Liveness-Check (Edge)                         |
| POST   | `/api/documents/upload`                         | Datei hochladen → extrahieren → chunken → embedden → summen |
| DELETE | `/api/documents/[id]`                           | Dokument inkl. Storage löschen                |
| POST   | `/api/documents/[id]/summarize`                 | Zusammenfassung neu generieren                |
| POST   | `/api/documents/[id]/chat`                      | RAG: Frage stellen, Antwort + History speichern |
| POST   | `/api/documents/[id]/flashcards`                | Lernkarten generieren + speichern             |

Bereit für Erweiterungen:
- `POST /api/notes`
- `POST /api/export/[id]?format=pdf|md|anki`
- `POST /api/teams`
- `POST /api/agents/[id]/run`

## Komponentenstruktur

### `components/ui/` — Atomar
- `button.tsx` — Variant- und Size-getrieben, Loading-State
- `input.tsx`
- `card.tsx` — Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter
- `badge.tsx` — 6 Varianten inkl. success/warning
- `skeleton.tsx` — Shimmer-Loading
- `logo.tsx` — Wiederverwendbares Wordmark

### `components/layout/` — App-Chrome
- `theme-provider.tsx`, `theme-toggle.tsx`
- `marketing-nav.tsx` — Header für `/`, `/pricing`
- `sidebar.tsx` — Desktop-Sidebar mit Plan-CTA
- `topbar.tsx` — Plan-Badge, Theme-Toggle, User-Menu
- `mobile-nav.tsx` — Bottom-Tab-Bar Mobile

### `components/auth/`
- `auth-form.tsx` — Login + Register in einem (Mode-Switch)

### `components/dashboard/`
- `stat-card.tsx` — Bunte Kachel mit Icon, Wert, Hint

### `components/documents/`
- `upload-zone.tsx` — Dropzone mit Limit-Check
- `document-card.tsx` + `EmptyDocumentState`
- `document-tabs.tsx` — Summary | Chat | Flashcards Switch
- `flashcards-panel.tsx` — Karten zum Aufdecken + CSV-Export

### `components/chat/`
- `chat-panel.tsx` — Nachrichten-UI, Streaming-fähig erweiterbar

### `lib/`
- `supabase/{client,server,admin,middleware}.ts` — getrennte Clients je Kontext
- `openai/{client,prompts,embeddings}.ts`
- `utils/{cn,format,chunk,pdf}.ts`

### `types/index.ts`
Alle Domain-Typen + `PLAN_LIMITS`-Konstante.

## Daten-Flow

### Upload
1. Client → `POST /api/documents/upload` (multipart)
2. Server: Auth, Plan-Limit-Check, Datei lesen
3. PDF-Text mit `pdf-parse` extrahieren (Node-Runtime)
4. Storage-Upload mit `{user_id}/{ts}-{name}` Pfadkonvention
5. `documents`-Zeile mit `status='processing'` anlegen
6. Text in 1200-Zeichen-Chunks splitten (150 Overlap)
7. Embeddings batchen → `document_chunks` einfügen (service role bypassed RLS)
8. Erste 12k Zeichen → GPT-4o-mini → Summary
9. `status='ready'`, `summary` setzen
10. Client wird zur Detailseite navigiert

### Chat (RAG)
1. Client → `POST /api/documents/[id]/chat` mit Frage
2. Server: Frage embedden
3. `match_document_chunks` RPC → Top-6 Chunks (cosine)
4. Letzte 6 History-Nachrichten laden
5. Chat-Completion mit System-Prompt + Kontext + History + Frage
6. Beide Nachrichten in `chat_messages` speichern
7. Antwort zurück an Client

### Sicherheit
- **RLS** überall — Clients kommen niemals an fremde Daten
- **Service Role** nur in `lib/supabase/admin.ts`, nur für: Chunk-Inserts,
  Statusupdates, Cross-User-Operationen, niemals im Browser
- **File-Validierung**: MIME + Größe serverseitig geprüft
- **Storage-Path-Scoping**: Bucket-Policy validiert `(storage.foldername(name))[1] = auth.uid()`
