export const groupKeys = {
  all: ["groups"] as const,
  list: () => [...groupKeys.all, "list"] as const,
  search: (q: string) => [...groupKeys.list(), q] as const,
  messages: (id: string) => [...groupKeys.all, "messages", id] as const,
} as const;
