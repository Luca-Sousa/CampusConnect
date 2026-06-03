import { useMutation, useQueryClient } from "@tanstack/react-query";
import { showError } from "@/lib/toast";
import { deletePost } from "@/features/feed/api";
import { feedKeys } from "@/features/feed/query-keys";
import type { Post } from "@/features/feed/types";

export function useDeleteNews() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deletePost(id),
    onSuccess: (_, id) => {
      queryClient.setQueryData<Post[]>(feedKeys.posts(), (old = []) =>
        old.filter((p) => p.id !== id),
      );
    },
    onError: () => {
      showError("Erro ao remover comunicado.");
    },
  });
}
