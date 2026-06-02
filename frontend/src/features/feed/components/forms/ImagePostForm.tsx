import { useRef } from "react"
import { useForm } from "@tanstack/react-form"
import { ImageIcon, XIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import { FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { showError, showSuccess } from "@/lib/toast"
import { FormTextarea } from "@/components/form/form-textarea"
import { useCreatePost } from "../../hooks/use-create-post"
import {
  IMAGE_CAPTION_MAX,
  IMAGE_MAX_BYTES,
  imagePostSchema,
  type ImagePostValues,
} from "../../schemas"

interface ImagePostFormProps {
  onSuccess: () => void
}

function toErrors(errors: Array<{ message?: string } | string | undefined>) {
  return errors.map((e) => ({
    message: typeof e === "string" ? e : e?.message,
  }))
}

export function ImagePostForm({ onSuccess }: ImagePostFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { mutateAsync, isPending } = useCreatePost()

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

  function handleFileChange(
    e: React.ChangeEvent<HTMLInputElement>,
    setValue: (v: string) => void,
  ) {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > IMAGE_MAX_BYTES) {
      showError("A imagem deve ter no máximo 2 MB.")
      e.target.value = ""
      return
    }

    const reader = new FileReader()
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result
      if (typeof dataUrl === "string") {
        setValue(dataUrl)
      }
    }
    reader.readAsDataURL(file)
  }

  function clearImage(
    setValue: (v: string) => void,
  ) {
    setValue("")
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

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
        <form.Field name="imageUrl">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid
            const preview = field.state.value
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Imagem</FieldLabel>
                <Input
                  id={field.name}
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  className="hidden"
                  onChange={(e) => handleFileChange(e, field.handleChange)}
                  onBlur={field.handleBlur}
                />
                {preview ? (
                  <div className="relative">
                    <img
                      src={preview}
                      alt="Prévia da imagem"
                      className="w-full max-h-60 sm:max-h-72 object-cover rounded-md border"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon-sm"
                      onClick={() => clearImage(field.handleChange)}
                      className="absolute top-2 right-2 rounded-full"
                      aria-label="Remover imagem"
                    >
                      <XIcon />
                    </Button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-32 sm:h-40 rounded-md border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center gap-2 text-sm text-muted-foreground hover:bg-muted/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <ImageIcon className="h-8 w-8 opacity-40" />
                    <span>Clique para selecionar uma imagem (máx. 2 MB)</span>
                  </button>
                )}
                <FieldDescription>
                  Formatos suportados: JPEG, PNG, GIF, WebP.
                </FieldDescription>
                {isInvalid && (
                  <FieldError errors={toErrors(field.state.meta.errors)} />
                )}
              </Field>
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
