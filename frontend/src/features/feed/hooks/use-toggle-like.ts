import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { feedKeys } from "../query-keys";
import { toggleLike, fetchLikeStatus } from "../api";

export function useLikeStatus(postId: string) {
  return useQuery({
    queryKey: feedKeys.postLike(postId),
    queryFn: () => fetchLikeStatus(postId),
  });
}

export function useToggleLike(postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => toggleLike(postId),
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: feedKeys.postLike(postId),
      });

      const previous = queryClient.getQueryData(feedKeys.postLike(postId));

      queryClient.setQueryData(
        feedKeys.postLike(postId),
        (old: { hasLiked: boolean; likesCount: number } | undefined) => {
          if (!old) return old;
          return {
            likesCount: old.hasLiked
              ? old.likesCount - 1
              : old.likesCount + 1,
            hasLiked: !old.hasLiked,
          };
        },
      );

      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          feedKeys.postLike(postId),
          context.previous,
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: feedKeys.postLike(postId),
      });
      queryClient.invalidateQueries({
        queryKey: feedKeys.posts(),
      });
    },
  });
}
