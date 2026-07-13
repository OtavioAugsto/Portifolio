# 08 — Login com Google (OAuth) + cadastro

**Data:** 2026-07-12
**Status:** código pronto e testado; **falta ativar o provider no painel** (passos abaixo)

## O que foi feito no código

### Login com Google (OAuth)
- `src/lib/auth.tsx`: novo método `loginWithGoogle()` →
  `supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo:
  \`${origin}/auth/callback\` } })`.
- `src/app/auth/callback/route.ts`: recebe `?code=`, faz
  `exchangeCodeForSession` (grava os cookies) e manda pro `/hub`. Sem code/erro
  → volta pra `/login?error=oauth`.
- `src/lib/supabase/middleware.ts`: `/auth` e `/api` entram nas rotas públicas
  (senão o callback era redirecionado pro login antes de trocar o code).
- `src/app/login/page.tsx`: botão **"Entrar com Google"** (com o logo colorido
  do Google) + divisor "ou com email"; trata `?error=oauth`.

Testado local: botão renderiza, `/auth/callback` redireciona certo, sem erros.
O login em si só funciona depois de ativar o provider (passos abaixo).

### Cadastro (email)
- Já usa Supabase (`signUp`). Ao criar conta, se o Supabase exigir confirmação,
  mostra: *"Conta criada! Enviamos um link de confirmação para <email>…"* e
  volta pro modo login. Campo **Nome** aparece só no cadastro.

## Passos no painel pra ativar o Google (você)

1. **Google Cloud Console** → criar credencial **OAuth 2.0 Client ID** (tipo
   *Web application*).
   - **Authorized redirect URI:**
     `https://tlrtyjrqjkxmwlvrcdmw.supabase.co/auth/v1/callback`
   - Copiar **Client ID** e **Client Secret**.
2. **Supabase → Authentication → Providers → Google** → ativar e colar o
   Client ID + Secret.
3. **Supabase → Authentication → URL Configuration → Redirect URLs** → adicionar:
   - `http://localhost:3000/auth/callback` (dev)
   - `https://SEU-DOMINIO.vercel.app/auth/callback` (produção)
   - E o **Site URL** apontando pro domínio de produção.

Pronto — o botão "Entrar com Google" passa a funcionar de ponta a ponta.

## Observações
- O mesmo callback serve pra outros provedores no futuro (Apple, GitHub…).
- Apple exige Apple Developer Program (US$ 99/ano) — fica pra depois.
