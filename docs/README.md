# Documentação do Klix

Registro de tudo que é feito no projeto, etapa por etapa. Sempre que uma parte
for concluída, documentamos aqui.

## Índice

| Doc | Assunto |
|-----|---------|
| [00 — Stack e decisões](./00-stack-e-decisoes.md) | Tecnologias, arquitetura e convenções (nomes de tabela etc.) |
| [01 — Base do projeto](./01-base-do-projeto.md) | Login, hub e páginas de serviço (concluído) |
| [02 — Setup Supabase](./02-setup-supabase.md) | Banco de dados, schema, RLS e como conectar |
| [03 — Deploy na Vercel](./03-deploy-vercel.md) | Como colocar no ar |
| [04 — Autenticação](./04-autenticacao.md) | Criar conta, login, logout e proteção de rotas (concluído) |
| [05 — Identidade visual: cores](./05-identidade-visual-cores.md) | Paleta vermelha de luxo aplicada via tokens (concluído) |
| [06 — Login + logo](./06-login-e-logo.md) | Login no novo layout e logo com o pássaro (concluído) |
| [07 — Keep-alive Supabase](./07-keep-alive-supabase.md) | Evita o pause de 7 dias do free via Vercel Cron (concluído) |
| [08 — Login Google + cadastro](./08-login-google-e-cadastro.md) | Botão "Entrar com Google" (OAuth) e mensagem de confirmação de email |

## Convenção destes docs

- Um arquivo numerado por etapa (`NN-titulo.md`).
- Cada doc diz: **o que foi feito**, **arquivos envolvidos**, **como testar** e
  **pendências / próximos passos**.
- Datas em formato absoluto.
