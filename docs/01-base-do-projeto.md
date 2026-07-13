# 01 — Base do projeto (login + hub + serviços)

_Concluído em: 12/07/2026_

## O que foi feito

A fundação navegável do Klix, com o fluxo completo **login → hub → serviço**.

### Telas

- **`/login`** — split-screen: formulário (email/senha) à esquerda, painel de
  marca laranja à direita. Login de demonstração (aceita qualquer credencial).
- **`/hub`** — réplica do layout de referência:
  - Perfil do usuário (avatar com iniciais, nome derivado do email, email).
  - Card de plano ("Nenhum plano ativo" / badge "Pendente").
  - Seção "Escolha seu serviço".
  - Gráfico donut "Uso por serviço" (SVG puro, dados de exemplo).
  - Lista dos 5 serviços à direita (ícone + nome + seta).
- **`/crm`, `/agendamento`, `/automacao`, `/financeiro`, `/redes-sociais`** —
  cada serviço em rota separada, com header próprio e um scaffold
  "Módulo em construção" pronto para receber a UI real.

## Arquivos envolvidos

```
src/
├─ app/
│  ├─ layout.tsx              # envolve tudo com <AuthProvider>
│  ├─ page.tsx                # redireciona / → /hub
│  ├─ globals.css             # design tokens (cores da marca, etc.)
│  ├─ login/page.tsx          # tela de login
│  └─ (app)/                  # grupo protegido por guard
│     ├─ layout.tsx           # guard: sem sessão → /login
│     ├─ hub/page.tsx
│     ├─ crm/page.tsx
│     ├─ agendamento/page.tsx
│     ├─ automacao/page.tsx
│     ├─ financeiro/page.tsx
│     └─ redes-sociais/page.tsx
├─ components/
│  ├─ Logo.tsx                # logo Klix (variantes brand/white)
│  ├─ UsageDonut.tsx          # gráfico de uso (SVG)
│  └─ ServiceShell.tsx        # frame compartilhado das páginas de serviço
└─ lib/
   ├─ auth.tsx                # AuthProvider/useAuth (mock localStorage)
   └─ services.ts             # catálogo único de serviços
```

## Como testar

```bash
cd klix-hub
npm run dev
# abrir http://localhost:3000  → cai em /login
# entrar com qualquer email/senha → vai para /hub
# clicar num serviço → abre a rota do módulo
```

## Pendências / próximos passos

- [ ] Trocar auth mock por **Supabase Auth** (ver doc 02).
- [ ] Página de conta/configurações (botão ⚙️) funcional.
- [ ] Implementar o primeiro módulo de verdade (CRM).
