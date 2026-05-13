import {
  MoreHorizontalIcon,
  ThumbsUpIcon,
  MessageCircleIcon,
  Share2Icon,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Post } from "../types";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Card className="shadow-sm overflow-hidden">
      <CardContent className="p-0">
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 shrink-0">
              <AvatarFallback
                className={`text-sm font-semibold bg-linear-to-br ${post.avatarFrom} ${post.avatarTo} text-white`}
              >
                {post.initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-sm text-foreground leading-tight">{post.author}</p>
              <p className="text-xs text-muted-foreground">{post.time}</p>
            </div>
          </div>
          <button className="p-1.5 rounded-full hover:bg-muted text-muted-foreground transition-colors">
            <MoreHorizontalIcon className="h-4 w-4" />
          </button>
        </div>

        <p className="px-4 pb-3 text-sm text-foreground/80 leading-relaxed">
          {post.content}
        </p>

        {post.images.map((img, i) => (
          <div
            key={i}
            className={`w-full ${img.aspect} bg-linear-to-br ${img.gradient}`}
          />
        ))}

        <div className="flex gap-0 px-2 py-2 border-t mt-1">
          <Button variant="ghost" size="sm" className="flex-1 gap-2 text-muted-foreground text-xs">
            <ThumbsUpIcon className="h-4 w-4" />
            Curtir
          </Button>
          <Button variant="ghost" size="sm" className="flex-1 gap-2 text-muted-foreground text-xs">
            <MessageCircleIcon className="h-4 w-4" />
            Comentar
          </Button>
          <Button variant="ghost" size="sm" className="flex-1 gap-2 text-muted-foreground text-xs">
            <Share2Icon className="h-4 w-4" />
            Compartilhar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
