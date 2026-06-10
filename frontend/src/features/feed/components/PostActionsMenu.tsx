import { useState } from "react";
import {
  CalendarIcon,
  CheckCircleIcon,
  ImageIcon,
  NewspaperIcon,
  MoreHorizontalIcon,
  PencilIcon,
  TextIcon,
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useDeletePost } from "../hooks/use-delete-post";
import { useApprovePost } from "../hooks/use-approve-post";
import { isEventInPast } from "../utils/format";
import type { Post } from "../types";
import { canManagePost } from "@/lib/permissions";

const PREVIEW_MAX = 140;

const TYPE_LABEL: Record<Post["type"], string> = {
  text: "Texto",
  image: "Foto",
  event: "Evento",
  news: "Comunicado oficial",
};

const TYPE_ICON: Record<Post["type"], typeof TextIcon> = {
  text: TextIcon,
  image: ImageIcon,
  event: CalendarIcon,
  news: NewspaperIcon,
};

interface PostActionsMenuProps {
  post: Post;
  onEdit: (post: Post) => void;
  variant?: "default" | "banner";
  currentUserRole?: string;
  currentUserCargo?: string;
}

/**
 * Menu de ações do dono (ou admin) de um post.
 *
 * Encapsula:
 *  - `<DropdownMenu>` com as ações **Aprovar** (se admin + moderado), **Editar** e **Excluir**.
 *  - `<AlertDialog>` de confirmação para a exclusão, com prévia do post.
 *
 * Comportamentos:
 *  - Em eventos passados, "Editar" fica **desabilitado** com tooltip
 *    explicativo — apenas a exclusão permanece disponível.
 *  - O dropdown suporta dois visuais: `default` (ícone neutro sobre
 *    `bg-card`) e `banner` (ícone claro para uso sobre o gradiente do
 *    card de evento).
 */
export function PostActionsMenu({
  post,
  onEdit,
  variant = "default",
  currentUserRole,
  currentUserCargo,
}: PostActionsMenuProps) {
  const [alertOpen, setAlertOpen] = useState(false);
  const [approveAlertOpen, setApproveAlertOpen] = useState(false);
  const { mutate: deletePost, isPending } = useDeletePost();
  const { mutate: approvePost, isPending: isApproving } = useApprovePost();

  const editingDisabled = post.type === "event" && isEventInPast(post);
  const isModerated = post.moderated === true;
  const canApprove = isModerated && canManagePost(currentUserRole, currentUserCargo);

  const handleConfirmDelete = () => {
    deletePost(post.id, {
      onSuccess: () => setAlertOpen(false),
    });
  };

  const handleConfirmApprove = () => {
    approvePost(post.id, {
      onSuccess: () => setApproveAlertOpen(false),
    });
  };

  const triggerClass =
    variant === "banner"
      ? "p-1.5 rounded-full hover:bg-white/15 text-white/70 hover:text-white transition-colors [&_svg]:size-4"
      : "[&_svg]:size-4";

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Ações da publicação"
            className={triggerClass}
          >
            <MoreHorizontalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-44">
          {canApprove && (
            <>
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  setApproveAlertOpen(true);
                }}
              >
                <CheckCircleIcon className="text-green-500" />
                Aprovar publicação
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          <Tooltip>
            <TooltipTrigger
              asChild
              disabled={!editingDisabled}
            >
              <DropdownMenuItem
                disabled={editingDisabled}
                onSelect={(e) => {
                  if (editingDisabled) {
                    e.preventDefault();
                    return;
                  }
                  onEdit(post);
                }}
              >
                <PencilIcon />
                Editar
              </DropdownMenuItem>
            </TooltipTrigger>
            {editingDisabled && (
              <TooltipContent side="left">
                Eventos passados não podem ser editados. Apenas excluídos.
              </TooltipContent>
            )}
          </Tooltip>
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

      {/* Approve confirmation dialog */}
      <AlertDialog open={approveAlertOpen} onOpenChange={setApproveAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400">
              <CheckCircleIcon />
            </AlertDialogMedia>
            <AlertDialogTitle>Aprovar publicação?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta publicação foi retida pela moderação de IA. Ao aprovar, ela
              será publicada normalmente no feed e todos os usuários poderão
              vê-la.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <PostPreview post={post} />

          <AlertDialogFooter>
            <AlertDialogCancel variant="outline" disabled={isApproving} size="lg">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmApprove}
              disabled={isApproving}
              className="bg-green-600 hover:bg-green-700 text-white"
              size="lg"
            >
              <CheckCircleIcon className="size-4" />
              {isApproving ? "Aprovando..." : "Aprovar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete confirmation dialog */}
      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
              <Trash2Icon />
            </AlertDialogMedia>
            <AlertDialogTitle>Excluir publicação?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. A publicação será removida
              permanentemente do feed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <PostPreview post={post} />

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

// ---------------------------------------------------------------------------
// PostPreview — prévia do conteúdo exibida no AlertDialog de confirmação
// ---------------------------------------------------------------------------

function PostPreview({ post }: { post: Post }) {
  const Icon = TYPE_ICON[post.type];
  const title =
    post.type === "event"
      ? post.eventTitle
      : post.type === "news"
        ? post.newsTitle
        : null;
  const body = post.content?.trim() ?? "";
  const preview =
    body.length > PREVIEW_MAX ? `${body.slice(0, PREVIEW_MAX)}…` : body;

  return (
    <div className="rounded-md border bg-muted/40 p-3 text-sm space-y-1.5">
      <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
        <Icon className="size-3.5" />
        {TYPE_LABEL[post.type]}
      </div>
      {title && (
        <p className="font-semibold text-foreground leading-snug">{title}</p>
      )}
      {preview && (
        <p className="text-foreground/80 whitespace-pre-wrap">{preview}</p>
      )}
      {!title && !preview && (
        <p className="text-muted-foreground italic">(sem conteúdo)</p>
      )}
    </div>
  );
}
