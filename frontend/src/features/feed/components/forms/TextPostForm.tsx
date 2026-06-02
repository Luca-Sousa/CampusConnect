import { useForm } from "@tanstack/react-form"

import { FieldGroup } from "@/components/ui/field"
import { showError, showSuccess } from "@/lib/toast"
import { FormTextarea } from "@/components/form/form-textarea"
import { useCreatePost } from "../../hooks/use-create-post"
import { useUpdatePost } from "../../hooks/use-update-post"
import {
  TEXT_CONTENT_MAX,
  textPostSchema,
  type TextPostValues,
} from "../../schemas"
import { buildEditBody } from "../../utils/diff"

export const TEXT_POST_FORM_ID = "post-form-text"

interface TextPostFormProps {
  onSuccess: () => void
  mode?: "create" | "edit"
  postId?: string
  defaultValues?: Partial<TextPostValues>
}

export function TextPostForm({
  onSuccess,
  mode = "create",
  postId,
  defaultValues,
}: TextPostFormProps) {
  const { mutateAsync: createPost } = useCreatePost()
  const { mutateAsync: updatePost } = useUpdatePost()

  const form = useForm({
    defaultValues: {
      content: defaultValues?.content ?? "",
    } as TextPostValues,
    validators: { onSubmit: textPostSchema },
    onSubmit: async ({ value }) => {
      try {
        if (mode === "edit" && postId) {
          const body = buildEditBody(
            { content: value.content },
            { content: defaultValues?.content ?? "" },
          )
          if (Object.keys(body).length === 0) {
            onSuccess()
            return
          }
          await updatePost({ id: postId, body })
          showSuccess("Publicação atualizada com sucesso!")
        } else {
          await createPost({ type: "text", content: value.content.trim() })
          showSuccess("Publicação criada com sucesso!")
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
      id={TEXT_POST_FORM_ID}
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
    </form>
  )
}
