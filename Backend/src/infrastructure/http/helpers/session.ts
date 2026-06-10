import { auth } from "../../auth/better-auth.js";

type SessionResult = Awaited<ReturnType<typeof auth.api.getSession>> | null;

export async function getSession(request: { headers: { cookie?: string } }): Promise<SessionResult> {
  const headers = new Headers();
  if (request.headers.cookie) headers.set("cookie", request.headers.cookie);
  return auth.api.getSession({ headers }).catch(() => null);
}
