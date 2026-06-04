"use client";

import { ThumbsUpIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useLikeStatus,
  useToggleLike,
} from "@/features/feed/hooks/use-toggle-like";

interface LikeButtonProps {
  postId: string;
}

export function LikeButton({ postId }: LikeButtonProps) {
  const { data: status, isLoading } = useLikeStatus(postId);
  const { mutate: toggleLike, isPending } = useToggleLike(postId);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center gap-2 h-9">
        <Skeleton className="h-4 w-4 rounded" />
        <Skeleton className="h-3.5 w-16" />
      </div>
    );
  }

  const hasLiked = status?.hasLiked ?? false;
  const likesCount = status?.likesCount ?? 0;

  return (
    <Button
      variant="ghost"
      size="sm"
      className="flex-1 gap-2 text-xs h-9"
      disabled={isPending}
      onClick={() => toggleLike()}
    >
      <motion.div
        animate={hasLiked ? { scale: [1, 1.3, 1] } : { scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <ThumbsUpIcon
          className={`h-4 w-4 ${hasLiked ? "fill-primary text-primary" : "text-muted-foreground"}`}
        />
      </motion.div>
      <span
        className={hasLiked ? "text-primary font-medium" : "text-muted-foreground"}
      >
        Curtir ({likesCount})
      </span>
    </Button>
  );
}
