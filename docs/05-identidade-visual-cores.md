# 05 — Identidade visual: paleta de cores

**Data:** 2026-07-12
**Status:** concluído

## O que foi feito

Trocamos a marca do Klix do laranja original para uma **paleta vermelha de luxo**
(referência: post do `suraj.dsgn`, "Best Luxury Color Palettes for Premium Designs").

A cor está centralizada em **design tokens** (variáveis CSS) — trocando as
variáveis, o site inteiro muda: logo, botões, gradientes, badges e ícone do CRM.
Nenhum componente teve cor "chumbada"; todos consomem os tokens `brand`.

### Paleta aplicada

| Token          | Nome           | HEX       | Uso                                   |
|----------------|----------------|-----------|---------------------------------------|
| `--brand`      | Crimson Silk   | `#D72638` | Cor principal (logo, botões, ícones)  |
| `--brand-600`  | Ruby Red       | `#98111E` | Estado hover                          |
| `--brand-700`  | Deep Bordeaux  | `#3F0D12` | Fim do gradiente / textos profundos   |
| `--brand-050`  | Soft Blush     | `#FBE4E3` | Fundo suave (badges/pills)            |

Do claro → escuro: Soft Blush → Crimson Silk → Ruby Red → Deep Bordeaux.

O accent do serviço CRM (`--c-crm`) também foi alinhado ao novo `#D72638`.
Os accents dos outros serviços (Agendamento, Automação, Financeiro, Redes)
foram **mantidos distintos** de propósito, para continuarem legíveis no donut de
"Uso por serviço".

## Arquivos envolvidos

- `src/app/globals.css` — bloco `:root` com os tokens da marca.
- (propagam automaticamente) `src/components/Logo.tsx`, `src/app/login/page.tsx`,
  `src/app/(app)/hub/page.tsx` — todos via classes `bg-brand`, `text-brand`,
  `from-brand`, `to-brand-700`, `bg-brand-050`, `text-brand-700`.

## Como testar

1. `npm run dev` na pasta `klix-hub` → http://localhost:3000
2. Login e hub devem mostrar:
   - Logo "K" com fundo **Crimson Silk** (`#D72638`).
   - Painel lateral com gradiente **Crimson Silk → Deep Bordeaux**.
   - Botão "Entrar" em vermelho, escurecendo para Ruby Red no hover.

Verificado nesta etapa via estilos computados no navegador:
logo/avatar `rgb(215,38,56)`, gradiente `Crimson Silk → rgb(63,13,18)`,
e **zero** ocorrências do laranja antigo `#f26522`.

## Pendências / próximos passos

- Avaliar aplicar Deep Bordeaux como fundo escuro de seções premium.
- Revisar contraste (WCAG) de textos sobre Soft Blush, se surgirem novos usos.
