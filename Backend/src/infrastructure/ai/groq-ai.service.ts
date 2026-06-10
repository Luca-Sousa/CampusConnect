import { env } from "../../shared/env.js";
import type {
  IAIService,
  ModerationResult,
  ModerationCategory,
  TagSuggestion,
} from "../../domain/ports/services/ai.service.js";
import { GroqClient } from "./groq-client.js";
import {
  MODERATION_SYSTEM_PROMPT,
  buildModerationPrompt,
  TAGS_SYSTEM_PROMPT,
  buildTagsPrompt,
} from "./prompts.js";
import {
  extractJsonFromText,
  extractJsonArrayFromText,
} from "./json-extractor.js";

interface ModerationResponse {
  category: string;
  reason: string;
}

interface TagResponse {
  tag: string;
  score?: number;
}

/**
 * Implementação de `IAIService` usando Groq (LLM).
 *
 * Segue DIP: a classe implementa a porta `IAIService` e pode ser
 * injetada em qualquer use case que dependa da interface.
 *
 * Em produção, o construtor recebe a API key via `env`.
 * Se a chave não estiver configurada, os métodos retornam valores
 * seguros (allowed: true / tags vazias) — o app não quebra.
 */
export class GroqAIService implements IAIService {
  private readonly client: GroqClient | null;

  constructor(apiKey?: string) {
    const key = apiKey ?? env.AI_API_KEY;
    this.client = key ? new GroqClient(key) : null;
  }

  async moderate(text: string): Promise<ModerationResult> {
    if (!this.client) {
      return { allowed: true, categories: [] };
    }

    try {
      const content = await this.client.chat({
        model: env.AI_MODEL,
        messages: [
          { role: "system", content: MODERATION_SYSTEM_PROMPT },
          { role: "user", content: buildModerationPrompt(text) },
        ],
        temperature: 0.1,
      });

      const parsed = extractJsonFromText<ModerationResponse>(content);
      if (!parsed) {
        return { allowed: true, categories: [] };
      }

      return this.buildModerationResult(parsed);
    } catch (err) {
      console.error("[AI][Moderation] Groq error", err);
      return { allowed: true, categories: [] };
    }
  }

  async suggestTags(text: string, limit = 5): Promise<TagSuggestion[]> {
    if (!this.client) return [];

    try {
      const content = await this.client.chat({
        model: env.AI_MODEL,
        messages: [
          { role: "system", content: TAGS_SYSTEM_PROMPT },
          { role: "user", content: buildTagsPrompt(text, limit) },
        ],
        temperature: 0.2,
      });

      const parsed = extractJsonArrayFromText<TagResponse>(content);
      if (!parsed) return [];

      return parsed
        .slice(0, limit)
        .map((p) => ({ tag: p.tag, score: p.score ?? 1 }));
    } catch (err) {
      console.error("[AI][SuggestTags] Groq error", err);
      return [];
    }
  }

  private buildModerationResult(response: ModerationResponse): ModerationResult {
    const allowed = response.category === "Aceitavel";
    const categories: ModerationCategory[] = [
      { name: response.category, score: allowed ? 0 : 1 },
    ];
    const reasons = allowed ? [] : [`${response.category}: ${response.reason}`];

    return { allowed, categories, reasons };
  }
}
