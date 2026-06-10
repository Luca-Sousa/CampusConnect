import type { NotificationResponse, UnreadCountResponse } from "./types";
import { apiClient } from "@/lib/api-client";

export function fetchNotifications(
  limit: number,
  offset: number,
  unreadOnly: boolean,
) {
  const params = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
    unreadOnly: String(unreadOnly),
  });
  return apiClient.get<NotificationResponse>(
    `/api/notifications/in-app?${params}`,
  );
}

export function fetchUnreadCount() {
  return apiClient.get<UnreadCountResponse>(
    "/api/notifications/in-app/unread-count",
  );
}

export function markAsRead(id: string) {
  return apiClient.patch<void>(`/api/notifications/in-app/${id}/read`);
}

export function markAllAsRead() {
  return apiClient.patch<void>("/api/notifications/in-app/read-all");
}
