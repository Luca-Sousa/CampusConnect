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

class GroqService implements IAIService {
  private readonly client: GroqClient | null;

  constructor() {
    this.client = env.AI_API_KEY ? new GroqClient(env.AI_API_KEY) : null;
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
    const allowed = response.category === "Aceitável";
    const categories: ModerationCategory[] = [
      { name: response.category, score: allowed ? 0 : 1 },
    ];
    const reasons = allowed ? [] : [`${response.category}: ${response.reason}`];

    return { allowed, categories, reasons };
  }
}

export const aiService = new GroqService();
