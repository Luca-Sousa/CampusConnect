"use client";

import { useState } from "react";
import { MessageCircleIcon, SendIcon } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useComments,
  useAddComment,
} from "@/features/feed/hooks/use-comments";
import { CommentItem } from "./comment-item";

interface CommentSheetProps {
  postId: string;
  commentsCount: number;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

function CommentSkeleton() {
  return (
    <div className="py-2">
      <div className="flex gap-3">
        <Skeleton className="h-8 w-8 rounded-full shrink-0" />
        <div className="flex-1 space-y-1.5">
          <div className="flex items-center gap-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-2.5 w-12" />
          </div>
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3.5 w-3/4" />
        </div>
      </div>
    </div>
  );
}

export function CommentSheet({
  postId,
  commentsCount,
  defaultOpen = false,
  onOpenChange,
}: CommentSheetProps) {
  const [content, setContent] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const { data: comments = [], isLoading } = useComments(postId);
  const { mutate: addComment, isPending } = useAddComment(postId);

  const handleSubmit = () => {
    if (!content.trim() || isPending) return;

    addComment(
      { content: content.trim(), parentId: replyTo ?? undefined },
      {
        onSuccess: () => {
          setContent("");
          setReplyTo(null);
        },
      },
    );
  };

  const totalComments =
    commentsCount > 0
      ? commentsCount
      : comments.reduce(
          (acc, c) => acc + 1 + (c.replies?.length ?? 0),
          0,
        );

  return (
    <Sheet defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex-1 gap-2 text-muted-foreground text-xs h-9"
        >
          <MessageCircleIcon className="h-4 w-4" />
          Comentar ({totalComments})
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-full sm:w-100 p-0 flex flex-col"
      >
        <SheetHeader className="p-4 border-b">
          <SheetTitle>Comentários ({totalComments})</SheetTitle>
        </SheetHeader>

        <ScrollArea className="flex-1 px-4">
          {isLoading ? (
            <div className="py-2 space-y-1">
              <CommentSkeleton />
              <CommentSkeleton />
              <CommentSkeleton />
            </div>
          ) : comments.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground text-sm">
              Nenhum comentário ainda. Seja o primeiro!
            </div>
          ) : (
            <div className="py-2 space-y-1">
              {comments.map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  onReply={(id) => setReplyTo(id)}
                />
              ))}
            </div>
          )}
        </ScrollArea>

        <div className="px-4 py-3 border-t bg-background">
          {replyTo && (
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
              <span>Respondendo a um comentário...</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={() => setReplyTo(null)}
              >
                Cancelar
              </Button>
            </div>
          )}
          <div className="flex gap-2">
            <Textarea
              placeholder="Escreva um comentário..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              className="min-h-11 resize-none"
              rows={1}
            />
            <Button
              size="icon"
              disabled={!content.trim() || isPending}
              onClick={handleSubmit}
            >
              <SendIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
