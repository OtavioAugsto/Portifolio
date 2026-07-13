# 06 — Login redesenhado + logo (pássaro)

**Data:** 2026-07-12
**Status:** concluído (imagem da logo já adicionada)

## O que foi feito

### 1. Logo com o pássaro (gavião/kite)
O componente `Logo` deixou de desenhar um "K" e passou a exibir uma **foto do
pássaro** num quadrado arredondado, ao lado do wordmark `klix`.

- Arquivo esperado: **`public/logo-klix.png`**
- Se o arquivo não existir, o componente mostra um **fallback** (quadrado
  vermelho com "K") para o layout nunca quebrar.
- Funciona nas duas variantes (`brand` e `white`), com um anel sutil na borda.

### 2. Login no modelo da referência
A tela de login foi refeita seguindo o layout de referência enviado, com as
**nossas cores vermelhas**:

- **Painel da marca à esquerda** (gradiente Crimson Silk → Deep Bordeaux),
  com logo no topo, título grande **"Bem-vindo de volta."**, subtítulo e um
  **card flutuante** (avatares + `▲ 12%` + "5 serviços").
- **Formulário à direita**: "Entrar na sua conta", campo Email, campo Senha com
  **botão de mostrar/ocultar** (olho), **"Manter conectado"** e
  **"Esqueceu sua senha?"**, botão **Entrar** e link para criar conta.
- Responsivo: em telas pequenas o painel some e o logo aparece acima do form.

A autenticação existente (login/cadastro mock via `useAuth`) foi **preservada** —
só a aparência mudou.

## Arquivos envolvidos

- `src/components/Logo.tsx` — mark vira imagem `/logo-klix.png` + fallback "K".
- `src/app/login/page.tsx` — layout novo (painel esquerdo + form direito).
- `public/logo-klix.png` — **PENDENTE**: arquivo da imagem do pássaro.

## Imagem da logo

`public/logo-klix.png` foi gerada a partir de `Downloads/content.png` (o pássaro
com fundo preto). Processo (via `sharp`, script temporário):

1. **Flood-fill a partir das bordas** removendo só o preto conectado ao fundo
   (preserva as penas escuras internas — não abre buracos).
2. **Recorte quadrado 1024×1024** centralizado no rosto do pássaro.
3. **Fundo trocado pelo nosso vermelho**: gradiente Crimson Silk (`#d72638`) →
   Deep Bordeaux (`#3f0d12`), o mesmo do painel de login.

O componente `Logo` exibe essa imagem `object-cover` preenchendo um quadrado
arredondado (`rounded-2xl`) com anel e sombra, **sem o wordmark "klix"** — o
pássaro é a identidade. Tamanho maior nos pontos de destaque (login 60px,
hub 56px).

## Como testar

1. `npm run dev` em `klix-hub` → http://localhost:3000/login
2. Confira: painel vermelho à esquerda, "Bem-vindo de volta.", card flutuante,
   form à direita com olho de senha e "Manter conectado".
3. Depois de colocar `logo-klix.png`, o pássaro deve substituir o "K".

Verificado nesta etapa (via DOM, pois a captura de tela do preview estava
instável): rota `/login`, gradiente Crimson→Bordeaux, títulos corretos,
olho de senha e checkbox presentes, `GET /logo-klix.png` → 404 (esperado até
o arquivo ser adicionado).

## Pendências / próximos passos

- Adicionar `public/logo-klix.png` (imagem do pássaro).
- Opcional: gerar um `favicon`/ícone do app a partir da mesma imagem.
