import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost } from "../api";
import { feedKeys } from "../query-keys";
import type { Post } from "../types";

/**
 * Cria um novo post e insere-o no início do cache,
 * evitando um refetch completo.
 *
 * NOTA: O tratamento de erro é feito nos formulários (catch).
 * O `onSuccess` aqui só atualiza o cache — os toasts são
 * controlados pelos components que chamam `mutateAsync`.
 */
export function useCreatePost() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createPost,
    onSuccess: (newPost) => {
      queryClient.setQueryData<Post[]>(feedKeys.posts(), (old = []) => [
        newPost,
        ...old,
      ]);
    },
  });

  return {
    mutateAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
  };
}
