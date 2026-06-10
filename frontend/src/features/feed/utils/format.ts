import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { EventPost } from "../types";

/**
 * Formata uma data ISO em tempo relativo compacto.
 *
 * @example
 * formatRelativeTime("2024-06-01T10:00:00Z") // "agora" | "5min" | "2h" | "3d" | "1 de jun"
 */
export function formatRelativeTime(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime();
  const minutes = Math.floor(diff / 60_000);

  if (minutes < 1) return "agora";
  if (minutes < 60) return `${minutes}min`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;

  return format(new Date(isoDate), "d 'de' MMM", { locale: ptBR });
}

/**
 * Normaliza o `eventDate` para um `Date` válido.
 *
 * Aceita:
 *  - "YYYY-MM-DD" (formato vindo do form / armazenado no banco)
 *  - ISO 8601 completo (ex.: "2024-06-03T00:00:00.000Z")
 *  - já um `Date`
 *
 * Retorna `undefined` se o valor for vazio, nulo ou não parseável — em vez
 * de explodir em "Invalid time value" no `date-fns` e derrubar a árvore
 * React inteira.
 */
function parseEventDate(value: string | Date | null | undefined): Date | undefined {
  if (value == null || value === "") return undefined
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? undefined : value
  }
  const raw = String(value).trim()
  if (!raw) return undefined

  // YYYY-MM-DD (sem parte de tempo) → ancora em local time para o dia certo
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    const d = new Date(`${raw}T00:00:00`)
    return Number.isNaN(d.getTime()) ? undefined : d
  }

  // ISO 8601 ou qualquer string que o `Date` aceite nativamente
  const d = new Date(raw)
  return Number.isNaN(d.getTime()) ? undefined : d
}

/**
 * Formata uma data de evento para o padrão longo em pt-BR.
 *
 * @example
 * formatEventDate("2024-06-03") // "segunda-feira, 3 de junho"
 *
 * Retorna a string original (ou vazia) se a data não for parseável,
 * em vez de quebrar a renderização.
 */
export function formatEventDate(date: string | Date | null | undefined): string {
  const d = parseEventDate(date)
  if (!d) return typeof date === "string" ? date : ""
  return format(d, "EEEE',' d 'de' MMMM", { locale: ptBR })
}

/**
 * Formata um range de horários (HH:mm) para exibição.
 * Sem end: mostra só o start. Com end: "14:00 – 18:00".
 */
export function formatEventTimeRange(
  start: string,
  end: string | null,
): string {
  return end ? `${start} – ${end}` : start;
}

/**
 * Verifica se o horário de início de um evento já passou.
 *
 * Considera a combinação de `eventDate` (YYYY-MM-DD) e `eventTime` (HH:mm)
 * — o `eventEndTime` é ignorado porque a "passagem" do evento é definida
 * pelo seu início. Retorna `false` se a data/hora não forem parseáveis
 * (eventos com dados corrompidos continuam editáveis por segurança).
 */
export function isEventInPast(
  event: Pick<EventPost, "eventDate" | "eventTime">,
): boolean {
  if (!event.eventDate || !event.eventTime) return false;
  // Combina as duas strings em um ISO local (YYYY-MM-DDTHH:mm) — o
  // `Date` do JS interpreta sem sufixo como horário local, que é o
  // que o usuário espera ao ver o card.
  const d = parseEventDate(`${event.eventDate}T${event.eventTime}`);
  if (!d) return false;
  return d.getTime() < Date.now();
}
