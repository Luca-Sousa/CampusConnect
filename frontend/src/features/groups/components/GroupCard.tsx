import {
  UsersIcon,
  MessageCircleIcon,
  LogOutIcon,
  LogInIcon,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatRelativeTime, getInitials } from "@/features/feed/utils/format";
import { useToggleJoinGroup } from "../hooks/use-toggle-join-group";
import type { Group } from "../types";
import { GroupActionsMenu } from "./GroupActionsMenu";

interface GroupCardProps {
  group: Group;
  currentUserId?: string;
  userRole?: string;
  onEdit: (group: Group) => void;
  onOpenMessages: (group: Group) => void;
}

export function GroupCard({
  group,
  currentUserId,
  userRole,
  onEdit,
  onOpenMessages,
}: GroupCardProps) {
  const { mutate: toggleJoin, isPending } = useToggleJoinGroup();

  const authorName = group.author?.name ?? "Usuário";
  const isAuthor = currentUserId === group.authorId;
  const isAdmin = userRole === "admin";

  return (
    <article className="group relative rounded-2xl border border-border bg-card overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-indigo-300 dark:hover:border-indigo-700">
      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Icon + Title + Actions */}
        <div className="flex items-start gap-3">
          {/* Emoji icon circle (WhatsApp style) */}
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-2xl">
            {group.icon ?? "👥"}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-bold text-lg leading-snug text-foreground line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {group.name}
              </h3>
              {(isAuthor || isAdmin) && (
                <GroupActionsMenu group={group} onEdit={onEdit} />
              )}
            </div>

            {/* Description */}
            {group.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed mt-1">
                {group.description}
              </p>
            )}
          </div>
        </div>

        {/* Member count + author */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <UsersIcon className="h-3.5 w-3.5 text-indigo-500" />
            {group.memberCount} {group.memberCount === 1 ? "membro" : "membros"}
          </span>
          <span className="text-border">•</span>
          <span>{authorName}</span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center gap-2">
            <Avatar className="h-7 w-7">
              <AvatarFallback className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
                {getInitials(authorName)}
              </AvatarFallback>
            </Avatar>
            <span className="text-[10px] text-muted-foreground">
              {formatRelativeTime(group.createdAt)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {group.isMember && (
              <Button
                size="sm"
                variant="ghost"
                className="h-8 gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                onClick={() => onOpenMessages(group)}
              >
                <MessageCircleIcon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Chat</span>
              </Button>
            )}
            <Button
              size="sm"
              variant={group.isMember ? "default" : "outline"}
              className={`h-8 gap-1.5 text-xs ${
                group.isMember
                  ? "bg-indigo-600 hover:bg-indigo-700 text-white border-transparent"
                  : "border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
              }`}
              disabled={isPending}
              onClick={() => toggleJoin(group.id)}
            >
              {group.isMember ? (
                <>
                  <LogOutIcon className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Sair</span>
                </>
              ) : (
                <>
                  <LogInIcon className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Entrar</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
