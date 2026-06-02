import { useForm } from "@tanstack/react-form"
import { CalendarIcon, MapPinIcon } from "lucide-react"

import { FieldGroup } from "@/components/ui/field"
import { showError, showSuccess } from "@/lib/toast"
import { FormInput } from "@/components/form/form-input"
import { FormTextarea } from "@/components/form/form-textarea"
import { EventDateTimePicker } from "@/components/form/event-date-time-picker"
import { useCreatePost } from "../../hooks/use-create-post"
import { useUpdatePost } from "../../hooks/use-update-post"
import {
  EVENT_CONTENT_MAX,
  eventPostEditSchema,
  eventPostSchema,
  type EventPostValues,
} from "../../schemas"
import { buildEditBody } from "../../utils/diff"
import { PostImageUpload } from "./post-image-upload"

export const EVENT_POST_FORM_ID = "post-form-event"

interface EventPostFormProps {
  onSuccess: () => void
  mode?: "create" | "edit"
  postId?: string
  defaultValues?: Partial<EventPostValues>
}

export function EventPostForm({
  onSuccess,
  mode = "create",
  postId,
  defaultValues,
}: EventPostFormProps) {
  const { mutateAsync: createPost } = useCreatePost()
  const { mutateAsync: updatePost } = useUpdatePost()

  // Em modo edit usamos o schema "relaxado" (sem checagem de passado) para
  // cobrir o caso (improvável mas possível) de um post com data passada
  // chegar até o form por race condition ou reload.
  const schema = mode === "edit" ? eventPostEditSchema : eventPostSchema

  const form = useForm({
    defaultValues: {
      eventTitle: defaultValues?.eventTitle ?? "",
      eventDate: defaultValues?.eventDate ?? "",
      eventTime: defaultValues?.eventTime ?? "",
      eventEndTime: defaultValues?.eventEndTime ?? "",
      eventLocation: defaultValues?.eventLocation ?? "",
      content: defaultValues?.content ?? "",
      imageUrl: defaultValues?.imageUrl ?? "",
    } as EventPostValues,
    validators: { onSubmit: schema },
    onSubmit: async ({ value }) => {
      try {
        if (mode === "edit" && postId) {
          // Backend espera `null` para `eventEndTime` quando vazio.
          const eventEndTime = value.eventEndTime || null
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
              eventTitle: defaultValues?.eventTitle ?? "",
              eventDate: defaultValues?.eventDate ?? "",
              eventTime: defaultValues?.eventTime ?? "",
              eventEndTime: defaultValues?.eventEndTime || null,
              eventLocation: defaultValues?.eventLocation ?? "",
              content: defaultValues?.content ?? "",
              imageUrl: defaultValues?.imageUrl ?? "",
            },
          )
          if (Object.keys(body).length === 0) {
            onSuccess()
            return
          }
          await updatePost({ id: postId, body })
          showSuccess("Evento atualizado com sucesso!")
        } else {
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
          await createPost(body)
          showSuccess("Evento publicado com sucesso!")
        }
        onSuccess()
      } catch (error) {
        showError(
          error instanceof Error
            ? error.message
            : mode === "edit"
              ? "Erro ao atualizar."
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
