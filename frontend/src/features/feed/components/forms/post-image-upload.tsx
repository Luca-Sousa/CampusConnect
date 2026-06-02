import { useRef } from "react"
import { ImageIcon, XIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { showError } from "@/lib/toast"
import { IMAGE_MAX_BYTES } from "@/features/feed/schemas"

interface PostImageUploadProps {
  value: string | undefined
  onChange: (next: string) => void
  onBlur?: () => void
  isInvalid?: boolean
  errors?: Array<{ message?: string } | string | undefined>
  label?: string
  description?: string
  id: string
}

function toErrors(errors: Array<{ message?: string } | string | undefined> | undefined) {
  return (errors ?? []).map((e) => ({
    message: typeof e === "string" ? e : e?.message,
  }))
}

export function PostImageUpload({
  value,
  onChange,
  onBlur,
  isInvalid,
  errors,
  label = "Imagem",
  description = "Formatos suportados: JPEG, PNG, GIF, WebP.",
  id,
}: PostImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
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
      if (typeof dataUrl === "string") onChange(dataUrl)
    }
    reader.readAsDataURL(file)
  }

  function clearImage() {
    onChange("")
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Input
        id={id}
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        className="hidden"
        onChange={handleFileChange}
        onBlur={onBlur}
      />
      {value ? (
        <div className="relative">
          <img
            src={value}
            alt="Prévia da imagem"
            className="w-full max-h-60 sm:max-h-72 object-cover rounded-md border"
          />
          <Button
            type="button"
            variant="secondary"
            size="icon-sm"
            onClick={clearImage}
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
      <FieldDescription>{description}</FieldDescription>
      {isInvalid && <FieldError errors={toErrors(errors)} />}
    </Field>
  )
}
