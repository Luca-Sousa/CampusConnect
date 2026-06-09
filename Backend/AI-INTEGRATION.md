# Integração IA (Moderação e Sugestão de Tags)

Este documento descreve como a integração com provedor de IA foi adicionada ao backend do CampusConnect.

## O que foi adicionado

- `IAService` (interface): `Backend/src/domain/ports/services/ai.service.ts` — definição de `moderate()` e `suggestTags()`.
- `OpenAIService` (implementação): `Backend/src/infrastructure/ai/openai-ai.service.ts` — implementação básica usando as APIs de Moderation e Chat Completions.
- Env vars adicionadas em `Backend/src/shared/env.ts`:
  - `AI_PROVIDER` (default `openai`)
  - `AI_API_KEY`
  - `AI_API_URL` (opcional)
  - `AI_MODEL` (default `gpt-4o-mini`)
  - `MODERATION_THRESHOLD` (0-1, default `0.6`)
- Campos adicionados ao `post`:
  - `tags` (text)
  - `moderated` (boolean)
  - `moderation_reasons` (text)
- Migration SQL: `Backend/src/drizzle/migrations/0013_add_post_tags_moderation.sql`
- Use-case atualizado: `CreatePostUseCase` agora verifica moderação e solicita tags antes de salvar.
- Frontend: `CreatePostDialog` atualizado para chamar a API e exibir `tags` e estado `moderated`.
- Script de teste rápido: `npm run ai-test` (no `Backend`) usa `tsx src/infrastructure/ai/test-ai.ts`.

## Como usar

1. Adicione a chave da API ao `.env` do backend:

```env
AI_PROVIDER=openai
AI_API_KEY=sk-...
AI_API_URL=
AI_MODEL=gpt-4o-mini
MODERATION_THRESHOLD=0.6
```

2. Rode as migrations (Drizzle):

```bash
npm run migrate
```

3. Inicie o backend em modo dev:

```bash
npm run dev
```

4. (Opcional) Teste a integração IA manualmente:

```bash
npm run ai-test
```

## Observações

- A implementação atual tenta extrair JSON da resposta do modelo para `suggestTags`. Dependendo do modelo/resposta, pode falhar; recomenda-se ajustar o prompt ou usar uma API de embeddings+KNN para tags mais estáveis.
- Recomendo adicionar rate-limiting e retries expondo erros mais claros para o usuário.

