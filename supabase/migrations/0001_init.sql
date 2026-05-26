-- DocuAI initial schema
-- Run via Supabase CLI or paste into the SQL editor.

create extension if not exists "pgcrypto";
create extension if not exists "vector";

-- ----------------------------------------------------------------------
-- profiles: 1:1 with auth.users, holds plan + usage counters
-- ----------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  plan text not null default 'free' check (plan in ('free', 'pro', 'team')),
  usage_tokens int not null default 0,
  usage_documents int not null default 0,
  stripe_customer_id text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create profile when a user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ----------------------------------------------------------------------
-- documents: file metadata + summary
-- ----------------------------------------------------------------------
create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  file_name text not null,
  file_path text not null,
  file_size bigint not null,
  mime_type text not null,
  status text not null default 'processing' check (status in ('processing', 'ready', 'failed')),
  summary text,
  page_count int,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists documents_user_id_idx on public.documents(user_id);
create index if not exists documents_created_at_idx on public.documents(created_at desc);

alter table public.documents enable row level security;

create policy "documents_own_select" on public.documents for select using (auth.uid() = user_id);
create policy "documents_own_insert" on public.documents for insert with check (auth.uid() = user_id);
create policy "documents_own_update" on public.documents for update using (auth.uid() = user_id);
create policy "documents_own_delete" on public.documents for delete using (auth.uid() = user_id);

-- ----------------------------------------------------------------------
-- document_chunks: vector store for RAG
-- ----------------------------------------------------------------------
create table if not exists public.document_chunks (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.documents(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  chunk_index int not null,
  content text not null,
  token_count int not null default 0,
  embedding vector(1536),
  created_at timestamptz not null default now()
);

create index if not exists document_chunks_document_id_idx on public.document_chunks(document_id);
create index if not exists document_chunks_embedding_idx
  on public.document_chunks
  using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

alter table public.document_chunks enable row level security;
create policy "chunks_own_select" on public.document_chunks for select using (auth.uid() = user_id);
create policy "chunks_own_insert" on public.document_chunks for insert with check (auth.uid() = user_id);
create policy "chunks_own_delete" on public.document_chunks for delete using (auth.uid() = user_id);

-- Similarity search RPC
create or replace function public.match_document_chunks(
  p_document_id uuid,
  p_query_embedding vector(1536),
  p_match_count int default 5
)
returns table (
  id uuid,
  content text,
  chunk_index int,
  similarity float
)
language sql stable
as $$
  select
    dc.id,
    dc.content,
    dc.chunk_index,
    1 - (dc.embedding <=> p_query_embedding) as similarity
  from public.document_chunks dc
  where dc.document_id = p_document_id
    and dc.embedding is not null
  order by dc.embedding <=> p_query_embedding
  limit p_match_count;
$$;

-- ----------------------------------------------------------------------
-- chat_messages
-- ----------------------------------------------------------------------
create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.documents(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  created_at timestamptz not null default now()
);

create index if not exists chat_messages_document_id_idx on public.chat_messages(document_id, created_at);

alter table public.chat_messages enable row level security;
create policy "chat_own_select" on public.chat_messages for select using (auth.uid() = user_id);
create policy "chat_own_insert" on public.chat_messages for insert with check (auth.uid() = user_id);
create policy "chat_own_delete" on public.chat_messages for delete using (auth.uid() = user_id);

-- ----------------------------------------------------------------------
-- flashcards
-- ----------------------------------------------------------------------
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

alter table public.flashcards enable row level security;
create policy "flashcards_own_select" on public.flashcards for select using (auth.uid() = user_id);
create policy "flashcards_own_insert" on public.flashcards for insert with check (auth.uid() = user_id);
create policy "flashcards_own_update" on public.flashcards for update using (auth.uid() = user_id);
create policy "flashcards_own_delete" on public.flashcards for delete using (auth.uid() = user_id);

-- ----------------------------------------------------------------------
-- notes
-- ----------------------------------------------------------------------
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

alter table public.notes enable row level security;
create policy "notes_own_select" on public.notes for select using (auth.uid() = user_id);
create policy "notes_own_insert" on public.notes for insert with check (auth.uid() = user_id);
create policy "notes_own_update" on public.notes for update using (auth.uid() = user_id);
create policy "notes_own_delete" on public.notes for delete using (auth.uid() = user_id);

-- ----------------------------------------------------------------------
-- storage bucket policies (run after creating bucket "documents")
-- ----------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('documents', 'documents', false)
on conflict (id) do nothing;

create policy "users can upload to own folder"
  on storage.objects for insert
  with check (bucket_id = 'documents' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "users can read own files"
  on storage.objects for select
  using (bucket_id = 'documents' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "users can delete own files"
  on storage.objects for delete
  using (bucket_id = 'documents' and auth.uid()::text = (storage.foldername(name))[1]);
