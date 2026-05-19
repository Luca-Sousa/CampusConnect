import { env } from "@/env";
import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: env.API_URL,
  plugins: [
    inferAdditionalFields({
      user: {
        role: { type: "string", required: true },
        cargo: { type: "string", required: false },
      },
    }),
  ],
});

export const { signIn, signUp, signOut, useSession } = authClient;
