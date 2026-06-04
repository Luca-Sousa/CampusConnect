export const notificationKeys = {
  all: ["notifications"] as const,
  list: (unreadOnly: boolean) =>
    [...notificationKeys.all, "list", { unreadOnly }] as const,
  unreadCount: () => [...notificationKeys.all, "unreadCount"] as const,
} as const;
