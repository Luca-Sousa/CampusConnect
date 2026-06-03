import { useMutation, useQueryClient } from "@tanstack/react-query";
import { showError } from "@/lib/toast";
import { toggleRsvp } from "@/features/feed/api";
import { feedKeys } from "@/features/feed/query-keys";
import type { Post } from "@/features/feed/types";

export function useToggleRsvp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => toggleRsvp(postId),

    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: feedKeys.posts() });

      const previousPosts = queryClient.getQueryData<Post[]>(
        feedKeys.posts(),
      );

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
