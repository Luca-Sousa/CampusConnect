# AGENTS.md — Backend (CampusConnect)

> Fastify 5 + Drizzle ORM + Better Auth + PostgreSQL. Para a visão arquitetural completa, ver `Backend/GEMINI.md`. Este arquivo cobre só o que é difícil de inferir lendo o código.

---

## Stack

| Ferramenta        | Versão  | Papel                                                                 |
| ----------------- | ------- | --------------------------------------------------------------------- |
| Fastify           | 5.x     | HTTP framework com type-provider Zod.                                |
| Zod               | 4.x     | Validação de input e do `.env`.                                       |
| Drizzle ORM       | 0.45.x  | ORM PostgreSQL (`postgres-js` driver).                               |
| Better Auth       | 1.6.x   | Auth com `drizzleAdapter` + plugin `emailOTP` + `@better-auth/i18n`. |
| Nodemailer        | 8.x     | Envio de e-mails (OTP, notificações).                                |
| PostgreSQL        | 15+     | Banco (Neon serverless em prod).                                     |
| TypeScript        | 6.x     | ESM estrito (`NodeNext`).                                             |
| Node              | ≥ 22    | `engines.node` no `package.json`.                                    |

---

## Comandos

Todos executados em `Backend/`.

```bash
npm install                       # instalar dependências
npm run dev                       # tsx watch --env-file=.env src/server.ts
npm run build                     # tsc → dist/
npm start                         # node dist/src/server.js
npm run generate                  # drizzle-kit generate (gera SQL em src/drizzle/migrations)
npm run migrate                   # drizzle-kit migrate (aplica no banco via drizzle.config.ts)
npm run push                      # drizzle-kit push (sincroniza schema sem migration — só dev)
npm run studio                    # drizzle-kit studio (GUI do banco)
```

- **Não há script de teste** — não há suíte configurada.
- O dev server usa `--env-file=.env`, que carrega o `.env` automaticamente. Sem o flag, `process.env` fica vazio e `src/shared/env.ts` joga erro de validação.
- `npm run migrate` usa o `drizzle.config.ts` na raiz do Backend, que aponta para `./src/drizzle/migrations`.

---

## Pré-requisitos de ambiente

1. **PostgreSQL acessível** — em prod é Neon (URL em `Backend/.env`), em dev local pode usar o `docker-compose.yml` (`postuser`/`postpass`/`postdb` na porta `5432`).
2. `Backend/.env` é carregado via `tsx --env-file=.env` (script `dev`). Os defaults estão em `src/shared/env.ts` (Zod schema) e validam em runtime.
3. `SMTP_*` são **opcionais** em dev — se ausentes, e-mails saem apenas como `console.warn("[Email DEV] Para: ... | Assunto: ...")`. Ver `src/infrastructure/email/nodemailer.service.ts:27`.
4. O frontend precisa estar configurado para chamar este backend (a origem tem que estar em `FRONTEND_URL`, que aceita lista separada por vírgula — ver `app.ts:25`).

---

## Variáveis de ambiente (Zod em `src/shared/env.ts`)

| Variável              | Obrigatória | Default                       | Notas                                                                |
| --------------------- | ----------- | ----------------------------- | -------------------------------------------------------------------- |
| `PORT`                | não         | `3333`                        | `z.coerce.number()`.                                                 |
| `POSTGRES_URL`        | **sim**     | —                             | String de conexão completa (Neon, Supabase, Railway, docker).         |
| `FRONTEND_URL`        | não         | `http://localhost:5173`       | Lista separada por vírgula aceita múltiplas origens (CORS).         |
| `BACKEND_URL`         | não         | `http://localhost:3333`       | Usado pelo Better Auth como trusted origin.                          |
| `BETTER_AUTH_SECRET`  | não         | —                             | `openssl rand -base64 32` para gerar.                                |
| `SMTP_HOST`           | não         | —                             | Se ausente, e-mails vão só pro console.                              |
| `SMTP_PORT`           | não         | `587`                         | `secure: true` automático se `465`.                                  |
| `SMTP_USER` / `SMTP_PASS` / `SMTP_FROM` | não | —                      | Necessários junto com `SMTP_HOST` para envio real.                   |

> Adicionar variável nova? Editar **apenas** `src/shared/env.ts`. `drizzle.config.ts` e `api/index.ts` importam o `env` de lá. **Não** duplicar o schema em outro arquivo.

---

## Arquitetura (resumo prático)

Hexagonal clássica — dependências sempre apontam para o `domain`:

```
domain/            ← entidades, ports (interfaces), value-objects, errors
  ↑
application/       ← use-cases (orquestram ports), constants (permissions)
  ↑
infrastructure/    ← http (Fastify, routes, middlewares), database (Drizzle repos),
                     auth (Better Auth), email (Nodemailer)
shared/            ← env (Zod), utils
drizzle/           ← migrations (geradas por drizzle-kit)
```

**Regra de ouro**: nada em `domain/` importa de `application/`, `infrastructure/` ou `shared/`. Se precisar de um tipo de input/output, declare em `domain/ports/` ou `domain/entities/`.

