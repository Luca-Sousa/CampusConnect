import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDaysIcon,
  NewspaperIcon,
  UsersIcon,
  ArrowRightIcon,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { mockGroups } from "@/features/groups/data";
import { getInitials } from "@/features/feed/utils/format";

const MAX_ITEMS = 4;

// ---- Sub-components -------------------------------------------------------

interface SidebarItemProps {
  name: string;
  subtitle?: string;
  initials: string;
  color: string;
  isNew?: boolean;
  onClick?: () => void;
}

function SidebarItem({
  name,
  subtitle,
  initials,
  color,
  isNew,
  onClick,
}: SidebarItemProps) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        className="h-auto py-1.5 gap-3"
        onClick={onClick}
      >
        <div className="relative shrink-0">
          <Avatar className="h-7 w-7">
            <AvatarFallback className={`text-xs font-semibold ${color}`}>
              {initials}
            </AvatarFallback>
          </Avatar>
          {isNew && (
            <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-emerald-500 border-2 border-sidebar" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-sm font-medium truncate block">{name}</span>
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
  const { data: events = [] } = useEvents();
  const { data: news = [] } = useNews();

  const recentEvents = events.slice(0, MAX_ITEMS).map((e, i) => ({
    name: e.eventTitle,
    subtitle: e.eventLocation,
    initials: getInitials(e.eventTitle),
    color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
    isNew: i === 0,
    onClick: () => navigate("/events"),
  }));

  const recentNews = news.slice(0, MAX_ITEMS).map((n, i) => ({
    name: n.newsTitle,
    subtitle: n.author?.name ?? "Oficial",
    initials: getInitials(n.newsTitle),
    color: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
    isNew: i === 0,
    onClick: () => navigate("/news"),
  }));

  const recentGroups = mockGroups.slice(0, MAX_ITEMS).map((g, i) => ({
    name: g.name,
    subtitle: `${g.members} membros`,
    initials: g.name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase(),
    color: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400",
    isNew: i === 0,
    onClick: () => navigate("/groups"),
  }));

  return (
    <Sidebar
      collapsible="none"
      side="right"
      className="border-l"
      style={{ "--sidebar-width": "19.5rem" } as React.CSSProperties}
    >
      <SidebarContent>
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
          title="Grupos"
          icon={<UsersIcon className="h-3.5 w-3.5" />}
          items={recentGroups}
          onNavigate={() => navigate("/groups")}
          navigateLabel="Ver todos os grupos"
        />
      </SidebarContent>
    </Sidebar>
  );
};

export default SidebarRight;
