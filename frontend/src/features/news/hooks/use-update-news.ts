import { useMutation, useQueryClient } from "@tanstack/react-query";
import { showError } from "@/lib/toast";
import { updatePost } from "@/features/feed/api";
import { feedKeys } from "@/features/feed/query-keys";
import type { Post } from "@/features/feed/types";

interface UpdateNewsVariables {
  id: string;
  body: Record<string, unknown>;
}

export function useUpdateNews() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, body }: UpdateNewsVariables) =>
      updatePost(id, body) as Promise<Post>,

    onMutate: async ({ id, body }) => {
      await queryClient.cancelQueries({ queryKey: feedKeys.posts() });

      const previousPosts = queryClient.getQueryData<Post[]>(
        feedKeys.posts(),
      );

      queryClient.setQueryData<Post[]>(feedKeys.posts(), (old = []) =>
        old.map((p) => (p.id === id ? ({ ...p, ...body } as Post) : p)),
      );

      return { previousPosts };
    },

    onError: (error: Error, _variables, context) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(feedKeys.posts(), context.previousPosts);
      }
      showError(error.message || "Erro ao atualizar comunicado.");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: feedKeys.posts() });
    },
  });
}