---

## Layout de pastas (apenas o que importa)

```
src/
├── server.ts                  # entry local: buildApp().listen(PORT)
├── env.ts                     # re-export de ./shared/env.js
├── shared/
│   ├── env.ts                 # Zod schema de process.env (FONTE ÚNICA)
│   └── utils/format-zod-errors.ts
├── domain/
│   ├── entities/              # post.ts, user.ts (PostType, UserRole, UserCargo, etc.)
│   ├── ports/
│   │   ├── repositories/      # IPostRepository (interface)
│   │   └── services/          # IEmailService (interface)
│   ├── value-objects/
│   │   └── ifce-email.ts      # isAlunoEmail, isIfceEmail, isColaboradorEmail
│   └── errors/client-error.ts
├── application/
│   ├── use-cases/
│   │   ├── posts/             # create, list, delete, toggle-rsvp
│   │   └── notifications/     # send-login-notification
│   └── constants/permissions.ts  # OFFICIAL_CARGOS (Set)
├── infrastructure/
│   ├── http/
│   │   ├── app.ts             # buildApp() — registra CORS, Swagger, rotas, auth
│   │   ├── error-handler.ts   # FST_ERR_VALIDATION + ClientError → 400
│   │   ├── middlewares/auth.handler.ts  # catch-all /api/auth/* → Better Auth
│   │   ├── routes/            # posts.route.ts, notifications.route.ts
│   │   └── openapi/auth.openapi.ts
│   ├── auth/
│   │   ├── better-auth.ts     # instância `auth` (plugins: i18n, emailOTP)
│   │   ├── i18n.ts            # traduções pt-BR
│   │   └── hooks.ts           # authDatabaseHooks
│   ├── database/
│   │   ├── client.ts          # `pg` (postgres-js) + `db` (drizzle)
│   │   ├── schema/            # auth.schema.ts (user, session, account, verification)
│   │   │                      # posts.schema.ts (post, rsvp, enums, relations)
│   │   └── repositories/post.drizzle-repository.ts  # implementa IPostRepository
│   └── email/
│       ├── nodemailer.service.ts  # singleton `emailService`
│       └── templates.ts           # HTMLs de OTP e novo login
└── drizzle/
    ├── migrate.ts             # migrador programático (não usado pelo Vercel)
    └── migrations/            # SQL gerado por drizzle-kit
api/
└── index.ts                   # entry serverless para Vercel (handler HTTP)
```

---

## Endpoints expostos

Registrado em `src/infrastructure/http/app.ts`:

- `GET    /api/posts?limit=&offset=` — lista paginada (limite 1–50, default 20).
- `POST   /api/posts` — cria publicação. Notícias exigem `role: "admin"` ou cargo em `OFFICIAL_CARGOS`.
- `DELETE /api/posts/:id` — remove (dono ou admin).
- `POST   /api/posts/:id/rsvp` — toggle de presença (apenas para posts `type: "event"`).
- `POST   /api/notifications/login` — fire-and-forget; envia e-mail de novo acesso.
- `ALL    /api/auth/*` — proxy para Better Auth (signup, signin, OTP, sessão, etc).
- `GET    /docs` — Swagger UI (gerado por `@fastify/swagger-ui`).

---

## Convenções

- **Use cases** são classes injetadas com a port (ex: `new CreatePostUseCase(postRepository)`). Construtor recebe via DI, execute() recebe um `Command`/`Input`.
- **Routes instanciam repositórios e use cases como singletons no topo do arquivo** (ver `posts.route.ts:10`). Comum para apps Fastify pequenos; troque por container de DI se crescer.
- **Erros de domínio**: `ClientError` (genérico, vira 400 via handler) e `Error("FORBIDDEN")` / `Error("NOT_FOUND")` / `Error("INVALID:...")` (strings — capturadas nos handlers das routes e traduzidas para 401/403/404/400). É o padrão atual; se for refatorar, prefira classes específicas em `domain/errors/`.
- **Validação de input** usa `z.discriminatedUnion("type", [...])` em `posts.route.ts:25` para validar os 4 tipos de post num único schema.
- **Cookie de sessão**: `sameSite: "none"`, `secure: true`, `httpOnly: true` (em `better-auth.ts:74`). Em dev isso exige `http://localhost:5173` exato (CORS checa a origem).

---

## Schemas do banco (Drizzle)

Definidos em `src/infrastructure/database/schema/`:

- `auth.schema.ts` — tabelas `user`, `session`, `account`, `verification` (geradas pelo Better Auth + custom fields `role`/`cargo`). Enums: `user_role` (`aluno`/`colaborador`/`admin`), `user_cargo` (9 valores).
- `posts.schema.ts` — `post` (com `post_type` enum: `text`/`image`/`event`/`news`) e `rsvp` (UNIQUE em `(postId, userId)`).

> Mudou o schema? `npm run generate` → commit o SQL em `src/drizzle/migrations/` → `npm run migrate` (em prod: a migration roda automaticamente? **Não** — Vercel não executa `npm run migrate` no deploy, vide abaixo).

