-- ============================================================
-- Klix — migração 0002 — Storage para foto de perfil (avatars)
-- Cria o bucket público "avatars" e as políticas para o usuário
-- gerenciar a própria foto. Rode no Supabase → SQL Editor.
-- ============================================================

-- bucket público (leitura liberada; escrita controlada por política)
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- qualquer um pode LER (fotos são públicas)
drop policy if exists "avatars: leitura pública" on storage.objects;
create policy "avatars: leitura pública"
  on storage.objects for select
  using (bucket_id = 'avatars');

-- usuário logado envia/atualiza/apaga só na PRÓPRIA pasta (uid/...)
drop policy if exists "avatars: dono envia" on storage.objects;
create policy "avatars: dono envia"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "avatars: dono atualiza" on storage.objects;
create policy "avatars: dono atualiza"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "avatars: dono apaga" on storage.objects;
create policy "avatars: dono apaga"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
