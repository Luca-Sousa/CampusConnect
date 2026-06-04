import { Separator } from "@/components/ui/separator";
import { LikeButton } from "./like-button";
import { CommentSheet } from "./comment-sheet";
import { ShareButton } from "./share-button";

interface ActionBarProps {
  postId: string;
  commentsCount: number;
  defaultOpenComments?: boolean;
  onCommentsOpenChange?: (open: boolean) => void;
}

export function ActionBar({
  postId,
  commentsCount,
  defaultOpenComments = false,
  onCommentsOpenChange,
}: ActionBarProps) {
  return (
    <div className="flex px-2 py-1.5 border-t">
      <LikeButton postId={postId} />
      <Separator orientation="vertical" className="h-5 my-auto" />
      <CommentSheet
        postId={postId}
        commentsCount={commentsCount}
        defaultOpen={defaultOpenComments}
        onOpenChange={onCommentsOpenChange}
      />
      <Separator orientation="vertical" className="h-5 my-auto" />
      <ShareButton postId={postId} />
    </div>
  );
}