---

## Deploy (Vercel)

- `vercel.json` mapeia **todas** as rotas para `api/index.ts` (handler serverless).
- O `handler` em `api/index.ts` mantém o app Fastify vivo entre invocações (warm starts) — não remova o flag `ready`.
- **Migrações não rodam no deploy** — `src/drizzle/migrate.ts` existe, mas não há script no `package.json` que o Vercel invoque. Aplique migrations localmente (`npm run migrate`) ou via CI antes de cada deploy.
- O ponto de entrada **local** é `src/server.ts`; o ponto **Vercel** é `api/index.ts`. Ambos chamam `buildApp()`.

---

## Cookies / CORS / cross-origin (gotcha)

- Backend em `https://campus-connect-api-*.vercel.app`, frontend em `https://campus-connect-zeta-pied.vercel.app` — origens diferentes.
- Por isso `sameSite: "none"` + `secure: true` + `httpOnly: true` (Better Auth, `better-auth.ts:74`) e `credentials: true` no CORS (`app.ts:35`).
- Para adicionar uma origem nova (ex: staging), basta acrescentar na env `FRONTEND_URL` separada por vírgula — `app.ts:25` faz `split(",")`.
- Sem HTTPS local, cookies de sessão **não persistem** entre reloads. Use o cookie de dev do Better Auth ou teste via `http://localhost:5173` (que conta como secure context no Chrome para `localhost`).

---

## Autenticação (Better Auth)

- Instância única em `src/infrastructure/auth/better-auth.ts`. **Não criar outra instância** — o adapter do Drizzle e os cookies precisam ser consistentes.
- Plugins ativos:
  - `i18n` (pt-BR fixo via `getLocale: () => "pt"` em `better-auth.ts:88`).
  - `emailOTP` com `sendVerificationOnSignUp: true`, `expiresIn: 300`s, `otpLength: 6`.
  - Hooks em `authDatabaseHooks` (default em `infrastructure/auth/hooks.ts`).
- Custom fields no `user`: `role` (string, required, default `"aluno"`) e `cargo` (string, optional). Esses campos são inferidos pelo client frontend via `inferAdditionalFields`.
- Tipos: `UserRole = "aluno" | "colaborador" | "admin"` e `UserCargo` com 9 valores — ambos em `src/domain/entities/user.ts` (espelhar o enum do Drizzle).

---

## SMTP / e-mails

- Singleton `emailService` em `nodemailer.service.ts`.
- Se `SMTP_HOST`/`SMTP_USER`/`SMTP_PASS` faltarem, o service faz `console.warn` e retorna sem enviar — o app não quebra, apenas não notifica.
- Templates HTML ficam em `infrastructure/email/templates.ts`. Adicionar template novo? Criar função `buildXxxEmailHtml(...)` e plugar em `OTP_EMAIL_CONFIG` em `better-auth.ts:28`.

---

## Pegadinhas / coisas que um agente pode errar

- **Não criar nova instância de `auth`** em outras rotas — sempre importe de `infrastructure/auth/better-auth.js`.
- **Não validar com Zod e `safeParse` dentro de `try/catch`** sem diferenciar `FST_ERR_VALIDATION` (Fastify type provider já o faz) — use o `validatorCompiler` configurado em `app.ts:21` e trate o erro via `error-handler.ts`.
- **Não commitar o `BETTER_AUTH_SECRET` real** em `.env` (o `.env` está commitado no estado atual com valores reais de dev — **substituir antes de qualquer commit público**). O `.env.prod` também está commitado.
- **Não rodar `npm run push` em produção** — ele altera o schema sem gerar migration. Só em dev local.
- **Routes instanciam repositórios como singleton no escopo do módulo**. Se adicionar transação por request, vai precisar refatorar para escopo por request.
- **`tsconfig.json` exclui `api/` e `drizzle.config.ts`** (`tsconfig.json:14`) porque o entry da Vercel e o config do drizzle rodam fora do `rootDir: src`. Não mover esses arquivos para dentro de `src/`.
- **Imports em `domain/` devem usar `.js`** no final do caminho (ex: `import type { Post } from "../../entities/post.js"`) mesmo que o source seja `.ts` — exigência do `NodeNext` module resolution.
- **Better Auth schema** (`auth.schema.ts`) é o contrato do `drizzleAdapter` — renomear colunas/tabelas do Better Auth exige cuidado, e `drizzle-kit` pode não detectar drift.
- **Email duplicado em produção** (Nodemailer Gmail + limites) — em prod vale considerar um provedor transacional (Resend, SES).

---

## Documentação de referência

- `Backend/GEMINI.md` — visão geral da arquitetura hexagonal, comandos de migração.
- `Backend/AGENTS.md` — este arquivo (específico do backend).
- `frontend/AGENTS.md` — instruções para o frontend (integração com este backend).
- `drizzle.config.ts` — config de migrações (aponta para `src/drizzle/migrations`).
- Swagger UI local: `http://localhost:3333/docs` (após `npm run dev`).
