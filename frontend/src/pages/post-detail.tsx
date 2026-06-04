import { useParams, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
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
  getInitials,
  formatRelativeTime,
} from "@/features/feed/utils/format";
import { CARGO_CONFIG } from "@/features/auth/constants";

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const openComments = searchParams.get("comments") === "true";

  const { data: posts, isLoading, error } = useQuery({
    queryKey: feedKeys.postDetail(id!),
    queryFn: () => fetchPosts(0, 100),
    select: (data) => data.filter((p) => p.id === id),
  });

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto p-4 space-y-4">
        <Skeleton className="h-[300px] rounded-xl" />
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

  const handleCommentsOpenChange = (open: boolean) => {
    if (open) {
      setSearchParams({ comments: "true" });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card className="shadow-sm overflow-hidden p-0">
        <CardContent className="p-0">
          <div className="flex items-center gap-3 px-4 pt-4 pb-2">
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
              className="w-full max-h-[500px] object-cover"
            />
          )}

          <ActionBar
            postId={post.id}
            commentsCount={0}
            defaultOpenComments={openComments}
            onCommentsOpenChange={handleCommentsOpenChange}
          />
        </CardContent>
      </Card>
    </div>
  );
}
