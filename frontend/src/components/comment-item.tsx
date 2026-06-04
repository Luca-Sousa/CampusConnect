import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  getInitials,
  formatRelativeTime,
} from "@/features/feed/utils/format";
import type { Comment } from "@/features/feed/types";

interface CommentItemProps {
  comment: Comment;
  onReply: (parentId: string) => void;
}

export function CommentItem({ comment, onReply }: CommentItemProps) {
  const author = comment.author;
  const authorName = author?.name ?? "Usuário";

  return (
    <div className="py-2">
      <div className="flex gap-3">
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarImage src={author?.image ?? undefined} />
          <AvatarFallback className="bg-linear-to-br from-orange-400 to-rose-400 text-white text-xs">
            {getInitials(authorName)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <span className="font-semibold text-sm">{authorName}</span>
            <span className="text-xs text-muted-foreground">
              {formatRelativeTime(comment.createdAt)}
            </span>
          </div>
          <p className="text-sm text-foreground/80 mt-0.5 whitespace-pre-wrap">
            {comment.content}
          </p>
          {!comment.parentId && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs text-muted-foreground mt-1"
              onClick={() => onReply(comment.id)}
            >
              Responder
            </Button>
          )}
        </div>
      </div>

      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-11 mt-1 space-y-1 border-l-2 border-muted pl-3">
          {comment.replies.map((reply) => (
            <div key={reply.id} className="flex gap-2 py-1.5">
              <Avatar className="h-6 w-6 shrink-0">
                <AvatarImage src={reply.author?.image ?? undefined} />
                <AvatarFallback className="bg-linear-to-br from-orange-400 to-rose-400 text-white text-[10px]">
                  {getInitials(reply.author?.name ?? "U")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="font-semibold text-xs">
                    {reply.author?.name ?? "Usuário"}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {formatRelativeTime(reply.createdAt)}
                  </span>
                </div>
                <p className="text-xs text-foreground/80 mt-0.5 whitespace-pre-wrap">
                  {reply.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
