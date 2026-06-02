import { useForm } from "@tanstack/react-form"
import { CalendarIcon, ClockIcon, MapPinIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { FieldGroup } from "@/components/ui/field"
import { showError, showSuccess } from "@/lib/toast"
import { FormInput } from "@/components/form/form-input"
import { FormTextarea } from "@/components/form/form-textarea"
import { useCreatePost } from "../../hooks/use-create-post"
import {
  EVENT_CONTENT_MAX,
  eventPostSchema,
  type EventPostValues,
} from "../../schemas"

interface EventPostFormProps {
  onSuccess: () => void
}

export function EventPostForm({ onSuccess }: EventPostFormProps) {
  const { mutateAsync, isPending } = useCreatePost()

  const form = useForm({
    defaultValues: {
      eventTitle: "",
      eventDate: "",
      eventTime: "",
      eventLocation: "",
      content: "",
    } as EventPostValues,
    validators: { onSubmit: eventPostSchema },
    onSubmit: async ({ value }) => {
      try {
        const body: Record<string, unknown> = {
          type: "event",
          eventTitle: value.eventTitle.trim(),
          eventDate: value.eventDate,
          eventTime: value.eventTime,
          eventLocation: value.eventLocation.trim(),
        }
        const trimmed = value.content?.trim()
        if (trimmed) body.content = trimmed
        await mutateAsync(body)
        showSuccess("Evento publicado com sucesso!")
        onSuccess()
      } catch (error) {
        showError(
          error instanceof Error
            ? error.message
            : "Erro ao publicar.",
        )
      }
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <form.Field name="eventDate">
            {(field) => (
              <FormInput
                field={field}
                label={
                  <span className="flex items-center gap-1.5">
                    <CalendarIcon className="h-3.5 w-3.5" />
                    Data
                  </span>
                }
                type="date"
              />
            )}
          </form.Field>
          <form.Field name="eventTime">
            {(field) => (
              <FormInput
                field={field}
                label={
                  <span className="flex items-center gap-1.5">
                    <ClockIcon className="h-3.5 w-3.5" />
                    Horário
                  </span>
                }
                type="time"
              />
            )}
          </form.Field>
        </div>

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
      </FieldGroup>
      <form.Subscribe selector={(state) => state.isSubmitting}>
        {(isSubmitting) => (
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || isPending}
          >
            {isSubmitting || isPending ? "Publicando..." : "Publicar evento"}
          </Button>
        )}
      </form.Subscribe>
    </form>
  )
}
