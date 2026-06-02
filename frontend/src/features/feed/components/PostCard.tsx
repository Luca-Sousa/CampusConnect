import {
  CalendarIcon,
  CheckCircle2Icon,
  ClockIcon,
  MapPinIcon,
  MessageCircleIcon,
  MoreHorizontalIcon,
  NewspaperIcon,
  Share2Icon,
  ThumbsUpIcon,
  Trash2Icon,
  UsersIcon,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CARGO_CONFIG } from "@/features/auth/constants";
import { useDeletePost } from "../hooks/use-delete-post";
import { useToggleRsvp } from "../hooks/use-toggle-rsvp";
import type { EventPost, ImagePost, NewsPost, Post, TextPost } from "../types";
import {
  formatEventDate,
  formatEventTimeRange,
  formatRelativeTime,
  getInitials,
} from "../utils/format";

interface PostCardProps {
  post: Post;
  currentUserId?: string;
}

// ---------------------------------------------------------------------------
// PostHeader
// ---------------------------------------------------------------------------

interface PostHeaderProps {
  post: Post;
  currentUserId?: string;
}

function PostHeader({ post, currentUserId }: PostHeaderProps) {
  const authorName = post.author?.name ?? "Usuário";
  const cargo = post.author?.cargo ?? "aluno";
  const cargoConfig = CARGO_CONFIG[cargo] ?? CARGO_CONFIG["aluno"];
  const { mutate: deletePost } = useDeletePost();

  return (
    <div className="flex items-center justify-between px-4 pt-4 pb-2">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10 shrink-0">
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

      {currentUserId === post.authorId && (
        <Button
          onClick={() => deletePost(post.id)}
          aria-label="Remover publicação"
          size="icon"
          variant="destructive"
        >
          <Trash2Icon className="size-4" />
        </Button>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// BannerAuthorRow — row de autor para banners coloridos (texto branco)
// ---------------------------------------------------------------------------

interface BannerAuthorRowProps {
  post: Post;
  currentUserId?: string;
}

function BannerAuthorRow({ post, currentUserId }: BannerAuthorRowProps) {
  const authorName = post.author?.name ?? "Usuário";
  const { mutate: deletePost } = useDeletePost();

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <Avatar className="h-9 w-9 shrink-0 ring-2 ring-white/25">
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
      {currentUserId === post.authorId && (
        <button
          onClick={() => deletePost(post.id)}
          className="p-1.5 rounded-full hover:bg-white/15 text-white/70 hover:text-white transition-colors"
          aria-label="Remover publicação"
        >
          <MoreHorizontalIcon className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// ActionBar
// ---------------------------------------------------------------------------

function ActionBar() {
  return (
    <div className="flex px-2 py-1.5 border-t">
      <Button
        variant="ghost"
        size="sm"
        className="flex-1 gap-2 text-muted-foreground text-xs h-9"
      >
        <ThumbsUpIcon className="h-4 w-4" />
        <span className="hidden sm:inline">Curtir</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="flex-1 gap-2 text-muted-foreground text-xs h-9"
      >
        <MessageCircleIcon className="h-4 w-4" />
        <span className="hidden sm:inline">Comentar</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="flex-1 gap-2 text-muted-foreground text-xs h-9"
      >
        <Share2Icon className="h-4 w-4" />
        <span className="hidden sm:inline">Compartilhar</span>
      </Button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Post type variants
// ---------------------------------------------------------------------------

function TextPostCard({
  post,
  currentUserId,
}: {
  post: TextPost;
  currentUserId?: string;
}) {
  return (
    <Card className="shadow-sm overflow-hidden">
      <CardContent className="p-0">
        <PostHeader post={post} currentUserId={currentUserId} />
        <p className="px-4 pb-3 text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
          {post.content}
        </p>
        <ActionBar />
      </CardContent>
    </Card>
  );
}

function ImagePostCard({
  post,
  currentUserId,
}: {
  post: ImagePost;
  currentUserId?: string;
}) {
  return (
    <Card className="shadow-sm overflow-hidden">
      <CardContent className="p-0">
        <PostHeader post={post} currentUserId={currentUserId} />
        {post.content && (
          <p className="px-4 pb-3 text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
            {post.content}
          </p>
        )}
        <img
          src={post.imageUrl}
          alt="Imagem da publicação"
          className="w-full max-h-125 object-cover"
        />
        <ActionBar />
      </CardContent>
    </Card>
  );
}

function EventPostCard({
  post,
  currentUserId,
}: {
  post: EventPost;
  currentUserId?: string;
}) {
  const { mutate: toggleRsvp, isPending } = useToggleRsvp();

  return (
    <article className="rounded-xl border border-violet-200/60 dark:border-violet-800/40 bg-card shadow-sm overflow-hidden">
      {/* Gradient banner com autor e título do evento */}
      <div className="bg-linear-to-br from-violet-600 to-indigo-700 px-4 pt-4 pb-5">
        <BannerAuthorRow post={post} currentUserId={currentUserId} />
        <div className="mt-4 flex items-start gap-3">
          <div className="rounded-lg bg-white/15 p-2 shrink-0 mt-0.5">
            <CalendarIcon className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-white font-bold text-lg leading-snug">
            {post.eventTitle}
          </h2>
        </div>
      </div>

      {/* Chips de metadados do evento */}
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

      {/* Imagem opcional do evento */}
      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt="Imagem do evento"
          className="w-full max-h-100 object-cover"
        />
      )}

      {/* Descrição opcional */}
      {post.content && (
        <p className="px-4 pt-3 pb-1 text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
          {post.content}
        </p>
      )}

      {/* Rodapé de confirmação de presença */}
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

      <ActionBar />
    </article>
  );
}

function NewsPostCard({
  post,
  currentUserId,
}: {
  post: NewsPost;
  currentUserId?: string;
}) {
  return (
    <article className="rounded-xl border border-orange-200/60 dark:border-orange-800/40 bg-card shadow-sm overflow-hidden">
      {/* Gradient banner com rótulo oficial e título */}
      <div className="bg-linear-to-br from-orange-500 to-amber-500 px-4 pt-4 pb-5">
        <div className="flex items-center gap-2 text-orange-100 text-xs font-semibold uppercase tracking-wider mb-3">
          <NewspaperIcon className="h-3.5 w-3.5 shrink-0" />
          Comunicado Oficial
        </div>
        <h2 className="text-white font-bold text-lg leading-snug">
          {post.newsTitle}
        </h2>
      </div>

      {/* Autor abaixo do banner */}
      <PostHeader post={post} currentUserId={currentUserId} />

      {/* Imagem opcional do comunicado */}
      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt="Imagem do comunicado"
          className="w-full max-h-100 object-cover"
        />
      )}

      {/* Conteúdo */}
      {post.content && (
        <p className="px-4 pb-4 text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
          {post.content}
        </p>
      )}

      <ActionBar />
    </article>
  );
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function PostCard({ post, currentUserId }: PostCardProps) {
  switch (post.type) {  
    case "text":
      return <TextPostCard post={post} currentUserId={currentUserId} />;
    case "image":
      return <ImagePostCard post={post} currentUserId={currentUserId} />;
    case "event":
      return <EventPostCard post={post} currentUserId={currentUserId} />;
    case "news":
      return <NewsPostCard post={post} currentUserId={currentUserId} />;
  }
}
