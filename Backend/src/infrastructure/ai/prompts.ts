export const MODERATION_SYSTEM_PROMPT =
  "Você é um moderador de conteúdo. Responda apenas com JSON válido.";

export function buildModerationPrompt(text: string): string {
  return `Analise o texto abaixo e classifique-o em EXATAMENTE UMA das seguintes categorias:

- "Aceitável": Conteúdo normal, seguro para publicação, amigável ou neutro.
- "Spam": Propaganda não solicitada, links suspeitos, golpes, correntes, conteúdo promocional repetitivo e sequências de termos aleatórios/palavras desconexas que não fazem sentido no contexto.
- "Toxicidade Leve": Ofensas leves, palavrões sem direcionamento grave, grosserias, sarcasmo hostil ou desrespeito moderado.
- "Toxicidade Grave": Bullying, discurso de ódio (raça, gênero, religião, etc.), ameaças de violência, assédio direcionado ou discriminação explícita.

Responda APENAS com um JSON no formato:
{"category": "Aceitável|Spam|Toxicidade Leve|Toxicidade Grave", "reason": "breve explicação em pt-BR"}

Texto: """${text.replace(/"/g, '\\"')}"""`;
}

export const TAGS_SYSTEM_PROMPT = "Você gera tags relevantes.";

export function buildTagsPrompt(text: string, limit: number): string {
  return `Você é um assistente que sugere até ${limit} tags curtas (1-3 palavras) para um post. Retorne somente um JSON array no formato [{"tag":"...","score":0.0}, ...]. Post: """${text.replace(/"/g, '\\"')}"""`;
}
