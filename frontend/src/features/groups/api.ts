import type { Group, GroupMessage } from "./types";
import { apiClient } from "@/lib/api-client";

export function fetchGroups(offset = 0, limit = 20, search?: string) {
  const params = new URLSearchParams({ offset: String(offset), limit: String(limit) });
  if (search) params.set("search", search);
  return apiClient.get<Group[]>(`/api/groups?${params.toString()}`);
}

export function createGroup(body: {
  name: string;
  description?: string;
  icon?: string | null;
}) {
  return apiClient.post<Group>("/api/groups", body);
}

export function updateGroup(
  id: string,
  body: { name?: string; description?: string | null; icon?: string | null },
) {
  return apiClient.put<Group>(`/api/groups/${id}`, body);
}

export function deleteGroup(id: string) {
  return apiClient.delete<void>(`/api/groups/${id}`);
}

export function toggleJoinGroup(id: string) {
  return apiClient.post<{ isMember: boolean }>(`/api/groups/${id}/join`);
}

export function fetchGroupMessages(groupId: string, offset = 0, limit = 50) {
  const params = new URLSearchParams({ offset: String(offset), limit: String(limit) });
  return apiClient.get<GroupMessage[]>(
    `/api/groups/${groupId}/messages?${params.toString()}`,
  );
}

export function sendGroupMessage(groupId: string, content: string) {
  return apiClient.post<GroupMessage>(`/api/groups/${groupId}/messages`, {
    content,
  });
}

export function deleteGroupMessage(messageId: string) {
  return apiClient.delete<void>(`/api/messages/${messageId}`);
}
