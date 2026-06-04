import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationKeys } from "../query-keys";
import { markAsRead } from "../api";

export function useMarkAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAsRead,
    onMutate: async (id) => {
      await queryClient.cancelQueries({
        queryKey: notificationKeys.all,
      });

      const previous = queryClient.getQueriesData({
        queryKey: notificationKeys.all,
      });

      queryClient.setQueriesData(
        { queryKey: notificationKeys.all },
        (old: Awaited<ReturnType<typeof import("../api").fetchNotifications>> | undefined) => {
          if (!old) return old;
          return {
            ...old,
            notifications: old.notifications.map((n) =>
              n.id === id ? { ...n, readAt: new Date().toISOString() } : n,
            ),
            unreadCount: Math.max(0, old.unreadCount - 1),
          };
        },
      );

      return { previous };
    },
    onError: (_err, _id, context) => {
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
