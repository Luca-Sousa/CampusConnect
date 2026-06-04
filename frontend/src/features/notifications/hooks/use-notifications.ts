import { useInfiniteQuery } from "@tanstack/react-query";
import { notificationKeys } from "../query-keys";
import { fetchNotifications } from "../api";

const PAGE_SIZE = 20;

export function useNotifications(unreadOnly = false) {
  return useInfiniteQuery({
    queryKey: notificationKeys.list(unreadOnly),
    queryFn: ({ pageParam = 0 }) =>
      fetchNotifications(PAGE_SIZE, pageParam, unreadOnly),
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.reduce((acc, p) => acc + p.notifications.length, 0);
      return loaded < lastPage.total ? loaded : undefined;
    },
    initialPageParam: 0,
  });
}
