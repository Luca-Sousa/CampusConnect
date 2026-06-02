import { useForm } from "@tanstack/react-form"

import { Button } from "@/components/ui/button"
import { FieldGroup } from "@/components/ui/field"
import { showError, showSuccess } from "@/lib/toast"
import { FormTextarea } from "@/components/form/form-textarea"
import { useCreatePost } from "../../hooks/use-create-post"
import {
  TEXT_CONTENT_MAX,
  textPostSchema,
  type TextPostValues,
} from "../../schemas"

interface TextPostFormProps {
  onSuccess: () => void
}

export function TextPostForm({ onSuccess }: TextPostFormProps) {
  const { mutateAsync, isPending } = useCreatePost()

  const form = useForm({
    defaultValues: { content: "" } as TextPostValues,
    validators: { onSubmit: textPostSchema },
    onSubmit: async ({ value }) => {
      try {
        await mutateAsync({ type: "text", content: value.content.trim() })
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
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      className="space-y-4"
    >
      <FieldGroup>
        <form.Field name="content">
          {(field) => (
            <FormTextarea
              field={field}
              label="O que você está pensando?"
              placeholder="Compartilhe algo com a comunidade..."
              rows={5}
              maxLength={TEXT_CONTENT_MAX}
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
            {isSubmitting || isPending ? "Publicando..." : "Publicar"}
          </Button>
        )}
      </form.Subscribe>
    </form>
  )
}
