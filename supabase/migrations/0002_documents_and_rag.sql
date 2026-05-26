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

create policy "documents_own_select" on public.documents for select using ((select auth.uid()) = user_id);
create policy "documents_own_insert" on public.documents for insert with check ((select auth.uid()) = user_id);
create policy "documents_own_update" on public.documents for update using ((select auth.uid()) = user_id);
create policy "documents_own_delete" on public.documents for delete using ((select auth.uid()) = user_id);

create table if not exists public.document_chunks (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.documents(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  chunk_index int not null,
  content text not null,
  token_count int not null default 0,
  embedding extensions.vector(1536),
  created_at timestamptz not null default now()
);

create index if not exists document_chunks_document_id_idx on public.document_chunks(document_id);
create index if not exists document_chunks_user_id_idx on public.document_chunks(user_id);
create index if not exists document_chunks_embedding_idx
  on public.document_chunks
  using ivfflat (embedding extensions.vector_cosine_ops)
  with (lists = 100);

alter table public.document_chunks enable row level security;
create policy "chunks_own_select" on public.document_chunks for select using ((select auth.uid()) = user_id);
create policy "chunks_own_insert" on public.document_chunks for insert with check ((select auth.uid()) = user_id);
create policy "chunks_own_delete" on public.document_chunks for delete using ((select auth.uid()) = user_id);

create or replace function public.match_document_chunks(
  p_document_id uuid,
  p_query_embedding extensions.vector(1536),
  p_match_count int default 5
)
returns table (
  id uuid,
  content text,
  chunk_index int,
  similarity float
)
language sql stable
set search_path = public, extensions
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
