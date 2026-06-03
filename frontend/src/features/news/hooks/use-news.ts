import { useQuery } from "@tanstack/react-query";
import { fetchPosts } from "@/features/feed/api";
import { feedKeys } from "@/features/feed/query-keys";
import type { NewsPost } from "../types";

/**
 * Busca todos os posts e filtra apenas comunicados/notícias.
 * Usa a mesma chave de cache do feed para que mutations
 * reflitam imediatamente na lista.
 */
export function useNews() {
  return useQuery({
    queryKey: feedKeys.posts(),
    queryFn: () => fetchPosts(0, 100),
    select: (data) => data.filter((p): p is NewsPost => p.type === "news"),
  });
}
