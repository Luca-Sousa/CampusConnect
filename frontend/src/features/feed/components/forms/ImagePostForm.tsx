import { useForm } from "@tanstack/react-form"

import { FieldGroup } from "@/components/ui/field"
import { showError, showSuccess } from "@/lib/toast"
import { FormTextarea } from "@/components/form/form-textarea"
import { useCreatePost } from "../../hooks/use-create-post"
import {
  IMAGE_CAPTION_MAX,
  imagePostSchema,
  type ImagePostValues,
} from "../../schemas"
import { PostImageUpload } from "./post-image-upload"

export const IMAGE_POST_FORM_ID = "post-form-image"

interface ImagePostFormProps {
  onSuccess: () => void
}

export function ImagePostForm({ onSuccess }: ImagePostFormProps) {
  const { mutateAsync } = useCreatePost()

  const form = useForm({
    defaultValues: { imageUrl: "", content: "" } as ImagePostValues,
    validators: { onSubmit: imagePostSchema },
    onSubmit: async ({ value }) => {
      try {
        const body: Record<string, unknown> = {
          type: "image",
          imageUrl: value.imageUrl,
        }
        const trimmed = value.content?.trim()
        if (trimmed) body.content = trimmed
        await mutateAsync(body)
        showSuccess("Publicação criada com sucesso!")
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
      id={IMAGE_POST_FORM_ID}
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      className="space-y-4"
    >
      <FieldGroup>
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
              />
            )
          }}
        </form.Field>

        <form.Field name="content">
          {(field) => (
            <FormTextarea
              field={field}
              label="Legenda (opcional)"
              placeholder="Escreva uma legenda para a imagem..."
              rows={3}
              maxLength={IMAGE_CAPTION_MAX}
            />
          )}
        </form.Field>
      </FieldGroup>
    </form>
  )
}
