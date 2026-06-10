import type { Post, ToggleLikeResult, Comment } from "./types";
import { apiClient } from "@/lib/api-client";

export function fetchPosts(offset = 0, limit = 20) {
  return apiClient.get<Post[]>(`/api/posts?limit=${limit}&offset=${offset}`);
}

export function createPost(body: unknown) {
  return apiClient.post<Post>("/api/posts", body);
}

export function deletePost(id: string) {
  return apiClient.delete<void>(`/api/posts/${id}`);
}

export function updatePost(id: string, body: unknown) {
  return apiClient.put<Post>(`/api/posts/${id}`, body);
}

export function toggleRsvp(postId: string) {
  return apiClient.post<{ hasRsvp: boolean }>(`/api/posts/${postId}/rsvp`);
}

export function fetchLikeStatus(postId: string) {
  return apiClient.get<{ likesCount: number; hasLiked: boolean }>(
    `/api/posts/${postId}/like`,
  );
}

export function toggleLike(postId: string) {
  return apiClient.post<ToggleLikeResult>(`/api/posts/${postId}/like`, {});
}

export function approvePost(postId: string) {
  return apiClient.post<Post>(`/api/posts/${postId}/approve`);
}

export function rejectPost(postId: string) {
  return apiClient.post<void>(`/api/posts/${postId}/reject`);
}

export function fetchComments(postId: string) {
  return apiClient.get<Comment[]>(`/api/posts/${postId}/comments`);
}

export function addComment(
  postId: string,
  data: { content: string; parentId?: string },
) {
  return apiClient.post<Comment>(`/api/posts/${postId}/comments`, data);
}
