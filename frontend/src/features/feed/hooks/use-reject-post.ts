import { useMutation, useQueryClient } from "@tanstack/react-query";
import { showSuccess, showError } from "@/lib/toast";
import { rejectPost } from "../api";
import { feedKeys } from "../query-keys";
import type { Post } from "../types";

/**
 * Rejeita uma publicação retida pela moderação (deleta o post).
 * Usa optimistic update para remover do feed imediatamente.
 */
export function useRejectPost(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: rejectPost,
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: feedKeys.posts() });

      const previous = queryClient.getQueriesData<{ queryKey: unknown[]; data: Post[] }>({
        queryKey: feedKeys.posts(),
      });

      queryClient.setQueriesData<Post[]>({ queryKey: feedKeys.posts() }, (old) => {
        if (!old) return old;
        return old.filter((post) => post.id !== postId);
      });

      return { previous };
    },
    onError: () => {
      showError("Erro ao rejeitar publicação.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: feedKeys.all });
    },
    onSuccess: () => {
      showSuccess("Publicação rejeitada.");
      options?.onSuccess?.();
    },
  });
}
