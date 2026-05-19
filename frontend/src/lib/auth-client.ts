import { env } from "@/env";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: env.API_URL,
});

export const { signIn, signUp, signOut, useSession } = authClient;
