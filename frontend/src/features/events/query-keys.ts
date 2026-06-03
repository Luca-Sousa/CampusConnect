export const eventKeys = {
  all: ["events"] as const,
  events: () => [...eventKeys.all, "list"] as const,
} as const;
