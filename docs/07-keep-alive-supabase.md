# 07 — Keep-alive do Supabase (não pausar no free)

**Data:** 2026-07-12
**Status:** código pronto (ativa sozinho quando o Supabase estiver configurado)

## Problema

O plano **free** do Supabase **pausa o projeto após 7 dias sem atividade**. Como
o Klix é vitrine de portfólio (pode ficar dias sem visita), ele pausaria e um
recrutador acharia o site fora do ar. Pagar o Pro (US$ 25/mês) não compensa.

## Solução (US$ 0)

Um **ping automático** a cada ~3 dias mantém o projeto sempre ativo. Qualquer
requisição na API do Supabase já conta como atividade.

- **Rota:** `src/app/api/keep-alive/route.ts` — faz `select id from hub_perfis
  limit 1` (RLS pode retornar vazio; o que conta é a requisição chegar).
  - `force-dynamic` + `revalidate = 0` pra nunca cachear.
  - Se `.env.local` não tiver as chaves, responde `skipped` (inofensivo).
  - Se `CRON_SECRET` existir, exige `Authorization: Bearer <secret>` (a Vercel
    envia esse header automaticamente).
- **Agendamento:** `vercel.json` na raiz →
  `{ "path": "/api/keep-alive", "schedule": "0 6 */3 * *" }`
  (a cada 3 dias às 6h UTC — dentro da janela de 7 dias e do limite do plano
  Hobby da Vercel, que roda cron no máximo 1x/dia).

## Como testar

- Local: `GET http://localhost:3000/api/keep-alive`
  - Sem `.env.local`: `{"ok":true,"skipped":"supabase-not-configured"}` ✅
  - Com Supabase configurado: `{"ok":true,"at":"..."}`.
- Em produção: painel da Vercel → aba **Cron Jobs** mostra as execuções.

## Passos pra deixar 100% no ar

1. Criar projeto no [supabase.com](https://supabase.com) (free).
2. **Project Settings → API**: copiar `URL` e `anon key` (e `service_role`).
3. Preencher `.env.local` (local) **e** as mesmas variáveis em
   **Vercel → Project → Settings → Environment Variables**.
4. Supabase → **SQL Editor** → rodar `supabase/migrations/0001_init.sql`.
5. (Opcional) Definir `CRON_SECRET` na Vercel pra proteger a rota.
6. Deploy na Vercel → o cron ativa sozinho.

## Observação

Isso mantém o **compute** ativo. Continua sendo free; o que muda no Pro é
backup diário, sem limite de pausa e suporte — só vale quando houver clientes
reais, o que não é o caso aqui.
