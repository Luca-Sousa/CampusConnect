import {
  CalendarIcon,
  CheckCircle2Icon,
  ClockIcon,
  MapPinIcon,
  NewspaperIcon,
  ShieldAlertIcon,
  UsersIcon,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CARGO_CONFIG } from "@/features/auth/constants";
import { canModeratePost } from "@/lib/permissions";
import { ActionBar } from "@/components/action-bar";
import { useToggleRsvp } from "../hooks/use-toggle-rsvp";
import type { EventPost, ImagePost, NewsPost, Post, TextPost } from "../types";
import {
  formatEventDate,
  formatEventTimeRange,
  formatRelativeTime,
} from "../utils/format";
import { getInitials } from "@/lib/utils";
import { PostActionsMenu } from "./PostActionsMenu";
import { ExpandableText } from "@/components/expandable-text";
import { cn } from "@/lib/utils";

interface PostCardProps {
  post: Post;
  currentUserId?: string;
  currentUserRole?: string;
  currentUserCargo?: string;
  onEdit: (post: Post) => void;
}

// ---------------------------------------------------------------------------
// PostHeader
// ---------------------------------------------------------------------------

interface PostHeaderProps {
  post: Post;
  currentUserId?: string;
  currentUserRole?: string;
  currentUserCargo?: string;
  onEdit: (post: Post) => void;
}

