import { useForm } from "@tanstack/react-form"
import { CalendarIcon, MapPinIcon } from "lucide-react"

import { FieldGroup } from "@/components/ui/field"
import { showError, showSuccess } from "@/lib/toast"
import { FormInput } from "@/components/form/form-input"
import { FormTextarea } from "@/components/form/form-textarea"
import { EventDateTimePicker } from "@/components/form/event-date-time-picker"
import { useCreatePost } from "../../hooks/use-create-post"
import {
  EVENT_CONTENT_MAX,
  eventPostSchema,
  type EventPostValues,
} from "../../schemas"
import { PostImageUpload } from "./post-image-upload"

export const EVENT_POST_FORM_ID = "post-form-event"

interface EventPostFormProps {
  onSuccess: () => void
}

export function EventPostForm({ onSuccess }: EventPostFormProps) {
  const { mutateAsync } = useCreatePost()

  const form = useForm({
    defaultValues: {
      eventTitle: "",
      eventDate: "",
      eventTime: "",
      eventEndTime: "",
      eventLocation: "",
      content: "",
      imageUrl: "",
    } as EventPostValues,
    validators: { onSubmit: eventPostSchema },
    onSubmit: async ({ value }) => {
      try {
        const body: Record<string, unknown> = {
          type: "event",
          eventTitle: value.eventTitle.trim(),
          eventDate: value.eventDate,
          eventTime: value.eventTime,
          eventEndTime: value.eventEndTime || null,
          eventLocation: value.eventLocation.trim(),
        }
        const trimmed = value.content?.trim()
        if (trimmed) body.content = trimmed
        const imageUrl = value.imageUrl?.trim()
        if (imageUrl) body.imageUrl = imageUrl
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
      id={EVENT_POST_FORM_ID}
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
              field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <PostImageUpload
                id={field.name}
                value={field.state.value}
                onChange={field.handleChange}
                onBlur={field.handleBlur}
                isInvalid={isInvalid}
                errors={field.state.meta.errors}
                label="Imagem do evento (opcional)"
                description="Adicione uma imagem para o evento (opcional)."
              />
            )
          }}
        </form.Field>
      </FieldGroup>
    </form>
  )
}
