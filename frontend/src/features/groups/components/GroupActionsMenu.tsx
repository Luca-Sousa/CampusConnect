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
import { useDeleteGroup } from "../hooks/use-delete-group";
import type { Group } from "../types";

interface GroupActionsMenuProps {
  group: Group;
  onEdit: (group: Group) => void;
}

export function GroupActionsMenu({ group, onEdit }: GroupActionsMenuProps) {
  const [alertOpen, setAlertOpen] = useState(false);
  const { mutate: deleteGroup, isPending } = useDeleteGroup();

  const handleConfirmDelete = () => {
    deleteGroup(group.id, {
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
            aria-label="Ações do grupo"
            className="h-8 w-8 shrink-0"
          >
            <MoreHorizontalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-44">
          <DropdownMenuItem onSelect={() => onEdit(group)}>
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
            <AlertDialogTitle>Excluir grupo?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Todas as mensagens do grupo
              serão removidas permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="rounded-md border bg-muted/40 p-3 text-sm space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-base">
                {group.icon ?? "👥"}
              </div>
              <div>
                <p className="font-semibold text-foreground leading-snug">
                  {group.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {group.memberCount}{" "}
                  {group.memberCount === 1 ? "membro" : "membros"}
                </p>
              </div>
            </div>
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
