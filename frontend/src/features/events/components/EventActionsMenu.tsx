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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useDeleteEvent } from "../hooks/use-delete-event";
import { isEventInPast } from "@/features/feed/utils/format";
import type { EventPost } from "../types";

const PREVIEW_MAX = 140;

interface EventActionsMenuProps {
  event: EventPost;
  onEdit: (event: EventPost) => void;
  variant?: "default" | "banner";
}

export function EventActionsMenu({
  event,
  onEdit,
  variant = "default",
}: EventActionsMenuProps) {
  const [alertOpen, setAlertOpen] = useState(false);
  const { mutate: deleteEvent, isPending } = useDeleteEvent();

  const editingDisabled = isEventInPast(event);

  const handleConfirmDelete = () => {
    deleteEvent(event.id, {
      onSuccess: () => setAlertOpen(false),
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
            aria-label="Ações do evento"
            className={triggerClass}
          >
            <MoreHorizontalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-44">
          <Tooltip>
            <TooltipTrigger asChild disabled={!editingDisabled}>
              <DropdownMenuItem
                disabled={editingDisabled}
                onSelect={(e) => {
                  if (editingDisabled) {
                    e.preventDefault();
                    return;
                  }
                  onEdit(event);
                }}
              >
                <PencilIcon />
                Editar
              </DropdownMenuItem>
            </TooltipTrigger>
            {editingDisabled && (
              <TooltipContent side="left">
                Eventos passados não podem ser editados.
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

      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
              <Trash2Icon />
            </AlertDialogMedia>
            <AlertDialogTitle>Excluir evento?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O evento será removido
              permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="rounded-md border bg-muted/40 p-3 text-sm space-y-1.5">
            <p className="font-semibold text-foreground leading-snug">
              {event.eventTitle}
            </p>
            {event.content && (
              <p className="text-foreground/80 whitespace-pre-wrap">
                {event.content.length > PREVIEW_MAX
                  ? `${event.content.slice(0, PREVIEW_MAX)}…`
                  : event.content}
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
