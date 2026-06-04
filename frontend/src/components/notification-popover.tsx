import { useNavigate } from "react-router-dom";
import { BellIcon, CheckCheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useNotifications } from "@/features/notifications/hooks/use-notifications";
import { useUnreadCount } from "@/features/notifications/hooks/use-unread-count";
import { useMarkAsRead } from "@/features/notifications/hooks/use-mark-as-read";
import { useMarkAllAsRead } from "@/features/notifications/hooks/use-mark-all-as-read";
import { formatRelativeTime } from "@/features/feed/utils/format";
import { getInitials } from "@/lib/utils";
import type { Notification, NotificationType } from "@/features/notifications/types";

const TYPE_ICONS: Record<NotificationType, string> = {
  like: "❤️",
  comment: "💬",
  post_created: "📢",
  group_created: "👥",
  group_message: "✉️",
};

function getEntityPath(notification: Notification): string {
  switch (notification.entityType) {
    case "post":
      return `/post/${notification.entityId}`;
    case "group":
      return `/groups?chat=${notification.entityId}`;
    case "group_message":
      return `/groups?chat=${notification.entityId}`;
    default:
      return "/feed";
  }
}

export function NotificationPopover() {
  const navigate = useNavigate();
  const { data: unreadData } = useUnreadCount();
  const { data: notificationsData } = useNotifications(false);
  const markAsRead = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();

  const unreadCount = unreadData?.count ?? 0;
  const notifications =
    notificationsData?.pages.flatMap((p) => p.notifications) ?? [];
  const recentNotifications = notifications.slice(0, 10);

  function handleClick(notification: Notification) {
    if (!notification.readAt) {
      markAsRead.mutate(notification.id);
    }
    navigate(getEntityPath(notification));
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="secondary" size="icon" className="relative">
          <BellIcon className="size-5 text-muted-foreground" />
          {unreadCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 h-5 min-w-5 px-1 text-[10px] font-bold rounded-full bg-red-500 text-white border-2 border-sidebar"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end" sideOffset={8}>
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h3 className="font-semibold text-sm">Notificações</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs gap-1"
              onClick={() => markAllAsRead.mutate()}
              disabled={markAllAsRead.isPending}
            >
              <CheckCheckIcon className="h-3.5 w-3.5" />
              Marcar todas
            </Button>
          )}
        </div>

        <ScrollArea className="h-80">
          {recentNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <BellIcon className="h-8 w-8 text-muted-foreground/50 mb-2" />
              <p className="text-sm text-muted-foreground">
                Nenhuma notificação ainda.
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {recentNotifications.map((notification) => {
                const isUnread = !notification.readAt;
                return (
                  <button
                    key={notification.id}
                    onClick={() => handleClick(notification)}
                    className={`flex items-start gap-3 w-full px-4 py-3 text-left hover:bg-accent/50 transition-colors ${
                      isUnread ? "bg-blue-50/50 dark:bg-blue-950/20" : ""
                    }`}
                  >
                    <div className="relative shrink-0">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={notification.actor?.image ?? undefined} />
                        <AvatarFallback className="bg-muted text-xs">
                          {getInitials(notification.actor?.name ?? "U")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="absolute -bottom-0.5 -right-0.5 text-xs">
                        {TYPE_ICONS[notification.type]}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm leading-snug">{notification.message}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {formatRelativeTime(notification.createdAt)}
                      </p>
                    </div>
                    {isUnread && (
                      <div className="h-2.5 w-2.5 rounded-full bg-blue-500 shrink-0 mt-1.5" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </ScrollArea>

        <div className="border-t px-4 py-2.5">
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-sm"
            onClick={() => navigate("/notifications")}
          >
            Ver todas as notificações
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
