import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { feedKeys } from "../query-keys";
import { fetchComments, addComment } from "../api";

export function useComments(postId: string) {
  return useQuery({
    queryKey: feedKeys.postComments(postId),
    queryFn: () => fetchComments(postId),
  });
}

export function useAddComment(postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { content: string; parentId?: string }) =>
      addComment(postId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: feedKeys.postComments(postId),
      });
      queryClient.invalidateQueries({
        queryKey: feedKeys.posts(),
      });
    },
  });
}
