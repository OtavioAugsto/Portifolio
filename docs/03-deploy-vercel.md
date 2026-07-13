# 03 — Deploy na Vercel

_Preparado em: 12/07/2026 — aguardando conexão da conta_

Next.js roda na Vercel sem configuração extra. O projeto já está pronto para
deploy; falta só conectar (precisa da sua conta).

## Passo a passo (precisa da sua conta — não dá pra automatizar)

1. **Subir o código para um repositório Git** (GitHub/GitLab/Bitbucket).
   > O projeto ainda não é um repositório Git. Quando quiser, eu inicializo o
   > git e faço o primeiro commit.

2. **Importar na Vercel**
   - https://vercel.com → Add New → Project → importe o repositório.
   - Root Directory: `klix-hub` (o app fica nessa subpasta).
   - Framework: Next.js (detectado automaticamente).

3. **Configurar as variáveis de ambiente** na Vercel
   (Settings → Environment Variables) — as mesmas do `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

4. **Deploy** — a Vercel builda e publica. Cada push na branch principal
   gera um novo deploy automático.

## Checklist antes do primeiro deploy

- [ ] Supabase configurado (doc 02).
- [ ] `.env.local` NÃO comitado (já está no `.gitignore`).
- [ ] `npm run build` passando localmente.
- [ ] Repositório Git criado.

## Observações

- **Root Directory** precisa apontar para `klix-hub`, senão a Vercel não acha o
  `package.json`.
- Domínio custom pode ser adicionado depois em Settings → Domains.
