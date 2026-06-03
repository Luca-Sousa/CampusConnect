# CampusConnect

Rede social academica para o campus do **IFCE — Instituto Federal do Ceara**. Conecta estudantes e colaboradores por meio de publicacoes, eventos, comunicados oficiais e grupos com chat em tempo real.

## Funcionalidades

- **Feed** — publicacoes de texto, imagem, evento e noticia com interacoes (curtir, comentar, compartilhar)
- **Eventos** — criacao com data, horario e local; confirmacao de presenca (RSVP); indicador de eventos encerrados
- **Noticias** — comunicados oficiais com destaque hero; controle por cargos (direcao, administracao, coordenador)
- **Grupos** — criacao livre, entrada/saida de membros, chat em tempo real com emoji picker
- **Perfil** — edicao com foto (upload), curso e biografia; avatar propagado em todo o app

## Stack

| Camada | Tecnologias |
|---|---|
| Frontend | React 19, TypeScript 6, Vite 8, Tailwind CSS 4, shadcn/ui, TanStack Query |
| Backend | Fastify 5, Drizzle ORM, Better Auth, Zod 4, Nodemailer |
| Banco | PostgreSQL 15+ (Neon em producao) |
| Deploy | Vercel (frontend + backend serverless) |

## Estrutura do Projeto

```
CampusConnect/
├── Backend/                   # API REST (Fastify + Drizzle)
│   ├── src/
│   │   ├── domain/            # Entidades, ports, value-objects
│   │   ├── application/       # Use cases
│   │   ├── infrastructure/    # HTTP, DB, Auth, Email
│   │   └── shared/            # Env, utils
│   └── api/                   # Entry Vercel (serverless)
├── frontend/                  # SPA (React + Vite)
│   └── src/
│       ├── features/          # Modulos de dominio (feed, auth, events, news, groups, profile)
│       ├── components/        # Layout e UI compartilhada
│       ├── pages/             # Compositors de pagina
│       └── lib/               # Auth client, utils
└── DOCUMENTACAO.md            # Documentacao tecnica completa
```

## Como Rodar

### Pre-requisitos

- Node.js >= 22
- PostgreSQL (local via Docker ou Neon em producao)

### Backend

```bash
cd Backend
npm install
cp .env.example .env          # configurar variaveis
npm run dev                    # tsx watch, porta 3333
npm run migrate                # aplicar migrations
```

### Frontend

```bash
cd frontend
npm install
npm run dev                    # Vite, porta 5173
```

O frontend precisa do backend rodando em `http://localhost:3333`.

## Variaveis de Ambiente

### Backend (`Backend/.env`)

| Variavel | Obrigatoria | Descricao |
|---|---|---|
| `POSTGRES_URL` | sim | String de conexao PostgreSQL |
| `BETTER_AUTH_SECRET` | sim | Segredo para tokens (generate com `openssl rand -base64 32`) |
| `FRONTEND_URL` | sim | Origem(s) do frontend para CORS (separar por virgula) |
| `BACKEND_URL` | sim | URL do backend para trusted origins |
| `SMTP_HOST` | nao | Host SMTP (opcional em dev) |
| `SMTP_PORT` | nao | Porta SMTP (default 587) |
| `SMTP_USER` / `SMTP_PASS` | nao | Credenciais SMTP |
| `SMTP_FROM` | nao | Email remetente |

### Frontend (`frontend/.env`)

| Variavel | Obrigatoria | Descricao |
|---|---|---|
| `VITE_API_URL` | sim | URL do backend (default: `http://localhost:3333`) |

## Arquitetura

O projeto segue **Arquitetura Hexagonal** no backend e **Feature-Based Architecture** no frontend, aplicando os principios **SOLID** e praticas de **Clean Code** em toda a base.

Consulte [`DOCUMENTACAO.md`](./DOCUMENTACAO.md) para detalhes completos sobre:
- Arquitetura por camadas
- Principios SOLID com exemplos concretos
- Convencoes de Clean Code
- Schema do banco de dados
- Fluxo de autenticacao
- Deploy e variaveis de ambiente

## Comandos Utis

```bash
# Backend
npm run dev          # desenvolvimento
npm run build        # build de producao
npm run migrate      # aplicar migrations
npm run generate     # gerar migration apos mudar schema
npm run studio       # GUI do banco (Drizzle Studio)

# Frontend
npm run dev          # dev server
npm run build        # tsc + vite build
npm run lint         # eslint
```

## Licenca

Projeto academico — IFCE Instituto Federal do Ceara.
