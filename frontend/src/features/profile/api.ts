import type { ProfileUser, UpdateProfileInput } from "./types";
import { apiClient } from "@/lib/api-client";

export async function updateProfile(data: UpdateProfileInput) {
  const { user } = await apiClient.patch<{ user: ProfileUser }>(
    "/api/users/me",
    data,
  );
  return user;
}
