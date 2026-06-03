import { useState } from "react";
import { UsersIcon } from "lucide-react";
import {
  AppDialog,
  AppDialogAction,
  AppDialogBody,
  AppDialogContent,
  AppDialogFooter,
  AppDialogHeader,
} from "@/components/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreateGroup } from "../hooks/use-create-group";
import { useUpdateGroup } from "../hooks/use-update-group";
import { EmojiPickerPopover } from "./EmojiPickerPopover";
import type { Group } from "../types";

interface GroupFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingGroup?: Group | null;
}

function GroupFormContent({
  editingGroup,
  onOpenChange,
}: {
  editingGroup: Group | null;
  onOpenChange: (open: boolean) => void;
}) {
  const [name, setName] = useState(editingGroup?.name ?? "");
  const [description, setDescription] = useState(editingGroup?.description ?? "");
  const [icon, setIcon] = useState<string | null>(editingGroup?.icon ?? null);

  const { mutate: createGroup, isPending: isCreating } = useCreateGroup();
  const { mutate: updateGroup, isPending: isUpdating } = useUpdateGroup();

  const isPending = isCreating || isUpdating;
  const isEditing = !!editingGroup;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (isEditing && editingGroup) {
      updateGroup(
        {
          id: editingGroup.id,
          body: { name, description: description || null, icon },
        },
        { onSuccess: () => onOpenChange(false) },
      );
    } else {
      createGroup(
        { name, description: description || undefined, icon },
        { onSuccess: () => onOpenChange(false) },
      );
    }
  }

  return (
    <>
      <AppDialogHeader
        icon={UsersIcon}
        title={isEditing ? "Editar Grupo" : "Novo Grupo"}
        description={
          isEditing
            ? "Atualize as informações do grupo."
            : "Crie um novo grupo para a comunidade."
        }
      />
      <AppDialogBody>
        <form id="group-form" onSubmit={handleSubmit} className="space-y-4">
          {/* Emoji picker */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Ícone do grupo
            </label>
            <EmojiPickerPopover
              value={icon}
              onChange={setIcon}
              disabled={isPending}
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="group-name"
              className="text-sm font-medium text-foreground"
            >
              Nome *
            </label>
            <Input
              id="group-name"
              placeholder="Ex: Engenharia de Software"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={200}
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="group-desc"
              className="text-sm font-medium text-foreground"
            >
              Descrição
            </label>
            <Textarea
              id="group-desc"
              placeholder="Sobre o que é este grupo..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              maxLength={2000}
            />
          </div>
        </form>
      </AppDialogBody>
      <AppDialogFooter>
        <AppDialogAction
          type="submit"
          form="group-form"
          disabled={isPending || !name.trim()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white w-full"
        >
          {isEditing ? "Salvar" : "Criar Grupo"}
        </AppDialogAction>
      </AppDialogFooter>
    </>
  );
}

export function GroupForm({
  open,
  onOpenChange,
  editingGroup,
}: GroupFormProps) {
  return (
    <AppDialog open={open} onOpenChange={onOpenChange}>
      <AppDialogContent maxWidth="md">
        {/* key forces remount when editingGroup changes, avoiding setState in effect */}
        <GroupFormContent
          key={editingGroup?.id ?? "create"}
          editingGroup={editingGroup ?? null}
          onOpenChange={onOpenChange}
        />
      </AppDialogContent>
    </AppDialog>
  );
}
