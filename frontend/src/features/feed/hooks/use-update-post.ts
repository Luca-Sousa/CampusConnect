import { useMutation, useQueryClient } from "@tanstack/react-query";
import { showError } from "@/lib/toast";
import { updatePost } from "../api";
import { feedKeys } from "../query-keys";
import type { Post } from "../types";

interface UpdatePostVariables {
  id: string;
  body: Record<string, unknown>;
}

/**
 * Atualiza uma publicação existente com **atualização otimista**.
 *
 * Fluxo:
 *  1. Cancela refetches em andamento para evitar race conditions.
 *  2. Substitui o post no cache local com um merge dos campos enviados
 *     (campos não enviados são preservados, incluindo metadados imutáveis
 *     como `author`, `createdAt`, `rsvpCount` e `hasRsvp`).
 *  3. Em caso de erro, faz rollback para o estado anterior.
 *  4. Em qualquer desfecho, sincroniza com o servidor via invalidação.
 */
export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, body }: UpdatePostVariables) => updatePost(id, body),

    onMutate: async ({ id, body }) => {
      await queryClient.cancelQueries({ queryKey: feedKeys.posts() });

      const previousPosts = queryClient.getQueryData<Post[]>(feedKeys.posts());

      queryClient.setQueryData<Post[]>(feedKeys.posts(), (old = []) =>
        old.map((p) => (p.id === id ? ({ ...p, ...body } as Post) : p)),
      );

      return { previousPosts };
    },

    onError: (error: Error, _variables, context) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(feedKeys.posts(), context.previousPosts);
      }
      showError(error.message || "Erro ao atualizar publicação.");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: feedKeys.posts() });
    },
  });
}
