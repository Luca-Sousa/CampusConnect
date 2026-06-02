import { useForm } from "@tanstack/react-form"

import { Button } from "@/components/ui/button"
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

interface NewsPostFormProps {
  onSuccess: () => void
}

export function NewsPostForm({ onSuccess }: NewsPostFormProps) {
  const { mutateAsync, isPending } = useCreatePost()

  const form = useForm({
    defaultValues: { newsTitle: "", content: "" } as NewsPostValues,
    validators: { onSubmit: newsPostSchema },
    onSubmit: async ({ value }) => {
      try {
        await mutateAsync({
          type: "news",
          newsTitle: value.newsTitle.trim(),
          content: value.content.trim(),
        })
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
      </FieldGroup>
      <form.Subscribe selector={(state) => state.isSubmitting}>
        {(isSubmitting) => (
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || isPending}
          >
            {isSubmitting || isPending ? "Publicando..." : "Publicar comunicado"}
          </Button>
        )}
      </form.Subscribe>
    </form>
  )
}
