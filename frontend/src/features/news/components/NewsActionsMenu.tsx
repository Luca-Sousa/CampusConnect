import { useState } from "react";
import {
  MoreHorizontalIcon,
  PencilIcon,
  Trash2Icon,
  TrashIcon,
} from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteNews } from "../hooks/use-delete-news";
import type { NewsPost } from "../types";

const PREVIEW_MAX = 140;

interface NewsActionsMenuProps {
  news: NewsPost;
  onEdit: (news: NewsPost) => void;
}

export function NewsActionsMenu({ news, onEdit }: NewsActionsMenuProps) {
  const [alertOpen, setAlertOpen] = useState(false);
  const { mutate: deleteNews, isPending } = useDeleteNews();

  const handleConfirmDelete = () => {
    deleteNews(news.id, {
      onSuccess: () => setAlertOpen(false),
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Ações do comunicado"
            className="[&_svg]:size-4"
          >
            <MoreHorizontalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-44">
          <DropdownMenuItem onSelect={() => onEdit(news)}>
            <PencilIcon />
            Editar
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onSelect={(e) => {
              e.preventDefault();
              setAlertOpen(true);
            }}
          >
            <Trash2Icon />
            Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
              <Trash2Icon />
            </AlertDialogMedia>
            <AlertDialogTitle>Excluir comunicado?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O comunicado será removido
              permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="rounded-md border bg-muted/40 p-3 text-sm space-y-1.5">
            <p className="font-semibold text-foreground leading-snug">
              {news.newsTitle}
            </p>
            {news.content && (
              <p className="text-foreground/80 whitespace-pre-wrap">
                {news.content.length > PREVIEW_MAX
                  ? `${news.content.slice(0, PREVIEW_MAX)}…`
                  : news.content}
              </p>
            )}
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel variant="outline" disabled={isPending} size="lg">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isPending}
              variant="destructive"
              size="lg"
            >
              <TrashIcon className="size-4" />
              {isPending ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
