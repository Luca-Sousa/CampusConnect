# Integração IA (Moderação e Sugestão de Tags)

Este documento descreve como a integração com provedor de IA foi adicionada ao backend do CampusConnect.

## Provedor: Groq (Gratuito)

O CampusConnect usa a **Groq API** com o modelo **Llama 3.1 8B** para moderação de conteúdo e sugestão de tags. A Groq oferece um tier gratuito com 30 RPM / 14.400 RPD, suficiente para desenvolvimento e testes.

## Arquitetura

A integração segue os princípios SOLID e Clean Code:

```
Backend/src/infrastructure/ai/
├── groq-client.ts          # Cliente Groq (SDK oficial)
├── groq-ai.service.ts      # Implementação de IAIService
├── prompts.ts              # Prompts de moderação e tags
└── json-extractor.ts       # Utilitário para extrair JSON de respostas
```

### Componentes

- **GroqClient**: Cliente que encapsula o SDK oficial do Groq (`groq-sdk`). Responsável por autenticação e chamadas à API.
- **Prompts**: Funções puras que constroem os prompts de moderação e tags. Separados para facilitar manutenção e testes.
- **JsonExtractor**: Utilitários para extrair JSON de respostas de texto. Trata falhas de parsing de forma segura.
- **GroqService**: Implementação de `IAIService` que orquestra os componentes acima.

## O que foi adicionado

- `IAService` (interface): `Backend/src/domain/ports/services/ai.service.ts` — definição de `moderate()` e `suggestTags()`.
- `GroqClient`: `Backend/src/infrastructure/ai/groq-client.ts` — cliente Groq usando SDK oficial.
- `GroqService` (implementação): `Backend/src/infrastructure/ai/groq-ai.service.ts` — implementação usando a API do Groq.
- `Prompts`: `Backend/src/infrastructure/ai/prompts.ts` — prompts de moderação e tags.
- `JsonExtractor`: `Backend/src/infrastructure/ai/json-extractor.ts` — utilitário de parsing.
- Env vars em `Backend/src/shared/env.ts`:
  - `AI_API_KEY` (chave da Groq API)
  - `AI_MODEL` (default `llama-3.1-8b-instant`)
  - `MODERATION_THRESHOLD` (0-1, default `0.6`)
- Campos adicionados ao `post`:
  - `tags` (text)
  - `moderated` (boolean)
  - `moderation_reasons` (text)
- Migration SQL: `Backend/src/drizzle/migrations/0013_add_post_tags_moderation.sql`
- Use-case atualizado: `CreatePostUseCase` agora verifica moderação e solicita tags antes de salvar.

## Como usar

1. Obtenha uma chave gratuita em [console.groq.com](https://console.groq.com)

2. Adicione a chave ao `.env` do backend:

```env
AI_API_KEY=gsk_...
AI_MODEL=llama-3.1-8b-instant
MODERATION_THRESHOLD=0.6
```

3. Inicie o backend em modo dev:

```bash
npm run dev
```

## Moderação de Conteúdo

A moderação usa chat completions com um prompt de classificação. O modelo classifica o texto em:

- **Aceitável**: conteúdo normal, seguro para publicação
- **Spam**: propaganda não solicitada, links suspeitos
- **Toxicidade Leve**: ofensas leves, palavrões, grosseria
- **Toxicidade Grave**: bullying, discurso de ódio, ameaças

Postagens "Aceitáveis" são publicadas automaticamente. Outras são retidas para moderação humana com um feedback gerado pela IA.

## Sugestão de Tags (IA-002)

Ao criar um evento, a IA lê a descrição e sugere tags como `#festa`, `#acadêmico`, `#esporte`, etc.

## Observações

- Se `AI_API_KEY` não estiver configurada, a IA é bypassada (posts são publicados sem moderação).
- A implementação usa o SDK oficial do Groq (`groq-sdk`), que é gratuito.
- A arquitetura permite facilmente trocar o provedor de IA implementando `IAIService`.
- Recomendo adicionar rate-limiting e retries em produção.
