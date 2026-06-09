import { env } from "../../shared/env.js";
import type {
  IAIService,
  ModerationResult,
  ModerationCategory,
  TagSuggestion,
} from "../../domain/ports/services/ai.service.js";

class OpenAIService implements IAIService {
  private apiKey = env.AI_API_KEY;
  private apiUrl = env.AI_API_URL ?? "https://api.openai.com";

  private get headers() {
    return {
      Authorization: this.apiKey ? `Bearer ${this.apiKey}` : "",
      "Content-Type": "application/json",
    };
  }

  async moderate(text: string): Promise<ModerationResult> {
    if (!this.apiKey) {
      return { allowed: true, categories: [] };
    }

    try {
      const url = `${this.apiUrl.replace(/\/$/, "")}/v1/moderations`;
      const res = await fetch(url, {
        method: "POST",
        headers: this.headers,
        body: JSON.stringify({ model: "omni-moderation-latest", input: text }),
      });

      const data = await res.json();

      const result = data.results?.[0] ?? null;
      if (!result) return { allowed: true, categories: [] };

      const categoryScores: Record<string, number> = result.category_scores ?? {};
      const categories: ModerationCategory[] = Object.keys(categoryScores).map(
        (k) => ({ name: k, score: Number(categoryScores[k]) ?? 0 }),
      );

      const threshold = env.MODERATION_THRESHOLD;
      const violated = categories.filter((c) => c.score >= threshold);

      const allowed = violated.length === 0;
      const reasons = violated.map((c) => `${c.name} (${(c.score * 100).toFixed(0)}%)`);

      return { allowed, categories, reasons };
    } catch (err) {
      console.error("[AI][Moderation] erro", err);
      return { allowed: true, categories: [] };
    }
  }

  async suggestTags(text: string, limit = 5): Promise<TagSuggestion[]> {
    if (!this.apiKey) return [];

    try {
      const url = `${this.apiUrl.replace(/\/$/, "")}/v1/chat/completions`;
      const prompt = `Você é um assistente que sugere até ${limit} tags curtas (1-3 palavras) para um post. Retorne somente um JSON array no formato [{"tag":"...","score":0.0}, ...]. Post: """${text.replace(/"/g, '\\"')}"""`;

      const res = await fetch(url, {
        method: "POST",
        headers: this.headers,
        body: JSON.stringify({
          model: env.AI_MODEL,
          messages: [{ role: "system", content: "Você gera tags relevantes." }, { role: "user", content: prompt }],
          max_tokens: 256,
          temperature: 0.2,
        }),
      });

      const data = await res.json();
      const textResp = data.choices?.[0]?.message?.content ?? data.choices?.[0]?.text ?? "";

      // Tenta extrair JSON do texto
      const jsonStart = textResp.indexOf("[");
      const jsonEnd = textResp.lastIndexOf("]");
      if (jsonStart === -1 || jsonEnd === -1) return [];

      const jsonText = textResp.slice(jsonStart, jsonEnd + 1);
      const parsed = JSON.parse(jsonText) as Array<{ tag: string; score?: number }>;

      return parsed.slice(0, limit).map((p) => ({ tag: p.tag, score: p.score ?? 1 }));
    } catch (err) {
      console.error("[AI][SuggestTags] erro", err);
      return [];
    }
  }
}

export const aiService = new OpenAIService();
