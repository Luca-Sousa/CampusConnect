/**
 * Constrói um objeto apenas com os campos cujo valor atual diverge do
 * original. Usado pelos forms em modo edit para enviar ao backend apenas
 * o delta, evitando resetar campos que o usuário não tocou.
 *
 * Convenção de três estados (sincronizada com o `pickField` do backend):
 *  - Valor igual ao original → campo OMITIDO do resultado (não envia).
 *  - Valor novo não-vazio, diferente do original → envia o valor.
 *  - Valor vazio (`""`) quando o original era não-vazio → envia `null`
 *    (limpar explicitamente).
 *
 * Valores `null`/`undefined` são normalizados para `""` durante a
 * comparação para evitar falso-positivo de "mudou" quando o original
 * era `null` e o atual também é `""` (vazio equivalente).
 *
 * @example
 * buildEditBody(
 *   { content: "nova legenda", imageUrl: "data:..." },
 *   { content: "legenda antiga", imageUrl: "data:..." }
 * )
 * // → { content: "nova legenda" }
 */
export function buildEditBody<T extends Record<string, unknown>>(
  current: T,
  original: Partial<T> = {},
): Partial<T> {
  const body: Partial<T> = {};

  for (const key of Object.keys(current) as Array<keyof T>) {
    const cur = current[key];
    const orig = original[key];

    // Normaliza para string para comparação: null/undefined → ""
    const curStr = cur == null ? "" : String(cur);
    const origStr = orig == null ? "" : String(orig);

    if (curStr === origStr) continue;

    // Trimming em strings para tratar "  " como equivalente a ""
    const curTrim = typeof cur === "string" ? cur.trim() : curStr;
    const origTrim = typeof orig === "string" ? orig.trim() : origStr;

    if (curTrim === "" && origTrim === "") continue;

    // @ts-expect-error - narrowed by key, runtime-safe
    body[key] = curTrim === "" ? null : curTrim;
  }

  return body;
}
