import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationKeys } from "../query-keys";
import { markAllAsRead } from "../api";

export function useMarkAllAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllAsRead,
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: notificationKeys.all,
      });

      const previous = queryClient.getQueriesData({
        queryKey: notificationKeys.all,
      });

      queryClient.setQueriesData(
        { queryKey: notificationKeys.all },
        (old: { notifications?: Array<{ id: string; readAt?: string }>; unreadCount?: number } | undefined) => {
          if (!old?.notifications) return old;
          return {
            ...old,
            notifications: old.notifications.map((n) => ({
              ...n,
              readAt: n.readAt ?? new Date().toISOString(),
            })),
            unreadCount: 0,
          };
        },
      );

      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        for (const [key, data] of context.previous) {
          queryClient.setQueryData(key, data);
        }
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}
