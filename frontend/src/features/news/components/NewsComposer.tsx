import { useState } from "react";
import { NewspaperIcon, SquarePenIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  AppDialog,
  AppDialogBody,
  AppDialogContent,
  AppDialogFooter,
  AppDialogHeader,
} from "@/components/dialog";
import { NewsForm, NEWS_FORM_ID } from "./forms/NewsForm";
import type { NewsPost } from "../types";

interface NewsComposerProps {
  editingNews?: NewsPost | null;
  onEditClose?: () => void;
  canPublish: boolean;
}

export function NewsComposer({
  editingNews = null,
  onEditClose,
  canPublish,
}: NewsComposerProps) {
  const [createOpen, setCreateOpen] = useState(false);

  const isEdit = editingNews != null;
  const open = isEdit || createOpen;

  const handleOpenChange = (next: boolean) => {
    setCreateOpen(next);
    if (!next && isEdit) {
      onEditClose?.();
    }
  };

  const handleSuccess = () => {
    setCreateOpen(false);
    if (isEdit) {
      onEditClose?.();
    }
  };

  const headerTitle = isEdit ? "Editar comunicado" : "Novo comunicado";
  const headerDescription = isEdit
    ? "Atualize as informações do comunicado."
    : "Publique um comunicado oficial para a comunidade.";
  const submitLabel = isEdit ? "Salvar alterações" : "Publicar comunicado";

  if (!canPublish && !isEdit) return null;

  return (
    <>
      <Button
        onClick={() => setCreateOpen(true)}
        className="gap-2 bg-amber-600 hover:bg-amber-700 text-white"
      >
        <NewspaperIcon className="h-4 w-4" />
        <span className="hidden sm:inline">Novo Comunicado</span>
      </Button>

      <AppDialog open={open} onOpenChange={handleOpenChange}>
        <AppDialogContent maxWidth="2xl">
          <AppDialogHeader
            icon={SquarePenIcon}
            title={headerTitle}
            description={headerDescription}
          />

          <AppDialogBody>
            <NewsForm
              mode={isEdit ? "edit" : "create"}
              news={editingNews}
              onSuccess={handleSuccess}
            />
          </AppDialogBody>

          <AppDialogFooter>
            <Button
              type="submit"
              form={NEWS_FORM_ID}
              className="w-full! sm:w-auto bg-amber-600 hover:bg-amber-700 text-white"
            >
              {submitLabel}
            </Button>
          </AppDialogFooter>
        </AppDialogContent>
      </AppDialog>
    </>
  );
}
