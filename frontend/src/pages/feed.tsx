import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "@/lib/auth-client";
import { usePosts } from "@/features/feed/hooks/use-posts";
import { PostComposer } from "@/features/feed/components/PostComposer";
import { PostCard } from "@/features/feed/components/PostCard";
import type { Post } from "@/features/feed/types";

function PostSkeleton() {
  return (
    <div className="rounded-xl border bg-card shadow-sm p-4 space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-1.5 flex-1">
          <Skeleton className="h-3.5 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  );
}

const FeedPage = () => {
  const { data: session } = useSession();
  const { data: posts = [], isLoading } = usePosts();
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  return (
    <div className="max-w-2xl mx-auto w-full px-4 py-6 flex flex-col gap-5">
      <PostComposer
        editingPost={editingPost}
        onEditClose={() => setEditingPost(null)}
      />

      {isLoading ? (
        <>
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </>
      ) : posts.length === 0 ? (
        <p className="text-center text-muted-foreground py-12 text-sm">
          Nenhuma publicação ainda. Seja o primeiro a publicar!
        </p>
      ) : (
        posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            currentUserId={session?.user?.id}
            onEdit={setEditingPost}
          />
        ))
      )}
    </div>
  );
};

export default FeedPage;
