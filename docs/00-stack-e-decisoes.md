# 00 — Stack e decisões

_Atualizado em: 12/07/2026_

## Objetivo do projeto

O **Klix** é o hub/portfólio profissional onde ficarão todos os projetos e
ferramentas. Tela de login + um painel central ("Escolha seu serviço") que dá
acesso a módulos separados (CRM, Agendamento, Automação, Financeiro, Redes
Sociais). Deve ser **pronto para produção** desde a base.

## Stack alvo

| Camada | Tecnologia |
|--------|-----------|
| Frontend | Next.js 16 (App Router) + React + TypeScript |
| Estilo | Tailwind CSS v4 |
| Ícones | lucide-react |
| Backend | Route Handlers / Server Actions (API dentro do próprio Next) |
| Banco de dados | Supabase (Postgres) |
| Autenticação | Supabase Auth (hoje em mock, ver doc 02) |
| Hospedagem | Vercel |

## Arquitetura

- **Monólito modular**: um app Next, um banco Postgres, vários módulos.
- **Catálogo único de serviços** em `src/lib/services.ts` — adicionar um serviço
  ali alimenta automaticamente o hub, o gráfico de uso e as rotas.
- **Grupo protegido** `src/app/(app)/` com guard de autenticação.
- **Camada de auth isolada** em `src/lib/auth.tsx` — troca de mock para Supabase
  sem mexer nas telas.
- **Supabase clients** em `src/lib/supabase/` (um para browser, um para server).

## Convenção de nomes no banco

Tabelas com **prefixo do módulo**, `snake_case`:

| Prefixo | Módulo |
|---------|--------|
| `hub_` | compartilhado (perfil, plano) — ex: `hub_perfis` |
| `crm_` | CRM — ex: `crm_usuarios`, `crm_logs_acesso` |
| `agenda_` | Agendamento |
| `auto_` | Automação |
| `fin_` | Financeiro |
| `social_` | Redes Sociais |

Regras:

- Toda tabela de dados de usuário tem `owner_id uuid references auth.users(id)`.
- **RLS ligado** em todas: cada usuário só vê/edita as próprias linhas.
- Timestamps `criado_em timestamptz default now()`.

## Decisões registradas

1. **Auth mock por enquanto** (localStorage), estruturado para virar Supabase
   Auth sem refatorar telas. Motivo: destravar o front antes de criar o projeto
   Supabase.
2. **Prefixo por módulo** (em vez de schemas separados) — mais simples de operar
   num único banco e ainda deixa tudo organizado.
