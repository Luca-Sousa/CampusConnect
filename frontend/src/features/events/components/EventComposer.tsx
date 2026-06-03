import { useState } from "react";
import { CalendarPlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  AppDialog,
  AppDialogBody,
  AppDialogContent,
  AppDialogFooter,
  AppDialogHeader,
} from "@/components/dialog";
import { EventForm, EVENT_FORM_ID } from "./forms/EventForm";
import type { EventPost } from "../types";

interface EventComposerProps {
  editingEvent?: EventPost | null;
  onEditClose?: () => void;
}

export function EventComposer({
  editingEvent = null,
  onEditClose,
}: EventComposerProps = {}) {
  const [createOpen, setCreateOpen] = useState(false);

  const isEdit = editingEvent != null;
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

  const headerTitle = isEdit ? "Editar evento" : "Novo evento";
  const headerDescription = isEdit
    ? "Atualize as informações do seu evento."
    : "Preencha os dados para criar um novo evento.";
  const submitLabel = isEdit ? "Salvar alterações" : "Criar evento";

  return (
    <>
      <Button
        onClick={() => setCreateOpen(true)}
        className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
      >
        <CalendarPlusIcon className="h-4 w-4" />
        Novo Evento
      </Button>

      <AppDialog open={open} onOpenChange={handleOpenChange}>
        <AppDialogContent maxWidth="2xl">
          <AppDialogHeader
            icon={CalendarPlusIcon}
            title={headerTitle}
            description={headerDescription}
          />

          <AppDialogBody>
            <EventForm
              mode={isEdit ? "edit" : "create"}
              event={editingEvent}
              onSuccess={handleSuccess}
            />
          </AppDialogBody>

          <AppDialogFooter>
            <Button
              type="submit"
              form={EVENT_FORM_ID}
              className="w-full! sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {submitLabel}
            </Button>
          </AppDialogFooter>
        </AppDialogContent>
      </AppDialog>
    </>
  );
}
