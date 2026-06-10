import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BellIcon, CheckCheckIcon, InboxIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/page-header";
import { useNotifications } from "@/features/notifications/hooks/use-notifications";
import { useUnreadCount } from "@/features/notifications/hooks/use-unread-count";
import { useMarkAsRead } from "@/features/notifications/hooks/use-mark-as-read";
import { useMarkAllAsRead } from "@/features/notifications/hooks/use-mark-all-as-read";
import { formatRelativeTime } from "@/features/feed/utils/format";
import { getInitials } from "@/lib/utils";
import type { Notification } from "@/features/notifications/types";
import { TYPE_ICONS, getEntityPath } from "@/features/notifications/utils";

function NotificationSkeleton() {
  return (
    <div className="flex items-start gap-3 px-4 py-3">
      <Skeleton className="h-10 w-10 rounded-full shrink-0" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  );
}

export default function NotificationsPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"all" | "unread">("all");

  const { data: unreadData } = useUnreadCount();
  const {
    data: notificationsData,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useNotifications(tab === "unread");

  const markAsRead = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();

  const notifications =
    notificationsData?.pages.flatMap((p) => p.notifications) ?? [];
  const total = notificationsData?.pages[0]?.total ?? 0;
  const unreadCount = unreadData?.count ?? 0;

  function handleClick(notification: Notification) {
    if (!notification.readAt) {
      markAsRead.mutate(notification.id);
    }
    navigate(getEntityPath(notification));
  }

  return (
    <div className="min-h-screen">
      <PageHeader
        icon={BellIcon}
        iconClassName="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
        title="Notificações"
        subtitle={`${unreadCount} não lida${unreadCount !== 1 ? "s" : ""}`}
        action={
          unreadCount > 0 ? (
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => markAllAsRead.mutate()}
              disabled={markAllAsRead.isPending}
            >
              <CheckCheckIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Marcar todas como lidas</span>
            </Button>
          ) : undefined
        }
      />

      <div className="max-w-2xl mx-auto px-4 py-6">
        <Tabs value={tab} onValueChange={(v) => setTab(v as "all" | "unread")}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">
              Todas
              {total > 0 && (
                <span className="ml-1.5 text-xs text-muted-foreground">
                  ({total})
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="unread">
              Não lidas
              {unreadCount > 0 && (
                <span className="ml-1.5 text-xs text-muted-foreground">
                  ({unreadCount})
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value={tab} className="mt-0">
            <div className="border rounded-xl bg-card overflow-hidden">
              {isLoading ? (
                <div className="divide-y">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <NotificationSkeleton key={i} />
                  ))}
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="flex size-14 items-center justify-center rounded-full bg-muted mb-3">
                    <InboxIcon className="h-7 w-7 text-muted-foreground/50" />
                  </div>
                  <h3 className="text-base font-semibold mb-1">
                    {tab === "unread"
                      ? "Nenhuma notificação não lida"
                      : "Nenhuma notificação"}
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-xs">
                    {tab === "unread"
                      ? "Todas as suas notificações foram lidas."
                      : "Quando alguém interagir com suas publicações, você será notificado aqui."}
                  </p>
                </div>
              ) : (
                <>
                  <div className="divide-y">
                    {notifications.map((notification) => {
                      const isUnread = !notification.readAt;
                      return (
                        <button
                          key={notification.id}
                          onClick={() => handleClick(notification)}
                          className={`flex items-start gap-3 w-full px-4 py-3.5 text-left hover:bg-accent/50 transition-colors ${
                            isUnread
                              ? "bg-blue-50/50 dark:bg-blue-950/20"
                              : ""
                          }`}
                        >
                          <div className="relative shrink-0">
                            <Avatar className="h-10 w-10">
                              <AvatarImage
                                src={notification.actor?.image ?? undefined}
                              />
                              <AvatarFallback className="bg-muted text-xs">
                                {getInitials(notification.actor?.name ?? "U")}
                              </AvatarFallback>
                            </Avatar>
                            <span className="absolute -bottom-0.5 -right-0.5 text-xs">
                              {TYPE_ICONS[notification.type]}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm leading-snug">
                              {notification.message}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
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

                  {hasNextPage && (
                    <div className="px-4 py-3 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => fetchNextPage()}
                        disabled={isFetchingNextPage}
                      >
                        {isFetchingNextPage
                          ? "Carregando..."
                          : "Carregar mais"}
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
