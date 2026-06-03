import { useState, useRef, useEffect } from "react";
import { SendIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatRelativeTime, getInitials } from "@/features/feed/utils/format";
import { useGroupMessages } from "../hooks/use-group-messages";
import { useSendGroupMessage } from "../hooks/use-send-group-message";
import type { Group } from "../types";

interface GroupSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  group: Group | null;
  currentUserId?: string;
}

export function GroupSheet({
  open,
  onOpenChange,
  group,
  currentUserId,
}: GroupSheetProps) {
  const [content, setContent] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: messages = [], isLoading } = useGroupMessages(
    open ? group?.id ?? null : null,
  );
  const { mutate: sendMessage, isPending } = useSendGroupMessage();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages.length]);

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!group || !content.trim() || isPending) return;

    sendMessage(
      { groupId: group.id, content: content.trim() },
      { onSuccess: () => setContent("") },
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex flex-col p-0">
        <SheetHeader className="border-b border-border px-4 py-3">
          <SheetTitle className="flex items-center gap-2">
            <span className="text-lg">{group?.icon ?? "👥"}</span>
            {group?.name}
          </SheetTitle>
          <p className="text-xs text-muted-foreground">
            {group?.memberCount} {group?.memberCount === 1 ? "membro" : "membros"}
          </p>
        </SheetHeader>

        {/* Messages */}
        <ScrollArea className="flex-1 min-h-0">
          <div ref={scrollRef} className="flex flex-col-reverse gap-3 p-4">
            {isLoading && (
              <div className="flex justify-center py-8 text-sm text-muted-foreground">
                Carregando mensagens...
              </div>
            )}
            {!isLoading && messages.length === 0 && (
              <div className="flex justify-center py-8 text-sm text-muted-foreground">
                Nenhuma mensagem ainda. Seja o primeiro!
              </div>
            )}
            {messages.map((msg) => {
              const isOwn = msg.authorId === currentUserId;
              const authorName = msg.author?.name ?? "Usuário";
              return (
                <div
                  key={msg.id}
                  className={`flex gap-2 ${isOwn ? "flex-row-reverse" : ""}`}
                >
                  <Avatar className="h-7 w-7 shrink-0">
                    <AvatarFallback className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-[10px] font-semibold">
                      {getInitials(authorName)}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`flex flex-col gap-0.5 max-w-[75%] ${isOwn ? "items-end" : ""}`}
                  >
                    <span className="text-[10px] text-muted-foreground">
                      {authorName} • {formatRelativeTime(msg.createdAt)}
                    </span>
                    <div
                      className={`rounded-xl px-3 py-2 text-sm ${
                        isOwn
                          ? "bg-indigo-600 text-white"
                          : "bg-muted text-foreground"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>

        {/* Input */}
        <form
          onSubmit={handleSend}
          className="flex items-center gap-2 border-t border-border p-3"
        >
          <Input
            placeholder="Digite sua mensagem..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={2000}
            disabled={isPending}
            className="flex-1"
          />
          <Button
            type="submit"
            size="icon"
            disabled={!content.trim() || isPending}
            className="bg-indigo-600 hover:bg-indigo-700 text-white shrink-0"
          >
            <SendIcon className="h-4 w-4" />
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
