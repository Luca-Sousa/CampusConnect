import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ShieldAlertIcon } from "lucide-react";
import { feedKeys } from "@/features/feed/query-keys";
import { fetchPosts } from "@/features/feed/api";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ActionBar } from "@/components/action-bar";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  formatRelativeTime,
} from "@/features/feed/utils/format";
import { getInitials } from "@/lib/utils";
import { CARGO_CONFIG } from "@/features/auth/constants";
import { useSession } from "@/lib/auth-client";
import { PostActionsMenu } from "@/features/feed/components/PostActionsMenu";
import { canModeratePost } from "@/lib/permissions";
import { cn } from "@/lib/utils";

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const openComments = searchParams.get("comments") === "true";
  const navigate = useNavigate();
  const { data: session } = useSession();

  const currentUserRole = (session?.user as { role?: string } | undefined)?.role;
  const currentUserCargo = (session?.user as { cargo?: string } | undefined)?.cargo;

  const { data: posts, isLoading, error } = useQuery({
    queryKey: feedKeys.postDetail(id!),
    queryFn: () => fetchPosts(0, 100),
    select: (data) => data.filter((p) => p.id === id),
  });

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
          <div className="px-4 pt-4 pb-3">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full shrink-0" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          </div>
          <div className="px-4 pb-4 space-y-2.5">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-4 w-[280px] sm:w-[360px] md:w-[440px] lg:w-[520px] xl:w-[600px] 2xl:w-[680px]" />
            <Skeleton className="h-4 w-[260px] sm:w-[340px] md:w-[420px] lg:w-[500px] xl:w-[580px] 2xl:w-[660px]" />
            <Skeleton className="h-4 w-[240px] sm:w-[320px] md:w-[400px] lg:w-[480px] xl:w-[560px] 2xl:w-[640px]" />
            <Skeleton className="h-4 w-[200px] sm:w-[260px] md:w-[320px] lg:w-[380px] xl:w-[440px] 2xl:w-[500px]" />
            <Skeleton className="h-4 w-[160px] sm:w-[200px] md:w-[240px] lg:w-[280px] xl:w-[320px] 2xl:w-[360px]" />
          </div>
          <Skeleton className="h-64 w-[280px] sm:w-[360px] md:w-[440px] lg:w-[520px] xl:w-[600px] 2xl:w-[680px]" />
          <div className="flex px-2 py-1.5 border-t gap-2">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 flex-1" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !posts?.length) {
    return (
      <div className="max-w-2xl mx-auto p-4 text-center py-16">
        <p className="text-muted-foreground">Publicação não encontrada.</p>
      </div>
    );
  }

  const post = posts[0];
  const authorName = post.author?.name ?? "Usuário";
  const cargo = post.author?.cargo ?? "aluno";
  const cargoConfig = CARGO_CONFIG[cargo] ?? CARGO_CONFIG["aluno"];

  const isModerated = post.moderated === true;
  const currentUserId = session?.user?.id;
  const isAuthor = currentUserId === post.authorId;
  const canManage = canModeratePost(currentUserRole, currentUserCargo);
  const hideActions = isModerated && !canManage && !isAuthor;

  const handleCommentsOpenChange = (open: boolean) => {
    if (open) {
      setSearchParams({ comments: "true" });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card className={cn(
        "shadow-sm overflow-hidden p-0",
        isModerated && !canManage && "bg-muted/50 opacity-80",
        isModerated && canManage && "bg-yellow-50/50 dark:bg-yellow-950/20",
      )}>
        <CardContent className="p-0">
          <div className="flex items-center gap-3 px-4 pt-4 pb-2">
            <Avatar className="h-10 w-10 shrink-0">
              <AvatarImage src={post.author?.image ?? undefined} />
              <AvatarFallback className="bg-linear-to-br from-orange-400 to-rose-400 text-white font-semibold text-sm">
                {getInitials(authorName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
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

            <div className="flex items-center gap-2 shrink-0">
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
                <PostActionsMenu
                  post={post}
                  onEdit={() => {}}
                  currentUserId={currentUserId}
                  currentUserRole={currentUserRole}
                  currentUserCargo={currentUserCargo}
                  onRejectSuccess={() => navigate("/feed")}
                />
              )}
            </div>
          </div>

          {post.type === "news" && post.newsTitle && (
            <h2 className="px-4 font-bold text-lg">{post.newsTitle}</h2>
          )}

          {post.type === "event" && post.eventTitle && (
            <h2 className="px-4 font-bold text-lg">{post.eventTitle}</h2>
          )}

          {post.content && (
            <p className="px-4 pb-3 text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
              {post.content}
            </p>
          )}

          {"imageUrl" in post && post.imageUrl && (
            <img
              src={post.imageUrl}
              alt="Imagem da publicação"
              className={cn(
                "w-full max-h-125 object-cover",
                isModerated && !canManage && "grayscale",
                isModerated && canManage && "brightness-95",
              )}
            />
          )}

          {!hideActions && (
            <ActionBar
              postId={post.id}
              commentsCount={0}
              defaultOpenComments={openComments}
              onCommentsOpenChange={handleCommentsOpenChange}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