function PostHeader({ post, currentUserId, currentUserRole, currentUserCargo, onEdit }: PostHeaderProps) {
  const authorName = post.author?.name ?? "Usuário";
  const cargo = post.author?.cargo ?? "aluno";
  const cargoConfig = CARGO_CONFIG[cargo] ?? CARGO_CONFIG["aluno"];
  const isModerated = post.moderated === true;
  const isAuthor = currentUserId === post.authorId;
  const canManage = canModeratePost(currentUserRole, currentUserCargo);

  return (
    <div className="flex items-center justify-between px-4 pt-4 pb-2">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10 shrink-0">
          <AvatarImage src={post.author?.image ?? undefined} />
          <AvatarFallback className="bg-linear-to-br from-orange-400 to-rose-400 text-white font-semibold text-sm">
            {getInitials(authorName)}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold text-sm text-foreground leading-tight">
            {authorName}
          </p>
          <div className="flex items-center gap-1.5">
            <span
              className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${cargoConfig.className}`}
            >
              {cargoConfig.label}
            </span>
            <span className="text-xs text-muted-foreground">
              · {formatRelativeTime(post.createdAt)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {isModerated && (
          <span className={cn(
            "inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
            canManage
              ? "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400"
              : "bg-orange-500/20 text-orange-600 dark:text-orange-400",
          )}>
            <ShieldAlertIcon className="h-3 w-3" />
            {canManage ? "Moderação Pendente" : "Aguardando moderação"}
          </span>
        )}
        {(isAuthor || (canManage && isModerated)) && (
          <PostActionsMenu post={post} onEdit={onEdit} currentUserId={currentUserId} currentUserRole={currentUserRole} currentUserCargo={currentUserCargo} />
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// BannerAuthorRow — row de autor para banners coloridos (texto branco)
// ---------------------------------------------------------------------------

interface BannerAuthorRowProps {
  post: Post;
  currentUserId?: string;
  currentUserRole?: string;
  currentUserCargo?: string;
  onEdit: (post: Post) => void;
}

function BannerAuthorRow({ post, currentUserId, currentUserRole, currentUserCargo, onEdit }: BannerAuthorRowProps) {
  const authorName = post.author?.name ?? "Usuário";
  const isModerated = post.moderated === true;
  const isAuthor = currentUserId === post.authorId;
  const canManage = canModeratePost(currentUserRole, currentUserCargo);

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <Avatar className="h-9 w-9 shrink-0 ring-2 ring-white/25">
          <AvatarImage src={post.author?.image ?? undefined} />
          <AvatarFallback className="bg-white/20 text-white font-semibold text-sm">
            {getInitials(authorName)}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold text-sm text-white leading-tight">
            {authorName}
          </p>
          <p className="text-xs text-white/70">
            {formatRelativeTime(post.createdAt)}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {isModerated && (
          <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-yellow-500/30 text-yellow-100">
            <ShieldAlertIcon className="h-3 w-3" />
            {canManage ? "Moderação Pendente" : "Aguardando moderação"}
          </span>
        )}
        {(isAuthor || (canManage && isModerated)) && (
          <PostActionsMenu post={post} onEdit={onEdit} variant="banner" currentUserId={currentUserId} currentUserRole={currentUserRole} currentUserCargo={currentUserCargo} />
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Post type variants
// ---------------------------------------------------------------------------

function TextPostCard({
  post,
  currentUserId,
  currentUserRole,
  currentUserCargo,
  onEdit,
}: {
  post: TextPost;
  currentUserId?: string;
  currentUserRole?: string;
  currentUserCargo?: string;
  onEdit: (post: Post) => void;
}) {
  const isModerated = post.moderated === true;
  const canManage = canModeratePost(currentUserRole, currentUserCargo);
  const isAuthor = currentUserId === post.authorId;
  const hideActions = isModerated && !canManage && !isAuthor;

  return (
    <Card className={cn(
      "shadow-sm overflow-hidden p-0",
      isModerated && !canManage && "bg-muted/50 opacity-80",
      isModerated && canManage && "bg-yellow-50/50 dark:bg-yellow-950/20",
    )}>
      <CardContent className="p-0">
        <PostHeader post={post} currentUserId={currentUserId} currentUserRole={currentUserRole} currentUserCargo={currentUserCargo} onEdit={onEdit} />
        <ExpandableText text={post.content ?? ""} />
        {!hideActions && <ActionBar postId={post.id} commentsCount={0} />}
      </CardContent>
    </Card>
  );
}

function ImagePostCard({
  post,
  currentUserId,
  currentUserRole,
  currentUserCargo,
  onEdit,
}: {
  post: ImagePost;
  currentUserId?: string;
  currentUserRole?: string;
  currentUserCargo?: string;
  onEdit: (post: Post) => void;
}) {
  const isModerated = post.moderated === true;
  const canManage = canModeratePost(currentUserRole, currentUserCargo);
  const isAuthor = currentUserId === post.authorId;
  const hideActions = isModerated && !canManage && !isAuthor;

  return (
    <Card className={cn(
      "shadow-sm overflow-hidden p-0",
      isModerated && !canManage && "bg-muted/50 opacity-80",
      isModerated && canManage && "bg-yellow-50/50 dark:bg-yellow-950/20",
    )}>
      <CardContent className="p-0">
        <PostHeader post={post} currentUserId={currentUserId} currentUserRole={currentUserRole} currentUserCargo={currentUserCargo} onEdit={onEdit} />
        {post.content && (
          <ExpandableText text={post.content} />
        )}
        <img
          src={post.imageUrl}
          alt="Imagem da publicação"
          className={cn(
            "w-full max-h-125 object-cover",
            isModerated && !canManage && "grayscale",
            isModerated && canManage && "brightness-95",
          )}
        />
        {!hideActions && <ActionBar postId={post.id} commentsCount={0} />}
      </CardContent>
    </Card>
  );
}

function EventPostCard({
  post,
  currentUserId,
  currentUserRole,
  currentUserCargo,
  onEdit,
}: {
  post: EventPost;
  currentUserId?: string;
  currentUserRole?: string;
  currentUserCargo?: string;
  onEdit: (post: Post) => void;
}) {
  const { mutate: toggleRsvp, isPending } = useToggleRsvp();
  const isModerated = post.moderated === true;
  const canManage = canModeratePost(currentUserRole, currentUserCargo);
  const isAuthor = currentUserId === post.authorId;
  const hideActions = isModerated && !canManage && !isAuthor;

  return (
    <article className={cn(
      "rounded-xl border shadow-sm overflow-hidden",
      isModerated && !canManage
        ? "border-gray-300 dark:border-gray-700 bg-card opacity-80"
        : isModerated && canManage
          ? "border-yellow-200/60 dark:border-yellow-800/40 bg-card"
          : "border-violet-200/60 dark:border-violet-800/40 bg-card",
    )}>
      <div className={cn(
        "bg-linear-to-br px-4 pt-4 pb-5",
        isModerated && !canManage
          ? "from-gray-400 to-gray-500"
          : isModerated && canManage
            ? "from-yellow-500 to-amber-600"
            : "from-violet-600 to-indigo-700",
      )}>
        <BannerAuthorRow
          post={post}
          currentUserId={currentUserId}
          currentUserRole={currentUserRole}
          currentUserCargo={currentUserCargo}
          onEdit={onEdit}
        />
        <div className="mt-4 flex items-start gap-3">
          <div className="rounded-lg bg-white/15 p-2 shrink-0 mt-0.5">
            <CalendarIcon className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-white font-bold text-lg leading-snug">
            {post.eventTitle}
          </h2>
        </div>
      </div>

      <div className="bg-violet-50/60 dark:bg-violet-950/30 px-4 py-3 flex flex-wrap gap-2 border-b border-violet-100 dark:border-violet-900/30">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-violet-700 dark:text-violet-300 bg-white dark:bg-violet-900/30 rounded-full px-3 py-1 border border-violet-200/60 dark:border-violet-700/40">
          <CalendarIcon className="h-3.5 w-3.5 shrink-0" />
          {formatEventDate(post.eventDate)}
        </span>
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-violet-700 dark:text-violet-300 bg-white dark:bg-violet-900/30 rounded-full px-3 py-1 border border-violet-200/60 dark:border-violet-700/40">
          <ClockIcon className="h-3.5 w-3.5 shrink-0" />
          {formatEventTimeRange(post.eventTime, post.eventEndTime)}
        </span>
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-violet-700 dark:text-violet-300 bg-white dark:bg-violet-900/30 rounded-full px-3 py-1 border border-violet-200/60 dark:border-violet-700/40">
          <MapPinIcon className="h-3.5 w-3.5 shrink-0" />
          {post.eventLocation}
        </span>
      </div>

      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt="Imagem do evento"
          className={cn(
            "w-full max-h-100 object-cover",
            isModerated && !canManage && "grayscale",
            isModerated && canManage && "brightness-95",
          )}
        />
      )}

      {post.content && (
        <ExpandableText text={post.content} className="px-4 pt-3 pb-1" />
      )}

      {!hideActions && (
        <div className="px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <UsersIcon className="h-4 w-4 shrink-0" />
            {post.rsvpCount}{" "}
            {post.rsvpCount === 1 ? "confirmação" : "confirmações"}
          </span>
          <Button
            size="sm"
            variant={post.hasRsvp ? "default" : "outline"}
            className={`gap-1.5 transition-all ${
              post.hasRsvp
                ? "bg-green-600 hover:bg-green-700 text-white border-transparent"
                : "border-violet-300 dark:border-violet-700 text-violet-700 dark:text-violet-300 hover:bg-violet-50 dark:hover:bg-violet-900/20"
            }`}
            disabled={isPending}
            onClick={() => toggleRsvp(post.id)}
          >
            <CheckCircle2Icon className="h-4 w-4" />
            <span className="hidden sm:inline">
              {post.hasRsvp ? "Presença confirmada" : "Confirmar presença"}
            </span>
            <span className="sm:hidden">
              {post.hasRsvp ? "Confirmado" : "Confirmar"}
            </span>
          </Button>
        </div>
      )}

      {!hideActions && <ActionBar postId={post.id} commentsCount={0} />}
    </article>
  );
}

function NewsPostCard({
  post,
  currentUserId,
  currentUserRole,
  currentUserCargo,
  onEdit,
}: {
  post: NewsPost;
  currentUserId?: string;
  currentUserRole?: string;
  currentUserCargo?: string;
  onEdit: (post: Post) => void;
}) {
  const isModerated = post.moderated === true;
  const canManage = canModeratePost(currentUserRole, currentUserCargo);
  const isAuthor = currentUserId === post.authorId;
  const hideActions = isModerated && !canManage && !isAuthor;

  return (
    <article className={cn(
      "rounded-xl border shadow-sm overflow-hidden",
      isModerated && !canManage
        ? "border-gray-300 dark:border-gray-700 bg-card opacity-80"
        : isModerated && canManage
          ? "border-yellow-200/60 dark:border-yellow-800/40 bg-card"
          : "border-orange-200/60 dark:border-orange-800/40 bg-card",
    )}>
      <div className={cn(
        "bg-linear-to-br p-3",
        isModerated && !canManage
          ? "from-gray-400 to-gray-500"
          : isModerated && canManage
            ? "from-yellow-500 to-amber-600"
            : "from-orange-500 to-amber-500",
      )}>
        <div className="flex items-center gap-2 text-orange-100 text-xs font-semibold uppercase tracking-wider mb-3">
          <NewspaperIcon className="h-3.5 w-3.5 shrink-0" />
          Comunicado Oficial
        </div>
        <h2 className="text-white font-bold text-lg leading-snug">
          {post.newsTitle}
        </h2>
      </div>

      <PostHeader post={post} currentUserId={currentUserId} currentUserRole={currentUserRole} currentUserCargo={currentUserCargo} onEdit={onEdit} />

      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt="Imagem do comunicado"
          className={cn(
            "w-full max-h-100 object-cover",
            isModerated && !canManage && "grayscale",
            isModerated && canManage && "brightness-95",
          )}
        />
      )}

      {post.content && (
        <ExpandableText text={post.content} className="p-4" />
      )}

      {!hideActions && <ActionBar postId={post.id} commentsCount={0} />}
    </article>
  );
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function PostCard({ post, currentUserId, currentUserRole, currentUserCargo, onEdit }: PostCardProps) {
  switch (post.type) {
    case "text":
      return (
        <TextPostCard
          post={post}
          currentUserId={currentUserId}
          currentUserRole={currentUserRole}
          currentUserCargo={currentUserCargo}
          onEdit={onEdit}
        />
      );
    case "image":
      return (
        <ImagePostCard
          post={post}
          currentUserId={currentUserId}
          currentUserRole={currentUserRole}
          currentUserCargo={currentUserCargo}
          onEdit={onEdit}
        />
      );
    case "event":
      return (
        <EventPostCard
          post={post}
          currentUserId={currentUserId}
          currentUserRole={currentUserRole}
          currentUserCargo={currentUserCargo}
          onEdit={onEdit}
        />
      );
    case "news":
      return (
        <NewsPostCard
          post={post}
          currentUserId={currentUserId}
          currentUserRole={currentUserRole}
          currentUserCargo={currentUserCargo}
          onEdit={onEdit}
        />
      );
  }
}
