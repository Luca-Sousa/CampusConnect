import { useMutation, useQueryClient } from "@tanstack/react-query";
import { showError } from "@/lib/toast";
import { deletePost } from "../api";
import { feedKeys } from "../query-keys";
import type { Post } from "../types";

/**
 * Remove um post do servidor e o exclui do cache imediatamente.
 */
export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deletePost(id),
    onSuccess: (_, id) => {
      queryClient.setQueryData<Post[]>(feedKeys.posts(), (old = []) =>
        old.filter((p) => p.id !== id),
      );
    },
    onError: () => {
      showError("Erro ao remover publicação.");
    },
  });
}
