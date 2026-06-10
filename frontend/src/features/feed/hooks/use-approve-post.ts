import { useMutation, useQueryClient } from "@tanstack/react-query";
import { showSuccess, showError } from "@/lib/toast";
import { approvePost } from "../api";
import { feedKeys } from "../query-keys";
import type { Post } from "../types";

/**
 * Aprova uma publicação retida pela moderação.
 * Usa optimistic update para marcar como não moderada imediatamente.
 */
export function useApprovePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: approvePost,
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: feedKeys.posts() });

      const previous = queryClient.getQueriesData<{ queryKey: unknown[]; data: Post[] }>({
        queryKey: feedKeys.posts(),
      });

      queryClient.setQueriesData<Post[]>({ queryKey: feedKeys.posts() }, (old) => {
        if (!old) return old;
        return old.map((post) =>
          post.id === postId
            ? { ...post, moderated: false, moderationReasons: [] }
            : post,
        );
      });

      return { previous };
    },
    onError: () => {
      showError("Erro ao aprovar publicação.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: feedKeys.posts() });
    },
    onSuccess: () => {
      showSuccess("Publicação aprovada com sucesso!");
    },
  });
}
