import { NewspaperIcon, ClockIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CARGO_CONFIG } from "@/features/auth/constants";
import { formatRelativeTime, getInitials } from "@/features/feed/utils/format";
import type { NewsPost } from "../types";
import { NewsActionsMenu } from "./NewsActionsMenu";

interface NewsCardProps {
  news: NewsPost;
  currentUserId?: string;
  currentUserRole?: string;
  currentUserCargo?: string;
  onEdit: (news: NewsPost) => void;
  variant?: "featured" | "default";
}

export function NewsCard({
  news,
  currentUserId,
  currentUserRole,
  currentUserCargo,
  onEdit,
  variant = "default",
}: NewsCardProps) {
  const authorName = news.author?.name ?? "Usuário";
  const cargo = news.author?.cargo ?? "aluno";
  const cargoConfig = CARGO_CONFIG[cargo] ?? CARGO_CONFIG["aluno"];
  const isAuthor = currentUserId === news.authorId;
  const canManage =
    isAuthor ||
    currentUserRole === "admin" ||
    currentUserCargo === "direcao" ||
    currentUserCargo === "administracao";

  const initials = getInitials(authorName);

  if (variant === "featured") {
    return (
      <article className="group relative rounded-2xl border border-border bg-card overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-amber-300 dark:hover:border-amber-700">
        {news.imageUrl && (
          <div className="relative aspect-square sm:aspect-video md:aspect-square lg:aspect-21/9 overflow-hidden">
            <img
              src={news.imageUrl}
              alt={news.newsTitle}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Overlay escuro para legibilidade em imagens claras */}
            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
          </div>
        )}

        <div
          className={`p-5 space-y-3 ${news.imageUrl ? "absolute bottom-0 left-0 right-0" : ""}`}
        >
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 rounded-full px-2.5 py-0.5 border border-amber-200/60 dark:border-amber-800/40">
              <NewspaperIcon className="h-3 w-3" />
              Comunicado Oficial
            </span>
          </div>

          <h2
            className={`font-extrabold leading-tight text-foreground group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors ${news.imageUrl ? "text-xl text-white group-hover:text-amber-300" : "text-2xl"}`}
          >
            {news.newsTitle}
          </h2>

          {news.content && (
            <p
              className={`text-sm leading-relaxed line-clamp-2 ${news.imageUrl ? "text-white/80" : "text-muted-foreground"}`}
            >
              {news.content}
            </p>
          )}

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <Avatar className="size-10">
                <AvatarImage src={news.author?.image ?? undefined} />
                <AvatarFallback className="bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 text-xs font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span
                  className={`text-xs font-medium leading-tight ${news.imageUrl ? "text-white" : "text-foreground"}`}
                >
                  {authorName}
                </span>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${cargoConfig.className}`}
                  >
                    {cargoConfig.label}
                  </span>
                </div>
              </div>
            </div>
            {canManage && <NewsActionsMenu news={news} onEdit={onEdit} />}
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group flex flex-col sm:flex-row gap-0 rounded-xl border border-border bg-card overflow-hidden transition-all duration-300 hover:shadow-md hover:border-amber-200 dark:hover:border-amber-800">
      {news.imageUrl && (
        <div className="relative sm:w-48 md:w-56 shrink-0 overflow-hidden">
          <img
            src={news.imageUrl}
            alt={news.newsTitle}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 aspect-video sm:aspect-auto"
          />
        </div>
      )}

      <div className="flex-1 p-4 space-y-2 min-w-0">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
            <NewspaperIcon className="h-3 w-3" />
            Oficial
          </span>
          <span className="text-[10px] text-muted-foreground">·</span>
          <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <ClockIcon className="h-3 w-3" />
            {formatRelativeTime(news.createdAt)}
          </span>
        </div>

        <h3 className="font-bold text-base leading-snug text-foreground line-clamp-2 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
          {news.newsTitle}
        </h3>

        {news.content && (
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {news.content}
          </p>
        )}

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={news.author?.image ?? undefined} />
              <AvatarFallback className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-[10px] font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs font-medium text-foreground">
              {authorName}
            </span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${cargoConfig.className}`}
            >
              {cargoConfig.label}
            </span>
          </div>
          {canManage && <NewsActionsMenu news={news} onEdit={onEdit} />}
        </div>
      </div>
    </article>
  );
}
