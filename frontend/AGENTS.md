# AGENTS.md — Frontend (CampusConnect)

> Vite + React 19 + TypeScript 6. Para a visão arquitetural completa (camadas, SOLID, fluxo de dados), ver `frontend/docs/ARCHITECTURE.md`. Este arquivo cobre só o que é difícil de inferir lendo o código.

---

## Stack (versões não convencionais)

| Ferramenta        | Versão  | Observação                                                                 |
| ----------------- | ------- | -------------------------------------------------------------------------- |
| Vite              | 8.x     | `vite.config.ts` carrega `@tailwindcss/vite` e `vite-plugin-pages`.        |
| React             | 19.x    | `<StrictMode>` ligado em `src/main.tsx`.                                   |
| TypeScript        | 6.x     | Modo estrito (ver regras abaixo).                                          |
| Tailwind CSS      | 4.x     | **Sem `tailwind.config.js`** — tema via CSS em `src/index.css`.            |
| shadcn/ui         | 4.7.0     | Estilo `radix-vega` (ver `components.json`), ícones `lucide`.              |
| TanStack Query    | 5.x     | Devtools ligado em `app/providers.tsx`.                                    |
| TanStack Form     | 1.x     | Formulários de auth com `validators: { onSubmit: zodSchema }`.             |
| better-auth       | 1.6.x   | Client em `src/lib/auth-client.ts` com `emailOTPClient`.                   |
| Zod               | 4.x     | Schemas em `features/<x>/schemas.ts`.                                      |
| date-fns          | 4.x     | Locale `ptBR` em `features/feed/utils/format.ts`.                          |
| Sonner            | 2.x     | Helpers em `src/lib/toast.ts` (`showSuccess`, `showError`, `showInfo`).    |

---

## Comandos

Todos executados em `frontend/`.

```bash
npm install              # instalar dependências
npm run dev              # dev server (Vite, porta padrão 5173)
npm run build            # tsc -b && vite build (build de produção)
npm run preview          # serve o build localmente
npm run lint             # eslint .
```

- **Não há script de teste** — o projeto não tem suíte de testes configurada.
- **Não há script de typecheck isolado** — `npm run build` já roda `tsc -b` e é a forma canônica de validar tipos.

---

## Pré-requisitos de ambiente

1. **Backend precisa estar rodando** em `http://localhost:3333` (ver `Backend/.env` → `PORT=3333`). Sem isso, login, listagem de posts e qualquer chamada autenticada quebram.
2. Variável obrigatória: `VITE_API_URL`. O arquivo `.env` já está commitado apontando para `http://localhost:3333`. Para produção, ver `.env.prod` (`https://campus-connect-api-zeta.vercel.app/`).
3. `src/env.ts` faz `requireEnv("VITE_API_URL")` em runtime — qualquer rota renderizada sem a variável joga erro. Adicionar nova env? Estender `src/env.d.ts` **e** `src/env.ts`.
4. **Cookies de sessão cross-domain**: o backend usa `sameSite: "none"`, `secure: true`, `httpOnly: true`. Em dev isso exige o frontend rodando em `http://localhost:5173` (origem exata) — abrir o app em outro host/porta quebra o cookie de sessão.

---

## Regras estritas do TypeScript (`tsconfig.app.json`)

O build falha se você violar qualquer uma:

- `verbatimModuleSyntax: true` → imports só de tipo **precisam** de `import type { ... }`.
- `erasableSyntaxOnly: true` → **proibido**: `enum`, parameter properties (`constructor(private x: string)`), namespaces, `module M {}`. Use `const` objects ou string union types.
- `noUnusedLocals` e `noUnusedParameters: true` → remova imports/variáveis/parâmetros não usados (ou prefixe com `_` para parâmetros).
- `noEmit: true` + `tsc -b` apenas valida; a emissão é do Vite.

---

## Aliases de caminho

Definidos em `tsconfig.json` e `tsconfig.app.json`, e replicados no `vite.config.ts`:

- `@/*` → `src/*` (canônico, use este)
- `components/*` → `src/components/*`
- `ui/*` → `src/components/ui/*`
- `lib/*` → `src/lib/*`
- `hooks/*` → `src/hooks/*`
- `utils/*` → `src/lib/*`

