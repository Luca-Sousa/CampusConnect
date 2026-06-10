import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDaysIcon,
  NewspaperIcon,
  UsersIcon,
  UserPlusIcon,
  ArrowRightIcon,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useEvents } from "@/features/events/hooks/use-events";
import { useNews } from "@/features/news/hooks/use-news";
import { useGroups } from "@/features/groups/hooks/use-groups";
import { getInitials } from "@/lib/utils";

const MAX_ITEMS = 4;
const NEW_THRESHOLD_DAYS = 3;

// ---- Helpers ---------------------------------------------------------------

function isRecent(dateStr: string, days = NEW_THRESHOLD_DAYS): boolean {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return diffDays >= 0 && diffDays <= days;
}

// ---- Skeleton -------------------------------------------------------------

function SectionSkeleton({ count = 3 }: { count?: number }) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        <Skeleton className="h-3.5 w-20" />
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {Array.from({ length: count }).map((_, i) => (
            <SidebarMenuItem key={i}>
              <SidebarMenuButton className="h-auto py-1.5 gap-3" disabled>
                <Skeleton className="h-7 w-7 rounded-full shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3.5 w-3/4" />
                  <Skeleton className="h-2.5 w-1/2" />
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

// ---- Sub-components -------------------------------------------------------

interface SidebarItemProps {
  name: string;
  subtitle?: string;
  initials: string;
  color: string;
  isNew?: boolean;
  emoji?: string | null;
  onClick?: () => void;
}

function SidebarItem({
  name,
  subtitle,
  initials,
  color,
  isNew,
  emoji,
  onClick,
}: SidebarItemProps) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton className="h-auto py-1.5 gap-3" onClick={onClick}>
        <div className="relative shrink-0">
          {emoji ? (
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-sm">
              {emoji}
            </div>
          ) : (
            <Avatar className="h-7 w-7">
              <AvatarFallback className={`text-xs font-semibold ${color}`}>
                {initials}
              </AvatarFallback>
            </Avatar>
          )}
          {isNew && (
            <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-emerald-500 border-2 border-sidebar" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-medium truncate w-48">{name}</h2>
          {subtitle && (
            <span className="text-[10px] text-muted-foreground truncate block">
              {subtitle}
            </span>
          )}
        </div>
        {isNew && (
          <Badge
            variant="secondary"
            className="text-[9px] px-1.5 py-0 h-4 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0 shrink-0"
          >
            Novo
          </Badge>
        )}
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

interface SectionProps {
  title: string;
  icon: React.ReactNode;
  items: SidebarItemProps[];
  onNavigate: () => void;
  navigateLabel: string;
}

function SidebarSection({
  title,
  icon,
  items,
  onNavigate,
  navigateLabel,
}: SectionProps) {
  if (items.length === 0) return null;

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="gap-1.5">
        {icon}
        {title}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item, i) => (
            <SidebarItem key={i} {...item} />
          ))}
          <SidebarMenuItem>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-between text-xs text-muted-foreground hover:text-foreground"
              onClick={onNavigate}
            >
              {navigateLabel}
              <ArrowRightIcon className="h-3 w-3" />
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

// ---- Main component -------------------------------------------------------

const SidebarRight = () => {
  const navigate = useNavigate();
  const { data: events = [], isLoading: eventsLoading } = useEvents();
  const { data: news = [], isLoading: newsLoading } = useNews();
  const { data: groups = [], isLoading: groupsLoading } = useGroups();

  const recentEvents = events.slice(0, MAX_ITEMS).map((e) => ({
    name: e.eventTitle,
    subtitle: e.eventLocation,
    initials: getInitials(e.eventTitle),
    color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
    isNew: isRecent(e.createdAt),
    onClick: () => navigate(`/post/${e.id}`),
  }));

  const recentNews = news.slice(0, MAX_ITEMS).map((n) => ({
    name: n.newsTitle,
    subtitle: n.author?.name ?? "Oficial",
    initials: getInitials(n.newsTitle),
    color: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
    isNew: isRecent(n.createdAt),
    onClick: () => navigate(`/post/${n.id}`),
  }));

  const myGroups = groups
    .filter((g) => g.isMember)
    .slice(0, MAX_ITEMS)
    .map((g) => ({
      name: g.name,
      subtitle: `${g.memberCount} ${g.memberCount === 1 ? "membro" : "membros"}`,
      initials: getInitials(g.name),
      color: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400",
      emoji: g.icon,
      isNew: isRecent(g.createdAt),
      onClick: () => navigate(`/groups?chat=${g.id}`),
    }));

  const suggestedGroups = groups
    .filter((g) => !g.isMember)
    .slice(0, MAX_ITEMS)
    .map((g) => ({
      name: g.name,
      subtitle: `${g.memberCount} ${g.memberCount === 1 ? "membro" : "membros"}`,
      initials: getInitials(g.name),
      color: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400",
      emoji: g.icon,
      isNew: isRecent(g.createdAt),
      onClick: () => navigate("/groups"),
    }));

  const anyLoading = eventsLoading || newsLoading || groupsLoading;

  return (
    <Sidebar
      collapsible="none"
      side="right"
      className="border-l"
      style={{ "--sidebar-width": "19.5rem" } as React.CSSProperties}
    >
      <SidebarContent>
        <ScrollArea className="h-full">
          {anyLoading ? (
            <>
              <SectionSkeleton count={3} />
              <SectionSkeleton count={3} />
              <SectionSkeleton count={2} />
            </>
          ) : (
            <>
              <SidebarSection
                title="Eventos"
                icon={<CalendarDaysIcon className="h-3.5 w-3.5" />}
                items={recentEvents}
                onNavigate={() => navigate("/events")}
                navigateLabel="Ver todos os eventos"
              />

              <SidebarSection
                title="Notícias"
                icon={<NewspaperIcon className="h-3.5 w-3.5" />}
                items={recentNews}
                onNavigate={() => navigate("/news")}
                navigateLabel="Ver todas as notícias"
              />

              <SidebarSection
                title="Meus Grupos"
                icon={<UsersIcon className="h-3.5 w-3.5" />}
                items={myGroups}
                onNavigate={() => navigate("/groups")}
                navigateLabel="Ver todos os grupos"
              />

              <SidebarSection
                title="Sugeridos"
                icon={<UserPlusIcon className="h-3.5 w-3.5" />}
                items={suggestedGroups}
                onNavigate={() => navigate("/groups")}
                navigateLabel="Ver todos os grupos"
              />
            </>
          )}
        </ScrollArea>
      </SidebarContent>
    </Sidebar>
  );
};

export default SidebarRight;
