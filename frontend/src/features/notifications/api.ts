import { env } from "@/env";

const API_URL = env.API_URL;

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { credentials: "include", ...init });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(
      (body as { error?: string }).error ?? `Erro ${res.status}`,
    );
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

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
  return fetchJson<import("./types").NotificationResponse>(
    `${API_URL}/api/notifications/in-app?${params}`,
  );
}

export function fetchUnreadCount() {
  return fetchJson<import("./types").UnreadCountResponse>(
    `${API_URL}/api/notifications/in-app/unread-count`,
  );
}

export function markAsRead(id: string) {
  return fetchJson<void>(`${API_URL}/api/notifications/in-app/${id}/read`, {
    method: "PATCH",
  });
}

export function markAllAsRead() {
  return fetchJson<void>(`${API_URL}/api/notifications/in-app/read-all`, {
    method: "PATCH",
  });
}
