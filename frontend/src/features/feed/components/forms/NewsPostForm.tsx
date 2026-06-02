import { useForm } from "@tanstack/react-form"

import { FieldGroup } from "@/components/ui/field"
import { showError, showSuccess } from "@/lib/toast"
import { FormInput } from "@/components/form/form-input"
import { FormTextarea } from "@/components/form/form-textarea"
import { useCreatePost } from "../../hooks/use-create-post"
import {
  NEWS_CONTENT_MAX,
  newsPostSchema,
  type NewsPostValues,
} from "../../schemas"
import { PostImageUpload } from "./post-image-upload"

export const NEWS_POST_FORM_ID = "post-form-news"

interface NewsPostFormProps {
  onSuccess: () => void
}

export function NewsPostForm({ onSuccess }: NewsPostFormProps) {
  const { mutateAsync } = useCreatePost()

  const form = useForm({
    defaultValues: {
      newsTitle: "",
      content: "",
      imageUrl: "",
    } as NewsPostValues,
    validators: { onSubmit: newsPostSchema },
    onSubmit: async ({ value }) => {
      try {
        const body: Record<string, unknown> = {
          type: "news",
          newsTitle: value.newsTitle.trim(),
          content: value.content.trim(),
        }
        const imageUrl = value.imageUrl?.trim()
        if (imageUrl) body.imageUrl = imageUrl
        await mutateAsync(body)
        showSuccess("Comunicado publicado com sucesso!")
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
      id={NEWS_POST_FORM_ID}
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      className="space-y-4"
    >
      <FieldGroup>
        <form.Field name="newsTitle">
          {(field) => (
            <FormInput
              field={field}
              label="Título do comunicado"
              placeholder="Ex: Inscrições abertas para o ENEM 2026"
            />
          )}
        </form.Field>
        <form.Field name="content">
          {(field) => (
            <FormTextarea
              field={field}
              label="Conteúdo"
              placeholder="Descreva a notícia..."
              rows={5}
              maxLength={NEWS_CONTENT_MAX}
              showCounter
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
                label="Imagem do comunicado (opcional)"
                description="Adicione uma imagem de capa para o comunicado (opcional)."
              />
            )
          }}
        </form.Field>
      </FieldGroup>
    </form>
  )
}
