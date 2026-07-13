# 04 — Autenticação (criar conta + login + proteção)

_Concluído em: 12/07/2026_

> **Estado atual (decisão de 12/07/2026):** rodando em **modo mock** de propósito.
> Contas são criadas e guardadas no navegador (localStorage) e o acesso ao painel
> é liberado normalmente. Vira contas reais quando as chaves do Supabase forem
> adicionadas — sem mudar código. Objetivo do Klix: ser só o **launcher** de
> entrada (login → painel → outro projeto).

## Página de login — o principal

Arquivo: `src/app/login/page.tsx` (rota `/login`).

**Para que serve:** é a porta de entrada. A pessoa **cria a conta** e, com isso,
o **acesso ao painel é liberado**. Sem conta/sessão, o painel não abre.

**Layout:** split-screen — formulário à esquerda, painel de marca laranja à
direita (some no mobile). Logo Klix no topo.

**Dois modos na mesma tela** (toggle no rodapé do form):
- **Entrar** — email + senha.
- **Criar conta** — nome + email + senha.

**Comportamento:**
- Validação básica dos campos + mensagens de erro em português.
- Botão com estado de carregando ("Entrando…" / "Criando…").
- Sucesso → redireciona para o painel (`/hub`).
- Se já estiver logado, `/login` manda direto pro painel.
- (No modo Supabase) se o projeto exigir confirmação por email, mostra aviso e
  não libera até confirmar.

**Verificado:** criar conta leva direto ao painel logado. ✅

## O que foi feito

Fluxo básico de contas: **criar conta → entrar → rotas protegidas → sair**.

- **Tela de login/cadastro** (`/login`) com toggle entre "Entrar" e "Criar
  conta". No cadastro tem campo Nome; mensagens de erro em português; aviso de
  "confirme seu email" quando o Supabase exigir confirmação.
- **Camada de auth dual-mode** (`src/lib/auth.tsx`): expõe `login`, `signUp`,
  `logout`, `user`, `loading`. Funciona em dois modos, transparente para as
  telas:
  - **Supabase Auth** quando `.env.local` tem as chaves (produção).
  - **Mock localStorage** enquanto não há chaves (dev).
  - O chaveamento é o `isSupabaseConfigured` (`src/lib/supabase/config.ts`).
- **Proteção de rotas** em duas camadas:
  - `src/proxy.ts` (convenção nova do Next 16, ex-`middleware`): quando o
    Supabase está ativo, valida a sessão no servidor e redireciona quem não
    está logado para `/login`.
  - `src/app/(app)/layout.tsx`: guard client-side (cobre o modo mock também).

## Arquivos envolvidos

```
src/
├─ proxy.ts                     # proteção server-side (Next 16 "proxy")
├─ lib/
│  ├─ auth.tsx                  # AuthProvider/useAuth dual-mode (+ signUp)
│  └─ supabase/
│     ├─ config.ts              # isSupabaseConfigured
│     ├─ client.ts              # client browser
│     ├─ server.ts              # client server
│     └─ middleware.ts          # updateSession (usado pelo proxy)
└─ app/login/page.tsx           # login + cadastro
```

## Como testar

**Modo mock (agora, sem chaves):**
```bash
npm run dev
# /login → "Criar conta" → preenche nome/email/senha → entra no /hub
# aceita qualquer credencial; a "conta" fica no localStorage
```

**Modo Supabase (depois das chaves):** ver [doc 02](./02-setup-supabase.md).
Assim que o `.env.local` estiver preenchido, o mesmo fluxo passa a criar
usuários de verdade em `auth.users` e a proteger via sessão do Supabase — sem
mudar nenhuma tela.

## Detalhe do Next.js 16

O arquivo `middleware.ts` foi **renomeado para `proxy.ts`** (função `proxy`) —
o `middleware` foi deprecado nesta versão. Manter os dois arquivos ao mesmo
tempo dá erro; usar só `proxy.ts`.

## Pendências / próximos passos

- [x] **Decisão:** manter modo mock por enquanto (12/07/2026).
- [ ] Você (quando quiser contas reais): criar o projeto Supabase e preencher
  `.env.local` (doc 02).
- [ ] Confirmar config de email no Supabase (confirmação on/off).
- [ ] (Opcional) Recuperação de senha ("Esqueci minha senha").
- [ ] Próximas fases: para onde o painel redireciona (o "outro projeto"), visual
  final, etc.
