import { useState } from "react";
import { VideoIcon, ImageIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function PostComposer() {
  const [post, setPost] = useState("");

  return (
    <Dialog>
      <Card className="shadow-sm">
        <CardContent className="p-4 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 shrink-0 ring-2 ring-orange-100">
              <AvatarFallback className="bg-linear-to-br from-orange-400 to-rose-400 text-white font-semibold text-sm">
                LA
              </AvatarFallback>
            </Avatar>

            <DialogTrigger asChild>
              <div className="flex-1 bg-muted/50 rounded-full px-4 py-2.5 cursor-pointer text-sm text-muted-foreground hover:bg-muted transition-colors select-none">
                O que você está pensando?
              </div>
            </DialogTrigger>
          </div>

          <div className="flex gap-1 pt-1 border-t">
            <Button variant="ghost" size="sm" className="flex-1 gap-2 text-muted-foreground">
              <VideoIcon className="h-4 w-4" />
              Vídeo
            </Button>
            <Button variant="ghost" size="sm" className="flex-1 gap-2 text-muted-foreground">
              <ImageIcon className="h-4 w-4" />
              Foto
            </Button>
          </div>
        </CardContent>
      </Card>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar publicação</DialogTitle>
        </DialogHeader>

        <textarea
          value={post}
          onChange={(e) => setPost(e.target.value)}
          placeholder="No que você está pensando?"
          className="w-full min-h-[150px] border rounded-md p-3"
        />

        <Button className="w-full mt-4">
          Publicar
        </Button>
      </DialogContent>
    </Dialog>
  );
}