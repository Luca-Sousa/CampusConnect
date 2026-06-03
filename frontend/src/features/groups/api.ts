import type { Group, GroupMessage } from "./types";

const API = import.meta.env.VITE_API_URL as string;

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    credentials: "include",
    ...init,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(
      (body as { error?: string }).error ?? `Erro ${res.status}`,
    );
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

export async function fetchGroups(
  offset = 0,
  limit = 20,
  search?: string,
): Promise<Group[]> {
  const params = new URLSearchParams({ offset: String(offset), limit: String(limit) });
  if (search) params.set("search", search);
  return request(`/api/groups?${params.toString()}`);
}

export async function createGroup(body: {
  name: string;
  description?: string;
  icon?: string | null;
}): Promise<Group> {
  return request("/api/groups", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export async function updateGroup(
  id: string,
  body: { name?: string; description?: string | null; icon?: string | null },
): Promise<Group> {
  return request(`/api/groups/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export async function deleteGroup(id: string): Promise<void> {
  return request(`/api/groups/${id}`, { method: "DELETE" });
}

export async function toggleJoinGroup(
  id: string,
): Promise<{ isMember: boolean }> {
  return request(`/api/groups/${id}/join`, { method: "POST" });
}

export async function fetchGroupMessages(
  groupId: string,
  offset = 0,
  limit = 50,
): Promise<GroupMessage[]> {
  const params = new URLSearchParams({ offset: String(offset), limit: String(limit) });
  return request(`/api/groups/${groupId}/messages?${params.toString()}`);
}

export async function sendGroupMessage(
  groupId: string,
  content: string,
): Promise<GroupMessage> {
  return request(`/api/groups/${groupId}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });
}

export async function deleteGroupMessage(messageId: string): Promise<void> {
  return request(`/api/messages/${messageId}`, { method: "DELETE" });
}
