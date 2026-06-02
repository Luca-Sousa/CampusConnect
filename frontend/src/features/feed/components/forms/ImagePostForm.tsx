import { useForm } from "@tanstack/react-form"

import { FieldGroup } from "@/components/ui/field"
import { showError, showSuccess } from "@/lib/toast"
import { FormTextarea } from "@/components/form/form-textarea"
import { useCreatePost } from "../../hooks/use-create-post"
import { useUpdatePost } from "../../hooks/use-update-post"
import {
  IMAGE_CAPTION_MAX,
  imagePostSchema,
  type ImagePostValues,
} from "../../schemas"
import { buildEditBody } from "../../utils/diff"
import { PostImageUpload } from "./post-image-upload"

export const IMAGE_POST_FORM_ID = "post-form-image"

interface ImagePostFormProps {
  onSuccess: () => void
  mode?: "create" | "edit"
  postId?: string
  defaultValues?: Partial<ImagePostValues>
}

export function ImagePostForm({
  onSuccess,
  mode = "create",
  postId,
  defaultValues,
}: ImagePostFormProps) {
  const { mutateAsync: createPost } = useCreatePost()
  const { mutateAsync: updatePost } = useUpdatePost()

  const form = useForm({
    defaultValues: {
      imageUrl: defaultValues?.imageUrl ?? "",
      content: defaultValues?.content ?? "",
    } as ImagePostValues,
    validators: { onSubmit: imagePostSchema },
    onSubmit: async ({ value }) => {
      try {
        if (mode === "edit" && postId) {
          // Só envia os campos que mudaram. A imagem é incluída apenas se o
          // usuário a trocou (upload novo ou remoção via X). A legenda é
          // incluída se o texto mudou — inclusive para `null` se o usuário
          // apagou. Isso garante que o backend NÃO toque na imagem existente
          // quando o usuário só mexe na legenda.
          const body = buildEditBody(
            { content: value.content, imageUrl: value.imageUrl },
            {
              content: defaultValues?.content ?? "",
              imageUrl: defaultValues?.imageUrl ?? "",
            },
          )
          if (Object.keys(body).length === 0) {
            onSuccess()
            return
          }
          await updatePost({ id: postId, body })
          showSuccess("Publicação atualizada com sucesso!")
        } else {
          const body: Record<string, unknown> = {
            type: "image",
            imageUrl: value.imageUrl,
          }
          const trimmed = value.content?.trim()
          if (trimmed) body.content = trimmed
          await createPost(body)
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
