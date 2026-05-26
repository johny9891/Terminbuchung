# Datenbankstruktur

Volle Migration: [`supabase/migrations/0001_init.sql`](../supabase/migrations/0001_init.sql).

## Übersicht

```
auth.users (Supabase managed)
   │
   ├── profiles             (1:1)  → plan, usage_*
   │
   ├── documents            (1:n)  → file_path, summary, status
   │       │
   │       ├── document_chunks  (1:n) → embedding vector(1536)
   │       ├── chat_messages    (1:n) → role, content
   │       ├── flashcards       (1:n) → question, answer, difficulty
   │       └── notes            (1:n) → title, content
```

## Tabellen

### `profiles`
1:1 zu `auth.users`. Wird beim Sign-up via Trigger automatisch angelegt.

| Spalte             | Typ           | Notiz                              |
|--------------------|---------------|------------------------------------|
| `id`               | `uuid` PK     | FK → `auth.users(id)` ON DELETE CASCADE |
| `email`            | `text`        |                                    |
| `full_name`        | `text`        |                                    |
| `avatar_url`       | `text`        |                                    |
| `plan`             | `text`        | `'free' \| 'pro' \| 'team'`        |
| `usage_tokens`     | `int`         | aktueller Monatsverbrauch          |
| `usage_documents`  | `int`         | Anzahl aktiver Dokumente           |
| `stripe_customer_id` | `text`      | für späteres Billing               |
| `created_at`       | `timestamptz` |                                    |

### `documents`
| Spalte         | Typ           | Notiz                                          |
|----------------|---------------|------------------------------------------------|
| `id`           | `uuid` PK     |                                                |
| `user_id`      | `uuid` FK     | → `auth.users(id)`                             |
| `title`        | `text`        | Default = Dateiname ohne Extension             |
| `file_name`    | `text`        |                                                |
| `file_path`    | `text`        | Pfad im Storage-Bucket `documents`             |
| `file_size`    | `bigint`      | Bytes                                          |
| `mime_type`    | `text`        |                                                |
| `status`       | `text`        | `'processing' \| 'ready' \| 'failed'`          |
| `summary`      | `text`        | KI-Markdown                                    |
| `page_count`   | `int`         | nur für PDFs                                   |
| `created_at`   | `timestamptz` |                                                |
| `updated_at`   | `timestamptz` |                                                |

Indizes: `(user_id)`, `(created_at desc)`.

### `document_chunks`
Vektorspeicher für RAG. `embedding` ist `vector(1536)` (OpenAI `text-embedding-3-small`).

| Spalte          | Typ          |
|-----------------|--------------|
| `id`            | `uuid` PK    |
| `document_id`   | `uuid` FK    |
| `user_id`       | `uuid` FK    |
| `chunk_index`   | `int`        |
| `content`       | `text`       |
| `token_count`   | `int`        |
| `embedding`     | `vector(1536)` |

IVFFlat-Index auf `embedding` für Cosine-Similarity. RPC `match_document_chunks(document_id, query_embedding, k)` liefert Top-K.

### `chat_messages`
Vollständiger Verlauf pro Dokument.

| Spalte         | Typ        | Notiz                                |
|----------------|------------|--------------------------------------|
| `id`           | `uuid` PK  |                                      |
| `document_id`  | `uuid` FK  |                                      |
| `user_id`      | `uuid` FK  |                                      |
| `role`         | `text`     | `'user' \| 'assistant' \| 'system'`  |
| `content`      | `text`     |                                      |
| `created_at`   | `timestamptz` |                                   |

### `flashcards`
| Spalte         | Typ        | Notiz                              |
|----------------|------------|------------------------------------|
| `id`           | `uuid` PK  |                                    |
| `document_id`  | `uuid` FK  |                                    |
| `user_id`      | `uuid` FK  |                                    |
| `question`     | `text`     |                                    |
| `answer`       | `text`     |                                    |
| `difficulty`   | `text`     | `'easy' \| 'medium' \| 'hard'`     |
| `created_at`   | `timestamptz` |                                 |

### `notes`
Freier Notiz-Bereich pro Dokument oder global (`document_id` nullable).

| Spalte         | Typ        |
|----------------|------------|
| `id`           | `uuid` PK  |
| `document_id`  | `uuid` FK nullable |
| `user_id`      | `uuid` FK  |
| `title`        | `text`     |
| `content`      | `text`     |
| `created_at`   | `timestamptz` |
| `updated_at`   | `timestamptz` |

## Storage

Bucket `documents` (private). Pfadkonvention: `{user_id}/{timestamp}-{filename}`.
RLS-Policies erlauben Read/Write/Delete nur innerhalb des eigenen Folders.

## Row-Level Security

Alle Tabellen haben RLS aktiviert. Policy-Muster: `auth.uid() = user_id`. So
können Clients direkt gegen Supabase queryen, ohne dass Owner-Checks im
Code wiederholt werden müssen.

## Erweiterungen für später

- `teams (id, name, owner_id)` + `team_members (team_id, user_id, role)` für
  Team-Workspaces
- `documents.team_id` (nullable) für geteilte Dokumente
- `agents (id, user_id, config, created_at)` für persistente AI-Agents
- `voice_sessions` für Voice-AI (Whisper-Transkripte)
- `tags (id, name, user_id)` + `document_tags`
