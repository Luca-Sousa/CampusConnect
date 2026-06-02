# CampusConnect Backend - Arquitetura Hexagonal

Este projeto implementa o backend do CampusConnect seguindo os princípios da **Arquitetura Hexagonal (Ports & Adapters)**, garantindo uma clara separação entre a lógica de negócio, os casos de uso e as integrações externas.

## 🏗️ Estrutura de Pastas (`src/`)

- **`domain/`**: Núcleo da aplicação (Core). Contém a lógica de negócio pura.
  - `entities/`: Modelos de dados e regras de negócio essenciais (ex: `Post`, `User`).
  - `ports/`: Interfaces que definem como o mundo externo deve interagir com o core (Repositories, Services).
  - `errors/`: Exceções específicas de domínio (ex: `ClientError`).
  - `value-objects/`: Objetos de valor com validações próprias (ex: `IfceEmail`).

- **`application/`**: Camada de orquestração.
  - `use-cases/`: Implementação dos fluxos de negócio (ex: `CreatePostUseCase`).
  - `constants/`: Constantes globais da aplicação (ex: `permissions.ts`).

- **`infrastructure/`**: Adaptores e detalhes de implementação.
  - `http/`: Camada de entrada web (Fastify).
    - `routes/`: Definição de endpoints e injeção de dependências nos Use Cases.
    - `middlewares/`: Handlers de autenticação e outros.
    - `openapi/`: Documentação Swagger/OpenAPI.
  - `database/`: Persistência de dados (Drizzle ORM).
    - `repositories/`: Implementação concreta dos repositórios definidos no domínio.
    - `schema/`: Definição de tabelas do banco de dados.
  - `auth/`: Configuração e integração de autenticação (Better Auth).
  - `email/`: Serviços de envio de e-mail (Nodemailer).

- **`shared/`**: Utilitários e configurações compartilhadas.
  - `env.ts`: Validação de variáveis de ambiente com Zod.
  - `utils/`: Funções auxiliares.

- **`drizzle/`**: Gerenciamento de migrações.

## 🛠️ Ferramentas Utilizadas

- **Framework**: [Fastify](https://fastify.io/)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Autenticação**: [Better Auth](https://www.better-auth.com/)
- **Validação**: [Zod](https://zod.dev/)
- **E-mail**: [Nodemailer](https://nodemailer.com/)
- **Banco de Dados**: PostgreSQL

## 🚀 Como Executar

### Pré-requisitos
- Node.js (>= 22)
- PostgreSQL

### Instalação
```bash
npm install
```

### Desenvolvimento
```bash
npm run dev
```

### Build & Produção
```bash
npm run build
npm start
```

## 🗄️ Banco de Dados

- **Gerar migrações**: `npm run generate`
- **Aplicar migrações**: `npm run migrate`
- **Sincronizar schema (Push)**: `npm run push`
- **Visualizar banco (Studio)**: `npm run studio`

## 📜 Diretrizes de Desenvolvimento

1. **Separação de Responsabilidades**: Nunca importe nada da camada de `infrastructure` dentro do `domain`.
2. **Inversão de Dependência**: Os Use Cases devem depender apenas de interfaces (ports).
3. **Surgical Edits**: Ao modificar rotas, prefira mover a lógica para um Use Case se houver regras de negócio envolvidas.
4. **Tipagem**: Use `tsx` para desenvolvimento e `tsc` para validar tipos antes do deploy.
