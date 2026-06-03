import { useForm } from "@tanstack/react-form";
import { CalendarIcon, MapPinIcon } from "lucide-react";

import { FieldGroup } from "@/components/ui/field";
import { showError, showSuccess } from "@/lib/toast";
import { FormInput } from "@/components/form/form-input";
import { FormTextarea } from "@/components/form/form-textarea";
import { EventDateTimePicker } from "@/components/form/event-date-time-picker";
import {
  EVENT_CONTENT_MAX,
  eventPostEditSchema,
  eventPostSchema,
  type EventPostValues,
} from "@/features/feed/schemas";
import { buildEditBody } from "@/features/feed/utils/diff";
import { useCreateEvent } from "../../hooks/use-create-event";
import { useUpdateEvent } from "../../hooks/use-update-event";
import { PostImageUpload } from "@/features/feed/components/forms/post-image-upload";
import type { EventPost } from "../../types";

export const EVENT_FORM_ID = "event-form";

interface EventFormProps {
  onSuccess: () => void;
  mode?: "create" | "edit";
  event?: EventPost | null;
}

export function EventForm({
  onSuccess,
  mode = "create",
  event,
}: EventFormProps) {
  const { mutateAsync: createEvent } = useCreateEvent();
  const { mutateAsync: updateEvent } = useUpdateEvent();

  const schema = mode === "edit" ? eventPostEditSchema : eventPostSchema;

  const defaultValues = {
    eventTitle: event?.eventTitle ?? "",
    eventDate: event?.eventDate ?? "",
    eventTime: event?.eventTime ?? "",
    eventEndTime: event?.eventEndTime ?? "",
    eventLocation: event?.eventLocation ?? "",
    content: event?.content ?? "",
    imageUrl: event?.imageUrl ?? "",
  };

  const form = useForm({
    defaultValues: defaultValues as EventPostValues,
    validators: { onSubmit: schema },
    onSubmit: async ({ value }) => {
      try {
        if (mode === "edit" && event) {
          const eventEndTime = value.eventEndTime || null;
          const body = buildEditBody(
            {
              eventTitle: value.eventTitle.trim(),
              eventDate: value.eventDate,
              eventTime: value.eventTime,
              eventEndTime,
              eventLocation: value.eventLocation.trim(),
              content: value.content,
              imageUrl: value.imageUrl,
            },
            {
              eventTitle: event.eventTitle ?? "",
              eventDate: event.eventDate ?? "",
              eventTime: event.eventTime ?? "",
              eventEndTime: event.eventEndTime || null,
              eventLocation: event.eventLocation ?? "",
              content: event.content ?? "",
              imageUrl: event.imageUrl ?? "",
            },
          );
          if (Object.keys(body).length === 0) {
            onSuccess();
            return;
          }
          await updateEvent({ id: event.id, body });
          showSuccess("Evento atualizado com sucesso!");
        } else {
          const body: Record<string, unknown> = {
            type: "event",
            eventTitle: value.eventTitle.trim(),
            eventDate: value.eventDate,
            eventTime: value.eventTime,
            eventEndTime: value.eventEndTime || null,
            eventLocation: value.eventLocation.trim(),
          };
          const trimmed = value.content?.trim();
          if (trimmed) body.content = trimmed;
          const imageUrl = value.imageUrl?.trim();
          if (imageUrl) body.imageUrl = imageUrl;
          await createEvent(body);
          showSuccess("Evento publicado com sucesso!");
        }
        onSuccess();
      } catch (error) {
        showError(
          error instanceof Error
            ? error.message
            : mode === "edit"
              ? "Erro ao atualizar."
              : "Erro ao publicar.",
        );
      }
    },
  });

  return (
    <form
      id={EVENT_FORM_ID}
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-4"
    >
      <FieldGroup>
        <form.Field name="eventTitle">
          {(field) => (
            <FormInput
              field={field}
              label="Título do evento"
              placeholder="Ex: Semana de TI 2026"
            />
          )}
        </form.Field>

        <form.Field name="eventDate">
          {(dateField) => (
            <form.Field name="eventTime">
              {(timeField) => (
                <form.Field name="eventEndTime">
                  {(endTimeField) => (
                    <EventDateTimePicker
                      dateField={dateField}
                      startTimeField={timeField}
                      endTimeField={endTimeField}
                      label={
                        <span className="flex items-center gap-1.5">
                          <CalendarIcon className="h-3.5 w-3.5" />
                          Data e horário
                        </span>
                      }
                    />
                  )}
                </form.Field>
              )}
            </form.Field>
          )}
        </form.Field>

        <form.Field name="eventLocation">
          {(field) => (
            <FormInput
              field={field}
              label={
                <span className="flex items-center gap-1.5">
                  <MapPinIcon className="h-3.5 w-3.5" />
                  Local
                </span>
              }
              placeholder="Ex: Auditório Principal - IFCE"
            />
          )}
        </form.Field>

        <form.Field name="content">
          {(field) => (
            <FormTextarea
              field={field}
              label="Descrição (opcional)"
              placeholder="Detalhes do evento..."
              rows={3}
              maxLength={EVENT_CONTENT_MAX}
            />
          )}
        </form.Field>

        <form.Field name="imageUrl">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <PostImageUpload
                id={field.name}
                value={field.state.value}
                onChange={field.handleChange}
                onBlur={field.handleBlur}
                isInvalid={isInvalid}
                errors={field.state.meta.errors}
                label="Imagem do evento (opcional)"
                description="Adicione uma imagem para o evento."
              />
            );
          }}
        </form.Field>
      </FieldGroup>
    </form>
  );
}
