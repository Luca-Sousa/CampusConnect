import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

/**
 * Extrai as iniciais de um nome (máximo 2 letras).
 */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

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
 * Formata uma data de evento (YYYY-MM-DD) para o padrão longo em pt-BR.
 *
 * @example
 * formatEventDate("2024-06-03") // "segunda-feira, 3 de junho"
 */
export function formatEventDate(date: string): string {
  return format(new Date(`${date}T00:00:00`), "EEEE',' d 'de' MMMM", {
    locale: ptBR,
  });
}
