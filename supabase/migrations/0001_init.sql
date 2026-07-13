-- ============================================================
-- Klix — migração inicial (0001) — modo básico
-- Só o essencial para "criar conta + login". A autenticação em si é do
-- Supabase Auth (tabela auth.users, gerenciada pelo Supabase).
--
-- `hub_perfis` é OPCIONAL: guarda nome/plano do usuário para exibir e evoluir
-- (planos, etc.). O app funciona mesmo sem rodar isto — nesse caso o nome vem
-- do metadata do usuário. Rode no Supabase → SQL Editor quando quiser.
--
-- Convenção: tabelas com prefixo do módulo. Tabelas de ferramenta (crm_, etc.)
-- entram em migrações futuras, só quando o módulo precisar guardar dados.
-- ============================================================

create extension if not exists "pgcrypto";

-- perfil + plano do usuário (1:1 com auth.users)
create table if not exists hub_perfis (
  id           uuid primary key references auth.users (id) on delete cascade,
  nome         text,
  email        text,
  plano        text default 'Nenhum plano ativo',
  plano_status text default 'pendente' check (plano_status in ('pendente', 'ativo')),
  criado_em    timestamptz default now()
);

alter table hub_perfis enable row level security;

drop policy if exists "hub_perfis: dono lê" on hub_perfis;
create policy "hub_perfis: dono lê"
  on hub_perfis for select using (auth.uid() = id);

drop policy if exists "hub_perfis: dono atualiza" on hub_perfis;
create policy "hub_perfis: dono atualiza"
  on hub_perfis for update using (auth.uid() = id);

-- cria o perfil automaticamente quando um usuário se registra
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.hub_perfis (id, nome, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'nome', split_part(new.email, '@', 1)),
    new.email
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
