import { useState } from "react";
import {
  CalendarIcon,
  CheckCircle2Icon,
  ClockIcon,
  MapPinIcon,
  MessageCircleIcon,
  NewspaperIcon,
  Share2Icon,
  ThumbsUpIcon,
  UsersIcon,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CARGO_CONFIG } from "@/features/auth/constants";
import { useToggleRsvp } from "../hooks/use-toggle-rsvp"; // Esse já existia, mantivemos
import type { EventPost, ImagePost, NewsPost, Post, TextPost } from "../types";
import {
  formatEventDate,
  formatEventTimeRange,
  formatRelativeTime,
  getInitials,
} from "../utils/format";

import { PostActionsMenu } from "./PostActionsMenu";

interface PostCardProps {
  post: Post;
  currentUserId?: string;
  onEdit: (post: Post) => void;
  onCommentClick?: (postId: string) => void;
}

// ---------------------------------------------------------------------------
// PostHeader
// ---------------------------------------------------------------------------

interface PostHeaderProps {
  post: Post;
  currentUserId?: string;
  onEdit: (post: Post) => void;
}

function PostHeader({ post, currentUserId, onEdit }: PostHeaderProps) {
  const authorName = post.author?.name ?? "Usuário";
  const cargo = post.author?.cargo ?? "aluno";
  const cargoConfig = CARGO_CONFIG[cargo] ?? CARGO_CONFIG["aluno"];

  return (
    <div className="flex items-center justify-between px-4 pt-4 pb-2">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10 shrink-0">
          <AvatarImage src={post.author?.image ?? undefined} />
          <AvatarFallback className="bg-gradient-to-br from-orange-400 to-rose-400 text-white font-semibold text-sm">
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
        <PostActionsMenu post={post} onEdit={onEdit} />
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
  onEdit: (post: Post) => void;
}

function BannerAuthorRow({ post, currentUserId, onEdit }: BannerAuthorRowProps) {
  const authorName = post.author?.name ?? "Usuário";

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
      {currentUserId === post.authorId && (
        <PostActionsMenu post={post} onEdit={onEdit} variant="banner" />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// ActionBar — Gerenciando o estado visual de forma segura
// ---------------------------------------------------------------------------

interface ActionBarProps {
  postId: string;
  initialLikes: number;
  initialComments: number;
  initialShares: number;
  initialHasLiked?: boolean;
  onCommentClick?: () => void;
}

function ActionBar({
  postId,
  initialLikes,
  initialComments,
  initialShares,
  initialHasLiked = false,
  onCommentClick,
}: ActionBarProps) {
  // Criamos estados locais baseados no que vem do post para o botão funcionar na hora
  const [likes, setLikes] = useState(initialLikes);
  const [hasLiked, setHasLiked] = useState(initialHasLiked);
  const [shares, setShares] = useState(initialShares);

  const handleLike = () => {
    if (hasLiked) {
      setLikes((prev) => prev - 1);
      setHasLiked(false);
    } else {
      setLikes((prev) => prev + 1);
      setHasLiked(true);
    }
  };

  const handleShare = async () => {
    try {
      const shareUrl = `${window.location.origin}/posts/${postId}`; 
      await navigator.clipboard.writeText(shareUrl);
      setShares((prev) => prev + 1);
      alert("Link do post copiado!");
    } catch (err) {
      console.error("Erro ao copiar link: ", err);
    }
  };

  return (
    <div className="flex px-2 py-1.5 border-t">
      {/* Botão Curtir */}
      <Button
        variant="ghost"
        size="sm"
        className={`flex-1 gap-2 text-xs h-9 transition-colors ${
          hasLiked 
            ? "text-blue-600 hover:text-blue-700 font-semibold" 
            : "text-muted-foreground"
        }`}
        onClick={handleLike}
      >
        <ThumbsUpIcon className={`h-4 w-4 ${hasLiked ? "fill-current" : ""}`} />
        Curtir ({likes})
      </Button>

      {/* Botão Comentar */}
      <Button
        variant="ghost"
        size="sm"
        className="flex-1 gap-2 text-muted-foreground text-xs h-9"
        onClick={onCommentClick}
      >
        <MessageCircleIcon className="h-4 w-4" />
        Comentar ({initialComments})
      </Button>

      {/* Botão Compartilhar */}
      <Button
        variant="ghost"
        size="sm"
        className="flex-1 gap-2 text-muted-foreground text-xs h-9"
        onClick={handleShare}
      >
        <Share2Icon className="h-4 w-4" />
        Compartilhar ({shares})
      </Button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Post type variants
// ---------------------------------------------------------------------------

interface PostCardComponentProps<T> {
  post: T;
  currentUserId?: string;
  onEdit: (post: Post) => void;
  onCommentClick?: (postId: string) => void;
}

function TextPostCard({ post, currentUserId, onEdit, onCommentClick }: PostCardComponentProps<TextPost>) {
  return (
    <Card className="shadow-sm overflow-hidden p-0">
      <CardContent className="p-0">
        <PostHeader post={post} currentUserId={currentUserId} onEdit={onEdit} />
        <p className="px-4 pb-3 text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
          {post.content}
        </p>
        <ActionBar 
          postId={post.id}
          initialLikes={post.likesCount ?? 0}
          initialComments={post.commentsCount ?? 0}
          initialShares={post.sharesCount ?? 0}
          initialHasLiked={post.hasLiked}
          onCommentClick={() => onCommentClick?.(post.id)}
        />
      </CardContent>
    </Card>
  );
}

function ImagePostCard({ post, currentUserId, onEdit, onCommentClick }: PostCardComponentProps<ImagePost>) {
  return (
    <Card className="shadow-sm overflow-hidden p-0">
      <CardContent className="p-0">
        <PostHeader post={post} currentUserId={currentUserId} onEdit={onEdit} />
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
        <ActionBar 
          postId={post.id}
          initialLikes={post.likesCount ?? 0}
          initialComments={post.commentsCount ?? 0}
          initialShares={post.sharesCount ?? 0}
          initialHasLiked={post.hasLiked}
          onCommentClick={() => onCommentClick?.(post.id)}
        />
      </CardContent>
    </Card>
  );
}

function EventPostCard({ post, currentUserId, onEdit, onCommentClick }: PostCardComponentProps<EventPost>) {
  const { mutate: toggleRsvp, isPending } = useToggleRsvp();

  return (
    <article className="rounded-xl border border-violet-200/60 dark:border-violet-800/40 bg-card shadow-sm overflow-hidden">
      <div className="bg-gradient-to-br from-violet-600 to-indigo-700 px-4 pt-4 pb-5">
        <BannerAuthorRow
          post={post}
          currentUserId={currentUserId}
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
          className="w-full max-h-100 object-cover"
        />
      )}

      {post.content && (
        <p className="px-4 pt-3 pb-1 text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
          {post.content}
        </p>
      )}

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

      <ActionBar 
        postId={post.id}
        initialLikes={post.likesCount ?? 0}
        initialComments={post.commentsCount ?? 0}
        initialShares={post.sharesCount ?? 0}
        initialHasLiked={post.hasLiked}
        onCommentClick={() => onCommentClick?.(post.id)}
      />
    </article>
  );
}

function NewsPostCard({ post, currentUserId, onEdit, onCommentClick }: PostCardComponentProps<NewsPost>) {
  return (
    <article className="rounded-xl border border-orange-200/60 dark:border-orange-800/40 bg-card shadow-sm overflow-hidden">
      <div className="bg-gradient-to-br from-orange-500 to-amber-500 p-3">
        <div className="flex items-center gap-2 text-orange-100 text-xs font-semibold uppercase tracking-wider mb-3">
          <NewspaperIcon className="h-3.5 w-3.5 shrink-0" />
          Comunicado Oficial
        </div>
        <h2 className="text-white font-bold text-lg leading-snug">
          {post.newsTitle}
        </h2>
      </div>

      <PostHeader post={post} currentUserId={currentUserId} onEdit={onEdit} />

      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt="Imagem do comunicado"
          className="w-full max-h-100 object-cover"
        />
      )}

      {post.content && (
        <p className="p-4 text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
          {post.content}
        </p>
      )}

      <ActionBar 
        postId={post.id}
        initialLikes={post.likesCount ?? 0}
        initialComments={post.commentsCount ?? 0}
        initialShares={post.sharesCount ?? 0}
        initialHasLiked={post.hasLiked}
        onCommentClick={() => onCommentClick?.(post.id)}
      />
    </article>
  );
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function PostCard({ post, currentUserId, onEdit, onCommentClick }: PostCardProps) {
  switch (post.type) {
    case "text":
      return (
        <TextPostCard
          post={post}
          currentUserId={currentUserId}
          onEdit={onEdit}
          onCommentClick={onCommentClick}
        />
      );
    case "image":
      return (
        <ImagePostCard
          post={post}
          currentUserId={currentUserId}
          onEdit={onEdit}
          onCommentClick={onCommentClick}
        />
      );
    case "event":
      return (
        <EventPostCard
          post={post}
          currentUserId={currentUserId}
          onEdit={onEdit}
          onCommentClick={onCommentClick}
        />
      );
    case "news":
      return (
        <NewsPostCard
          post={post}
          currentUserId={currentUserId}
          onEdit={onEdit}
          onCommentClick={onCommentClick}
        />
      );
  }
}