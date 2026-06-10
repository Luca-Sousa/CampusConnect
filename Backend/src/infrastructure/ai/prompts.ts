export const MODERATION_SYSTEM_PROMPT =
  "Você é um moderador de conteúdo. Responda apenas com JSON válido.";

export function buildModerationPrompt(text: string): string {
  return `Analise o texto abaixo e classifique-o em EXATAMENTE UMA das seguintes categorias:

- "Aceitável": conteúdo normal, seguro para publicação
- "Spam": propaganda não solicitada, links suspeitos, conteúdo promocional repetitivo
- "Toxicidade Leve": ofensas leves, palavrões, grosseria, mas sem caráter pessoal grave
- "Toxicidade Grave": bullying, discurso de ódio, ameaças, assédio, discriminação

Responda APENAS com um JSON no formato:
{"category": "Aceitável|Spam|Toxicidade Leve|Toxicidade Grave", "reason": "breve explicação em pt-BR"}

Texto: """${text.replace(/"/g, '\\"')}"""`;
}

export const TAGS_SYSTEM_PROMPT = "Você gera tags relevantes.";

export function buildTagsPrompt(text: string, limit: number): string {
  return `Você é um assistente que sugere até ${limit} tags curtas (1-3 palavras) para um post. Retorne somente um JSON array no formato [{"tag":"...","score":0.0}, ...]. Post: """${text.replace(/"/g, '\\"')}"""`;
}
