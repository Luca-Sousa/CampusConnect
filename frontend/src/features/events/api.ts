import { env } from "@/env";
import type { EventPost } from "./types";

export async function fetchEvents(): Promise<EventPost[]> {
  const res = await fetch(
    `${env.API_URL}/api/posts?type=event&limit=50`,
    { credentials: "include" },
  );
  if (!res.ok) throw new Error("Erro ao carregar eventos.");
  return res.json();
}
