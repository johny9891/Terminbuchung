insert into storage.buckets (id, name, public)
values ('documents', 'documents', false)
on conflict (id) do nothing;

drop policy if exists "users can upload to own folder" on storage.objects;
drop policy if exists "users can read own files" on storage.objects;
drop policy if exists "users can delete own files" on storage.objects;

create policy "users can upload to own folder"
  on storage.objects for insert
  with check (bucket_id = 'documents' and (select auth.uid())::text = (storage.foldername(name))[1]);

create policy "users can read own files"
  on storage.objects for select
  using (bucket_id = 'documents' and (select auth.uid())::text = (storage.foldername(name))[1]);

create policy "users can delete own files"
  on storage.objects for delete
  using (bucket_id = 'documents' and (select auth.uid())::text = (storage.foldername(name))[1]);
