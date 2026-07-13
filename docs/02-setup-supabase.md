# 02 — Setup Supabase

_Preparado em: 12/07/2026 — aguardando as chaves do projeto Supabase_

## O que já está pronto no código

- Pacotes instalados: `@supabase/supabase-js`, `@supabase/ssr`.
- Clients criados:
  - `src/lib/supabase/client.ts` — para Client Components (browser).
  - `src/lib/supabase/server.ts` — para Server Components / Route Handlers /
    Server Actions.
- Exemplo de env em `.env.local.example`.
- Schema inicial em `supabase/migrations/0001_init.sql` (tabelas + RLS +
  trigger que cria o perfil no cadastro).

## O que VOCÊ precisa fazer (precisa da sua conta — não dá pra automatizar)

1. **Criar o projeto no Supabase**
   - Acesse https://supabase.com → New project.
   - Guarde a senha do banco.

2. **Copiar as chaves** (Project Settings → API):
   - `Project URL`
   - `anon public key`
   - `service_role key`

3. **Criar o `.env.local`** na raiz de `klix-hub` (copie de `.env.local.example`):
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   SUPABASE_SERVICE_ROLE_KEY=...
   ```

4. **(Opcional) Rodar o schema**
   - No modo básico, a autenticação já funciona só com as chaves — o Supabase
     Auth cuida dos usuários (`auth.users`).
   - Se quiser guardar nome/plano numa tabela sua, rode `hub_perfis`:
     Supabase → SQL Editor → cole `supabase/migrations/0001_init.sql` → Run.
   - Tabelas de módulo (`crm_*`, etc.) só entram quando um serviço precisar
     guardar dados — em migrações futuras.

5. Me avisar que as chaves estão no `.env.local`. O código já detecta e passa a
   usar o Supabase Auth automaticamente (ver [doc 04](./04-autenticacao.md)).

## Schema (resumo)

| Tabela | Papel |
|--------|-------|
| `auth.users` | usuários — gerenciado pelo Supabase Auth (não precisa criar) |
| `hub_perfis` | **opcional** — nome + plano do usuário (1:1 com `auth.users`) |

`hub_perfis` tem RLS: cada usuário só acessa a própria linha.

## Pendências

- [ ] Você: criar projeto + colar chaves (e, se quiser, rodar o SQL opcional).
- [x] Eu: `signUp`/`login`/`logout` com Supabase + proteção de rotas — feito
  (ver doc 04).
