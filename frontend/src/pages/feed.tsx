import { useState } from "react";
import { useSession } from "@/lib/auth-client";
import { usePosts } from "@/features/feed/hooks/use-posts";
import { PostComposer } from "@/features/feed/components/PostComposer";
import { PostCard } from "@/features/feed/components/PostCard";
import { FeedSkeleton } from "@/features/feed/components/FeedSkeleton";
import type { Post } from "@/features/feed/types";

const FeedPage = () => {
  const { data: session } = useSession();
  const { data: posts = [], isLoading } = usePosts();
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  const currentUserRole = (session?.user as { role?: string } | undefined)?.role;
  const currentUserCargo = (session?.user as { cargo?: string } | undefined)?.cargo;

  return (
    <div className="max-w-2xl mx-auto w-full px-4 py-6 flex flex-col gap-5">
      <PostComposer
        editingPost={editingPost}
        onEditClose={() => setEditingPost(null)}
      />

      {isLoading ? (
        <FeedSkeleton />
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
            currentUserRole={currentUserRole}
            currentUserCargo={currentUserCargo}
            onEdit={setEditingPost}
          />
        ))
      )}
    </div>
  );
};

export default FeedPage;
