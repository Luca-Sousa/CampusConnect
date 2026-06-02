import { env } from "@/env";
import type { Post } from "./types";

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
