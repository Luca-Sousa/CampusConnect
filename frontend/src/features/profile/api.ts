import { env } from "@/env";
import type { ProfileUser, UpdateProfileInput } from "./types";

export async function updateProfile(data: UpdateProfileInput): Promise<ProfileUser> {
  const res = await fetch(`${env.API_URL}/api/users/me`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message ?? body?.error ?? "Erro ao atualizar perfil.");
  }

  const { user } = (await res.json()) as { user: ProfileUser };
  return user;
}