---

## Layout de pastas (apenas o que importa)

```
src/
├── main.tsx                  # entry: renderiza <Providers><App /></Providers>
├── App.tsx                   # apenas chama useRoutes(routes)
├── app/providers.tsx         # QueryClient + BrowserRouter + Tooltip + Toaster
├── router/index.tsx          # rotas manuais (ProtectedRoute / PublicOnlyRoute)
├── pages/                    # compositors finos — default export <Name>Page
├── features/                 # módulos de domínio
│   └── <feature>/
│       ├── types.ts          # interfaces/types do domínio
│       ├── data.ts           # mocks (será substituído por hooks de API)
│       ├── api.ts            # fetch() puro — chamado pelos hooks
│       ├── query-keys.ts     # fábrica de chaves do TanStack Query
│       ├── schemas.ts        # Zod schemas (quando houver formulários)
│       ├── utils/            # helpers puros do feature
│       ├── components/       # UI do feature
│       └── hooks/            # useXxx() que envolvem api.ts com useQuery/useMutation
├── components/
│   ├── layout/               # Layout, Header, sidebar-left, sidebar-right
│   ├── ui/                   # primitivos shadcn (NÃO editar à mão; use `npx shadcn@4 add ...`)
│   ├── nav-main.tsx, nav-user.tsx, nav-secondary.tsx
│   └── CreatePostDialog.tsx  # legado — use PostComposer (em features/feed)
├── hooks/                    # hooks globais (use-mobile, use-resend-cooldown)
├── lib/                      # auth-client, query-client, protected-route, toast, utils
├── env.ts / env.d.ts         # validação runtime + tipos de import.meta.env
└── index.css                 # Tailwind v4 + variáveis do tema (dark default)
```

---

## Convenções de nomenclatura

- **Páginas**: arquivo em camelCase (`feed.tsx`), export default `FeedPage` em PascalCase.
- **Componentes**: PascalCase no nome e no arquivo (`PostCard.tsx`).
- **Hooks**: camelCase prefixado com `use` (`usePosts`, `useToggleRsvp`).
- **Tipos/interfaces**: PascalCase em `types.ts` por feature.
- **Schemas Zod**: camelCase + `Schema` (`signinSchema`) e tipos inferidos `SigninFormValues` etc.

---

## Como adicionar uma feature

1. `src/features/<nome>/` com `types.ts`, `api.ts` (se houver dados remotos), `query-keys.ts` (se usar TanStack Query), `components/`, `hooks/`.
2. Página em `src/pages/<nome>.tsx` (compositor fino que só importa dos features).
3. Rota em `src/router/index.tsx` — decidir entre `ProtectedRoute`, `PublicOnlyRoute` ou rota pública.
4. Se a feature aparece no menu, adicionar item em `src/components/layout/sidebar-left.tsx` (array `navItems`).
5. Para UI atômica, usar `npx shadcn@4 add <componente>` — **não copiar/colar** código em `components/ui/`.

---

## Fetch de dados (padrão canônico)

`api.ts` (fetch puro) → `query-keys.ts` (chaves) → `hooks/useXxx.ts` (useQuery/useMutation) → componente consome o hook. Ver `features/feed/` como referência.

- Chave: sempre via `queryKeys.xxx()` exportado de `query-keys.ts`. **Não** usar chaves inline em `useQuery({ queryKey: ["feed", "posts"] })`.
- Mutations usam `queryClient.setQueryData` para inserir/remover do cache sem refetch (ver `use-create-post.ts`, `use-delete-post.ts`).
- `useToggleRsvp` é o exemplo de **update otimista** (cancelQueries → snapshot → setQueryData → rollback em onError → invalidate em onSettled).
- Defaults globais do `QueryClient` (`src/lib/query-client.ts`): `staleTime: 2min`, `gcTime: 10min`, `retry: 1`, `refetchOnWindowFocus: false`. Mutations: `retry: false`.
- Todas as chamadas usam `credentials: "include"` para enviar o cookie de sessão.

---

## Autenticação (`src/lib/auth-client.ts`)

