import { env } from "@/env";
import type { Post, ToggleLikeResult, Comment } from "./types";

export async function fetchPosts(offset = 0, limit = 20): Promise<Post[]> {
  const res = await fetch(
    `${env.API_URL}/api/posts?limit=${limit}&offset=${offset}`,
    { credentials: "include" },
  );
  if (!res.ok) throw new Error("Erro ao carregar publicações.");
  return res.json();
}

export async function createPost(body: unknown): Promise<Post> {
  const res = await fetch(`${env.API_URL}/api/posts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(
      (data as { message?: string; error?: string }).message ??
        (data as { error?: string }).error ??
        "Erro ao publicar.",
    );
  }
  return res.json();
}

export async function deletePost(id: string): Promise<void> {
  const res = await fetch(`${env.API_URL}/api/posts/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Erro ao remover publicação.");
}

export async function updatePost(id: string, body: unknown): Promise<Post> {
  const res = await fetch(`${env.API_URL}/api/posts/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(
      (data as { message?: string; error?: string }).message ??
        (data as { error?: string }).error ??
        "Erro ao atualizar publicação.",
    );
  }
  return res.json();
}

export async function toggleRsvp(
  postId: string,
): Promise<{ hasRsvp: boolean }> {
  const res = await fetch(`${env.API_URL}/api/posts/${postId}/rsvp`, {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Erro ao confirmar presença.");
  return res.json();
}

// ——— Likes ———

export async function fetchLikeStatus(
  postId: string,
): Promise<{ likesCount: number; hasLiked: boolean }> {
  const res = await fetch(`${env.API_URL}/api/posts/${postId}/like`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Erro ao verificar curtida.");
  return res.json();
}

export async function toggleLike(postId: string): Promise<ToggleLikeResult> {
  const res = await fetch(`${env.API_URL}/api/posts/${postId}/like`, {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Erro ao curtir publicação.");
  return res.json();
}

// ——— Comments ———

export async function fetchComments(postId: string): Promise<Comment[]> {
  const res = await fetch(`${env.API_URL}/api/posts/${postId}/comments`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Erro ao carregar comentários.");
  return res.json();
}

export async function addComment(
  postId: string,
  data: { content: string; parentId?: string },
): Promise<Comment> {
  const res = await fetch(`${env.API_URL}/api/posts/${postId}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      (err as { error?: string }).error ?? "Erro ao comentar.",
    );
  }
  return res.json();
}
