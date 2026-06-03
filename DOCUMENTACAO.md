# CampusConnect — Documentacao Tecnica

Rede social academica para o campus do IFCE, construida com **Fastify + Drizzle + Better Auth** no backend e **Vite + React 19 + TypeScript 6** no frontend.

---

## Sumario

1. [Visao Geral](#1-visao-geral)
2. [Stack Tecnologica](#2-stack-tecnologica)
3. [Funcionalidades](#3-funcionalidades)
4. [Arquitetura Backend](#4-arquitetura-backend)
5. [Arquitetura Frontend](#5-arquitetura-frontend)
6. [Principios SOLID](#6-principios-solid)
7. [Clean Code](#7-clean-code)
8. [Banco de Dados](#8-banco-de-dados)
9. [Autenticacao](#9-autenticacao)
10. [Deploy](#10-deploy)

---

## 1. Visao Geral

CampusConnect e uma rede social academica que permite aos estudantes e colaboradores do IFCE:

- Criar e interagir com publicacoes (texto, imagem, evento, noticia)
- Gerenciar eventos com confirmacao de presenca (RSVP)
- Publicar comunicados oficiais (noticias)
- Criar e participar de grupos com chat em tempo real
- Editar perfil com foto, curso e biografia

---

## 2. Stack Tecnologica

### Backend

| Tecnologia | Versao | Papel |
|---|---|---|
| Fastify | 5.x | Framework HTTP com roteamento e validacao |
| Drizzle ORM | 0.45.x | ORM PostgreSQL com type-safety |
| Better Auth | 1.6.x | Autenticacao com OTP, sessoes e cookies |
| Zod | 4.x | Validacao de input e env vars |
| Nodemailer | 8.x | Envio de e-mails (OTP, notificacoes) |
| PostgreSQL | 15+ | Banco de dados (Neon em producao) |
| TypeScript | 6.x | ESM estrito com NodeNext |

### Frontend

| Tecnologia | Versao | Papel |
|---|---|---|
| React | 19.x | UI framework com StrictMode |
| Vite | 8.x | Build tool e dev server |
| TypeScript | 6.x | Tipagem estatica (strict) |
| Tailwind CSS | 4.x | Estilizacao utilitaria |
| shadcn/ui | 4.7.0 | Componentes UI acessiveis (radix-vega) |
| TanStack Query | 5.x | Gerenciamento de estado assincrono |
| TanStack Form | 1.x | Formularios com validacao Zod |
| better-auth/client | 1.6.x | Cliente de autenticacao |
| Zod | 4.x | Validacao de schemas |
| date-fns | 4.x | Manipulacao de datas |
| Sonner | 2.x | Notificacoes toast |

---

## 3. Funcionalidades

### Feed (`/feed`)
- Publicacoes de texto, imagem, evento e noticia
- Compositor com abas (Texto, Foto, Evento, Noticia)
- Edicao e exclusao de publicacoes proprias
- Confirmacao de presenca em eventos (RSVP)
- Skeleton de loading

### Eventos (`/eventos`)
- Grid de cards com imagem, data, local e horario
- Badge de data sobreposta na imagem
- Indicador de eventos encerrados
- Confirmacao de presenca com contagem
- Edicao exclusiva do autor

### Noticias (`/noticias`)
- Destaque hero (featured) com imagem full-width
- Lista horizontal de noticias recentes
- Controle de permissao: apenas cargos oficiais podem criar
- Overlay escuro em imagens para legibilidade
- Badge "Comunicado Oficial"

### Grupos (`/grupos`)
- Cards com emoji, nome, descricao e contagem de membros
- Criacao de grupos (qualquer usuario autenticado)
- Sistema de entrada/saida de membros
- Chat em tempo real via Sheet lateral
- Exclusao de mensagens pelo autor
- Emoji picker para icone do grupo

### Perfil
- Dialog de edicao com upload de foto (data URL, max 2MB)
- Campos: nome, curso, biografia
- Refresh automatico da sessao e de todas as publicacoes/grupos
- Avatar propagado em todo o app (posts, grupos, eventos, noticias, chat)

### Layout
- Sidebar esquerda com navegacao e menu do usuario
- Sidebar direita com dados reais (eventos, noticias, grupos recentes)
- Sidebar direita visivel apenas em XL (>= 1280px)
- Header com busca e toggle de sidebar

---

## 4. Arquitetura Backend

### Arquitetura Hexagonal (Ports & Adapters)

```
domain/            <- nucleo da aplicacao (regras de negocio puras)
  |
application/       <- orquestracao (use cases)
  |
infrastructure/    <- adaptadores (Fastify, Drizzle, Better Auth, Nodemailer)
shared/            <- utilitarios e env vars
drizzle/           <- migrations do banco
```

**Regra de ouro**: nada em `domain/` importa de `infrastructure/`, `application/` ou `shared/`.

### Camadas

#### Domain (Nucleo)
- `entities/` — Modelos de dados: `Post`, `User`, `Group`, `GroupMessage`
- `ports/` — Interfaces (contratos): `IPostRepository`, `IGroupRepository`, `IEmailService`
- `errors/` — Excecoes de dominio: `ClientError`
- `value-objects/` — Objetos de valor: `IfceEmail` (validacao de email institucional)

#### Application (Casos de Uso)
- `use-cases/posts/` — CreatePost, ListPosts, DeletePost, ToggleRsvp
- `use-cases/groups/` — CreateGroup, UpdateGroup, DeleteGroup, JoinGroup, LeaveGroup, SendMessage, DeleteMessage, ListMessages
- `use-cases/notifications/` — SendLoginNotification
- `constants/permissions.ts` — `OFFICIAL_CARGOS` (Set de cargos que podem criar noticias)

#### Infrastructure (Adaptadores)

**HTTP (Fastify)**
- `app.ts` — buildApp(): registra CORS, Swagger, rotas, bodyLimit (10MB)
- `routes/` — posts.route.ts, groups.route.ts, users.route.ts, notifications.route.ts
- `middlewares/auth.handler.ts` — proxy de /api/auth/* para Better Auth
- `error-handler.ts` — tratamento de erros (validacao, body too large, ClientError)

**Database (Drizzle)**
- `schema/auth.schema.ts` — tabelas user, session, account, verification
- `schema/posts.schema.ts` — tabelas post, rsvp
- `schema/groups.schema.ts` — tabelas group, group_member, group_message
- `repositories/` — implementacao concreta das ports

**Auth (Better Auth)**
- `better-auth.ts` — instancia unica com plugins (i18n, emailOTP)
- `hooks.ts` — database hooks para notificacoes

**Email (Nodemailer)**
- `nodemailer.service.ts` — singleton de envio
- `templates.ts` — HTML de OTP e notificacoes

### Padrao de Rotas

Cada rota:
1. Valida input com Zod (`safeParse`)
2. Verifica sessao via `auth.api.getSession({ headers })`
3. Instancia use case como singleton
4. Executa o use case
5. Retorna resposta tipada

### Endpoints

| Metodo | Rota | Descricao |
|---|---|---|
| GET | /api/posts | Lista publicacoes paginadas |
| POST | /api/posts | Cria publicacao |
| PUT | /api/posts/:id | Atualiza publicacao |
| DELETE | /api/posts/:id | Remove publicacao |
| POST | /api/posts/:id/rsvp | Toggle de presenca |
| GET | /api/groups | Lista grupos |
| POST | /api/groups | Cria grupo |
| PUT | /api/groups/:id | Atualiza grupo |
| DELETE | /api/groups/:id | Remove grupo |
| POST | /api/groups/:id/join | Entra no grupo |
| DELETE | /api/groups/:id/leave | Sai do grupo |
| GET | /api/groups/:id/messages | Lista mensagens |
| POST | /api/groups/:id/messages | Envia mensagem |
| DELETE | /api/groups/:id/messages/:messageId | Remove mensagem |
| PATCH | /api/users/me | Atualiza perfil |
| POST | /api/notifications/login | Envia email de login |
| ALL | /api/auth/* | Proxy Better Auth |

---

## 5. Arquitetura Frontend

### Feature-Based Architecture

```
src/
  features/              <- modulos de dominio (cada feature e autocontida)
    feed/
      types.ts           <- interfaces do dominio
      api.ts             <- fetch puro
      query-keys.ts      <- chaves do TanStack Query
      hooks/             <- useXxx() que wrap api.ts com Query/Mutation
      components/        <- UI da feature
      utils/             <- helpers puros
    auth/
    events/
    news/
    groups/
    profile/

  components/
    layout/              <- Layout, Header, sidebars
    ui/                  <- primitivos shadcn (nao editar manualmente)

  pages/                 <- compositors finos (sem logica)
  router/                <- rotas manuais
  lib/                   <- auth-client, query-client, utils
```

### Fluxo de Dados

```
api.ts (fetch puro)
  -> query-keys.ts (chaves)
    -> hooks/useXxx.ts (useQuery/useMutation)
      -> componente consome o hook
        -> pages/xxx.tsx (composicao)
```

### Convencoes

- Imports de tipo: `import type { ... }` (`verbatimModuleSyntax: true`)
- Sem enums ou parameter properties (`erasableSyntaxOnly: true`)
- `@/*` alias para `src/*`
- Cada page tem identidade visual unica (Feed=neutral, Events=emerald, News=amber, Groups=indigo)
- Dark theme e o default

### Endpoints Principais

| Feature | Hook | Chave de Cache |
|---|---|---|
| Feed | `usePosts` | `feedKeys.posts()` |
| Eventos | `useEvents` | `feedKeys.posts()` |
| Noticias | `useNews` | `feedKeys.posts()` |
| Grupos | `useGroups` | `groupKeys.list()` |
| Mensagens | `useGroupMessages` | `groupKeys.messages(id)` |
| Sessao | `useSession` | `["session"]` |
| Perfil | `useUpdateProfile` | invalida session + feed + groups |

---

## 6. Principios SOLID

### S — Single Responsibility (Responsabilidade Unica)

**Backend:**
- `CreatePostUseCase` apenas cria posts — nao valida input, nao persiste, nao formata resposta
- `PostDrizzleRepository` apenas acessa o banco — nao contem regras de negocio
- `usersRoute` apenas roteia — delega logica para o use case

**Frontend:**
- `PostCard` apenas renderiza um post — nao busca dados, nao gerencia estado
- `PostComposer` apenas compoe o formulario — nao sabe como enviar dados
- `usePosts` apenas gerencia a query — nao renderiza nada
- `feedKeys` apenas gera chaves — nao depende de nada

### O — Open/Closed (Aberto/Fechado)

**Backend:**
- Novos tipos de post sao adicionados ao enum `PostType` e ao schema Zod discriminatedUnion sem modificar rotas existentes
- Novos use cases sao criados como classes novas, sem alterar as existentes
- `IGroupRepository` permite trocar implementacao Drizzle por qualquer outra sem mudar use cases

**Frontend:**
- `PostCard` usa switch sobre `post.type` — adicionar um novo tipo estende o comportamento sem modificar cards existentes
- `ProfileDialog` aceita `user` via props — pode ser reutilizado em qualquer contexto
- Componentes shadcn propagam `className` para customizacao pontual

### L — Liskov Substitution (Substituicao de Liskov)

**Backend:**
- Qualquer implementacao de `IGroupRepository` pode substituir `GroupDrizzleRepository` sem quebrar use cases

**Frontend:**
- `EventCard`, `NewsCard`, `GroupCard` seguem o padrao `{ item: T }` — podem ser trocados ou decorados sem impactar a pagina
- `TextPostForm`, `ImagePostForm`, `EventPostForm`, `NewsPostForm` implementam o mesmo contrato de `{ onSuccess }` — intercambiaveis dentro do PostComposer

### I — Interface Segregation (Segregacao de Interfaces)

**Backend:**
- `IPostRepository` e `IGroupRepository` sao interfaces separadas — um repositorio de grupos nao precisa implementar metodos de posts
- `ListPostsOptions` e `ListGroupsOptions` sao interfaces especificas, nao uma unica options generica

**Frontend:**
- `PostCardProps` recebe apenas `{ post, currentUserId, onEdit }` — sem props obrigatorias nao usadas
- `ProfileDialogProps` e minimo: `{ user, children }`
- `useUpdateProfile` aceita `options` opcional — sem interface pesada

### D — Dependency Inversion (Inversao de Dependencia)

**Backend:**
- `CreatePostUseCase` depende de `IPostRepository` (port), nao de `PostDrizzleRepository` (adapter)
- `auth.ts` e importado como modulo — nao instanciado inline nas rotas
- Rotas instanciam singletons no escopo do modulo, mas dependem das interfaces

**Frontend:**
- `usePosts` depende de `feedKeys` e `fetchPosts` — nao de implementacao concreta de API
- Paginas dependem de componentes de feature, nao de logica de dados
- `authClient` e importado de `lib/auth-client.ts` — centralizado

---

## 7. Clean Code

### Nomenclatura

| Contexto | Convencoes |
|---|---|
| Arquivos backend | kebab-case (`post.drizzle-repository.ts`) |
| Arquivos frontend | PascalCase para componentes (`PostCard.tsx`), camelCase para hooks (`usePosts.ts`) |
| Variaveis/funcoes | camelCase (`createPost`, `formatEventDate`) |
| Tipos/interfaces | PascalCase (`PostWithAuthor`, `GroupMessage`) |
| Constantes | UPPER_SNAKE_CASE (`OFFICIAL_CARGOS`, `IMAGE_MAX_BYTES`) |
| Enums Drizzle | snake_case (`user_role`, `post_type`) |

### Organizacao de Codigo

- **Um componente por arquivo** — `PostCard.tsx` exporta apenas `PostCard`
- **Subcomponentes internos** — `PostHeader`, `BannerAuthorRow` sao funcoes dentro de `PostCard.tsx`, nao exportadas
- **Arquivos de tipos separados** — `types.ts` por feature
- **Chaves de query centralizadas** — `query-keys.ts` por feature
- **Schemas Zod separados** — `schemas.ts` por feature
- **API pura separada de hooks** — `api.ts` (fetch) vs `hooks/` (Query/Mutation)

### Separacao de Responsabilidades

- **api.ts**: apenas `fetch()`, sem hooks, sem estado
- **hooks/**: apenas `useQuery`/`useMutation`, sem render
- **components/**: apenas render, sem logica de dados
- **pages/**: apenas composicao, sem logica

### Tipagem

- Types sempre explicitos em interfaces de props e outputs
- `import type` obrigatorio (`verbatimModuleSyntax`)
- Sem `any` — usar tipos genericos ou narrowing
- Enums proibidos — usar union types (`"text" | "image" | "event" | "news"`)

### Tratamento de Erros

**Backend:**
- `ClientError` para erros de dominio (400)
- `FST_ERR_VALIDATION` para erros de schema Zod (400)
- `FST_ERR_CTP_BODY_TOO_LARGE` para body excedido (413)
- `console.error` para erros inesperados (500)

**Frontend:**
- `showError()` do Sonner para feedback visual
- `onError` em mutations para tratamento centralizado
- `res.json().catch(() => null)` para responses nao-JSON

---

## 8. Banco de Dados

### Tabelas Principais

**user** (Better Auth + campos customizados)
| Coluna | Tipo | Observacao |
|---|---|---|
| id | uuid | PK, auto-generated |
| name | text | not null |
| email | text | unique, not null |
| email_verified | boolean | default false |
| image | text | foto de perfil (data URL) |
| course | text | curso do usuario |
| bio | text | biografia |
| role | enum | aluno/colaborador/admin |
| cargo | enum | 9 valores (aluno, professor, etc) |
| created_at | timestamp | default now |
| updated_at | timestamp | auto-update |

**post**
| Coluna | Tipo | Observacao |
|---|---|---|
| id | uuid | PK |
| author_id | uuid | FK -> user |
| type | enum | text/image/event/news |
| content | text | nullable |
| image_url | text | nullable |
| event_title | text | nullable |
| event_date | text | nullable |
| event_time | text | nullable |
| event_end_time | text | nullable |
| event_location | text | nullable |
| news_title | text | nullable |

**rsvp** — Unique em (post_id, user_id)

**group** — id, name, description, icon, author_id

**group_member** — group_id, user_id

**group_message** — id, group_id, author_id, content

### Migrations

- Geradas por `drizzle-kit generate`
- Aplicadas por `drizzle-kit migrate` ou `drizzle-kit push` (dev)
- SQL em `src/drizzle/migrations/`
- Snapshot em `src/drizzle/migrations/meta/`

---

## 9. Autenticacao

### Better Auth

- **Sessao**: cookie HttpOnly, Secure, SameSite=None (cross-domain)
- **OTP**: email com codigo de 6 digitos, expira em 300s
- **Plugins**: i18n (pt-BR), emailOTP
- **Hooks**: authDatabaseHooks para notificacoes

### Fluxo de Sessao

1. Frontend: `authClient.getSession()` envia cookie
2. Backend: `auth.api.getSession({ headers })` valida token
3. Retorna `{ user: { id, name, email, role, cargo, course, bio, image } }`

### Permissoes

- **Criar noticias**: role "admin" OU cargo em `OFFICIAL_CARGOS`
- **Excluir posts**: autor ou admin
- **Excluir mensagens**: apenas o autor
- **Gerenciar grupos**: autor ou admin

---

## 10. Deploy

### Backend (Vercel)

- Entry: `api/index.ts` (handler serverless)
- `vercel.json` mapeia todas as rotas para o handler
- App fica "viva" entre invocacoes (warm start)
- Migracoes nao rodam no deploy — aplicar manualmente

### Frontend (Vercel)

- Build: `npm run build` -> `dist/`
- `vercel.json` faz rewrite SPA para `/index.html`
- Env var: `VITE_API_URL`

### Variaveis de Ambente

| Variavel | Backend | Frontend |
|---|---|---|
| POSTGRES_URL | obrigatoria | — |
| BETTER_AUTH_SECRET | obrigatoria | — |
| FRONTEND_URL | obrigatoria (CORS) | — |
| BACKEND_URL | obrigatoria | — |
| SMTP_* | opcional (dev) | — |
| VITE_API_URL | — | obrigatoria |
