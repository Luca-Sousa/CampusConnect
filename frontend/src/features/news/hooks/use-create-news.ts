import { useMutation, useQueryClient } from "@tanstack/react-query";
import { showError } from "@/lib/toast";
import { createPost } from "@/features/feed/api";
import { feedKeys } from "@/features/feed/query-keys";
import type { Post } from "@/features/feed/types";

export function useCreateNews() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: Record<string, unknown>) =>
      createPost(body) as Promise<Post>,
    onSuccess: (newPost) => {
      queryClient.setQueryData<Post[]>(feedKeys.posts(), (old = []) => [
        newPost,
        ...old,
      ]);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: feedKeys.all });
    },
    onError: (error: Error) => {
      showError(error.message || "Erro ao publicar comunicado.");
    },
  });
}