- Cliente better-auth apontando para `env.API_URL`, com plugins `inferAdditionalFields` (campos extras `role` e `cargo` no `user`) e `emailOTPClient`.
- Exports prontos: `signIn`, `signUp`, `signOut`, `useSession`, `emailOtp`.
- **Domínios aceitos** (validados em `features/auth/schemas.ts`):
  - `@aluno.ifce.edu.br` → `role: "aluno"`, `cargo: "aluno"`.
  - `@ifce.edu.br` (não-aluno) → `role: "colaborador"`, `cargo` obrigatório.
- Signup tem dois forms (Aluno / Colaborador) num `Tabs`. Só cargos oficiais (`direcao`, `administracao`, `coordenador`, `centro_academico`) veem o botão "Notícia" no `PostComposer`.

---

## Roteamento e guards (`src/router/index.tsx`, `src/lib/protected-route.tsx`)

- `index: true` → `Navigate to="/feed"`.
- `*` (catch-all) → `NotFoundRedirect` (vai para `/feed` se logado, senão `/signin`).
- `ProtectedRoute`: exige sessão **e** `emailVerified`; sem verificação → `/verify-email?email=...`.
- `PublicOnlyRoute`: redireciona logado para `/feed`; se logado mas não verificado → `/verify-email`.
- `Layout` envolve `feed`, `events`, `news`, `groups`. Rotas públicas (`signin`, `signup`, `verify-email`, `forgot-password`, `reset-password`, `signin-otp`) ficam **fora** dele.

---

## UI / tema

- **Tema dark é o default** (`<body class="dark">` em `index.html`). Variáveis de cor ficam em `src/index.css`.
- Ícones: `lucide-react` (primário) — Hugeicons está instalado mas é secundário.
- `components/ui/*` é gerado por shadcn; **não editar manualmente**.
- `SidebarProvider` (de `components/ui/sidebar.tsx`) é usado em `Layout`; toggle global via `Ctrl+B` (ver `Header`).

---

## Deploy

- `vercel.json` faz rewrite SPA para `/index.html` e usa `dist/` como output.
- Variáveis de produção: ver `.env.prod` (apenas referência; **não** é carregado automaticamente pelo Vite — o painel do Vercel precisa de `VITE_API_URL`).
- Builds de PR ficam em `dist/` (gerado por `npm run build`).

---

## Pegadinhas / coisas que um agente pode errar

- **Não usar `vite-plugin-pages`**: o plugin está instalado e configurado em `vite.config.ts`, mas as rotas são **definidas manualmente** em `src/router/index.tsx`. Ignore o plugin — não há auto-roteamento.
- **Não trocar `ReactDOM.createRoot` por outro entry point** — `main.tsx` é o único ponto de montagem.
- **Theme dark é fixo**: não há toggle de tema no app; se for adicionar, o `next-themes` está instalado.
- **`PostCard` é um switch** (`post.type`): ao adicionar um novo tipo de post, atualizar `features/feed/types.ts` (union) e o switch em `PostCard.tsx`. TypeScript vai reclamar nos call sites.
- **`CreatePostDialog.tsx` é componente órfão/legado** (`src/components/`). O fluxo real de criação é `PostComposer` dentro de `features/feed/components/`.
- **Mocks em `features/{events,news,groups}/data.ts`** não têm API correspondente ainda — só `feed` tem `api.ts`. Se criar API para um deles, seguir o padrão de `feed`.
- **Logout não é automático**: `signOut()` só limpa a sessão. Redirecionar manualmente com `navigate("/signin")` (ver `sidebar-left.tsx:38` e `nav-user.tsx:43`).
- **`PostComposer` exige `imageUrl` como data URL** para upload de imagem (máx. 2 MB, `PostComposer.tsx:92`). Não há upload para storage remoto ainda.

---

## Documentação de referência

- `frontend/docs/ARCHITECTURE.md` — camadas, princípios SOLID aplicados, fluxo de dados, como adicionar feature (canônico).
- `Backend/GEMINI.md` — arquitetura hexagonal do backend, comandos de migração Drizzle.
- `frontend/components.json` — config do shadcn (aliases, estilo, ícones).
