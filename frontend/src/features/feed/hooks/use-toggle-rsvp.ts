import { useMutation, useQueryClient } from "@tanstack/react-query";
import { showError } from "@/lib/toast";
import { toggleRsvp } from "../api";
import { feedKeys } from "../query-keys";
import type { Post } from "../types";

/**
 * Alterna o RSVP de um evento com atualização otimista.
 *
 * Fluxo:
 *  1. Cancela refetches em andamento para evitar race conditions.
 *  2. Atualiza o cache localmente (sem esperar a resposta do servidor).
 *  3. Em caso de erro, faz rollback para o estado anterior.
 *  4. Em qualquer desfecho, sincroniza com o servidor via invalidação.
 */
export function useToggleRsvp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => toggleRsvp(postId),

    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: feedKeys.posts() });

      const previousPosts = queryClient.getQueryData<Post[]>(feedKeys.posts());

      queryClient.setQueryData<Post[]>(feedKeys.posts(), (old = []) =>
        old.map((p) =>
          p.id === postId && p.type === "event"
            ? {
                ...p,
                hasRsvp: !p.hasRsvp,
                rsvpCount: p.rsvpCount + (p.hasRsvp ? -1 : 1),
              }
            : p,
        ),
      );

      return { previousPosts };
    },

    onError: (_, __, context) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(feedKeys.posts(), context.previousPosts);
      }
      showError("Erro ao confirmar presença.");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: feedKeys.posts() });
    },
  });
}
