import { useQuery } from "@tanstack/react-query";
import { fetchPosts } from "../api";
import { feedKeys } from "../query-keys";

/**
 * Busca a lista de posts do feed.
 * O cache é mantido por 2 min (staleTime) e 10 min em background (gcTime).
 */
export function usePosts() {
  return useQuery({
    queryKey: feedKeys.posts(),
    queryFn: () => fetchPosts(),
  });
}
