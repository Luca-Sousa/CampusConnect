import { useMutation, useQueryClient } from "@tanstack/react-query";
import { showError } from "@/lib/toast";
import { createPost } from "../api";
import { feedKeys } from "../query-keys";
import type { Post } from "../types";

/**
 * Cria um novo post e insere-o no início do cache,
 * evitando um refetch completo.
 */
export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPost,
    onSuccess: (newPost) => {
      queryClient.setQueryData<Post[]>(feedKeys.posts(), (old = []) => [
        newPost,
        ...old,
      ]);
    },
    onError: (error: Error) => {
      showError(error.message || "Erro ao publicar.");
    },
  });
}
