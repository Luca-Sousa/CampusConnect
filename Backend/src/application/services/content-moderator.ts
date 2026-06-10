import type { IAIService } from "../../domain/ports/services/ai.service.js";
import { InvalidError } from "../../domain/errors/invalid.js";

/**
 * Resultado da moderação de conteúdo.
 *
 * `action` resume a decisão em termos de negócio:
 *  - `"allow"`: conteúdo aceitável, publicação imediata.
 *  - `"retain"`: spam ou toxicidade leve — retido para moderação manual.
 *  - `"block"`: toxicidade grave — publicação proibida.
 */
export type ModerationAction = "allow" | "retain" | "block";

export interface ModerationOutcome {
  action: ModerationAction;
  moderated: boolean;
  moderationReasons: string[];
  tags: string[];
}

/**
 * Serviço de moderação de conteúdo (application layer).
 *
 * Encapsula as regras de negócio que decidem o destino de um texto
 * com base no resultado da classificação AI. Responsabilidades:
 *  - Coordenar classificação + sugestão de tags via `IAIService`.
 *  - Traduzir categorias AI em ações de negócio (`allow`/`retain`/`block`).
 *  - Lançar erro `INVALID:` para conteúdo grave (padrão do projeto).
 *
 * Segue SRP (só decide moderação), DIP (depende da porta `IAIService`)
 * e OCP (regras centralizadas — alterações em thresholds mudam aqui).
 */
export class ContentModerator {
  constructor(private readonly aiService: IAIService) {}

  /**
   * Analisa o texto e retorna o resultado da moderação.
   * Texto vazio ou whitespace é considerado aceitável sem chamar a AI.
   */
  async moderate(text: string): Promise<ModerationOutcome> {
    if (text.trim().length === 0) {
      return {
        action: "allow",
        moderated: false,
        moderationReasons: [],
        tags: [],
      };
    }

    const mod = await this.aiService.moderate(text);

    if (mod.allowed) {
      const suggestions = await this.aiService.suggestTags(text, 5);
      return {
        action: "allow",
        moderated: false,
        moderationReasons: [],
        tags: suggestions.map((s) => s.tag),
      };
    }

    const isSevere = mod.categories.some(
      (c) => c.name === "Toxicidade Grave",
    );

    if (isSevere) {
      throw new InvalidError("Sua publicação contém conteúdo tóxico grave e não pode ser publicada.");
    }

    return {
      action: "retain",
      moderated: true,
      moderationReasons: mod.reasons ?? [],
      tags: [],
    };
  }
}
