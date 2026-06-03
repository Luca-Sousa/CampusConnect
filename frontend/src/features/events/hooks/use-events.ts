import { useQuery } from "@tanstack/react-query";
import { fetchPosts } from "@/features/feed/api";
import { feedKeys } from "@/features/feed/query-keys";
import type { EventPost } from "../types";

/**
 * Busca todos os posts e filtra apenas eventos.
 * Usa a mesma chave de cache do feed para que mutations
 * (create/update/delete/rsvp) reflitam imediatamente.
 */
export function useEvents() {
  return useQuery({
    queryKey: feedKeys.posts(),
    queryFn: () => fetchPosts(0, 100),
    select: (data) => data.filter((p): p is EventPost => p.type === "event"),
  });
}
