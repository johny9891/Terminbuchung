create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.documents(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  created_at timestamptz not null default now()
);

create index if not exists chat_messages_document_id_idx on public.chat_messages(document_id, created_at);
create index if not exists chat_messages_user_id_idx on public.chat_messages(user_id);

alter table public.chat_messages enable row level security;
create policy "chat_own_select" on public.chat_messages for select using ((select auth.uid()) = user_id);
create policy "chat_own_insert" on public.chat_messages for insert with check ((select auth.uid()) = user_id);
create policy "chat_own_delete" on public.chat_messages for delete using ((select auth.uid()) = user_id);

create table if not exists public.flashcards (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.documents(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  question text not null,
  answer text not null,
  difficulty text check (difficulty in ('easy', 'medium', 'hard')),
  created_at timestamptz not null default now()
);

create index if not exists flashcards_document_id_idx on public.flashcards(document_id);
create index if not exists flashcards_user_id_idx on public.flashcards(user_id);

alter table public.flashcards enable row level security;
create policy "flashcards_own_select" on public.flashcards for select using ((select auth.uid()) = user_id);
create policy "flashcards_own_insert" on public.flashcards for insert with check ((select auth.uid()) = user_id);
create policy "flashcards_own_update" on public.flashcards for update using ((select auth.uid()) = user_id);
create policy "flashcards_own_delete" on public.flashcards for delete using ((select auth.uid()) = user_id);

create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  document_id uuid references public.documents(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  content text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists notes_user_id_idx on public.notes(user_id);
create index if not exists notes_document_id_idx on public.notes(document_id);

alter table public.notes enable row level security;
create policy "notes_own_select" on public.notes for select using ((select auth.uid()) = user_id);
create policy "notes_own_insert" on public.notes for insert with check ((select auth.uid()) = user_id);
create policy "notes_own_update" on public.notes for update using ((select auth.uid()) = user_id);
create policy "notes_own_delete" on public.notes for delete using ((select auth.uid()) = user_id);
