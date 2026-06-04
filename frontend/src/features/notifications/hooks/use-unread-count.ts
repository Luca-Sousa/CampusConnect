import { useQuery } from "@tanstack/react-query";
import { notificationKeys } from "../query-keys";
import { fetchUnreadCount } from "../api";

export function useUnreadCount() {
  return useQuery({
    queryKey: notificationKeys.unreadCount(),
    queryFn: fetchUnreadCount,
    refetchInterval: 30_000,
    refetchOnWindowFocus: true,
  });
}
