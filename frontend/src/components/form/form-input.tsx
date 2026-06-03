import { useState } from "react"
import type { AnyFieldApi } from "@tanstack/react-form"
import { Eye, EyeOff } from "lucide-react"

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface FormInputProps {
  field: AnyFieldApi
  label: React.ReactNode
  type?: string
  placeholder?: string
  description?: string
  subLabel?: React.ReactNode
  autoComplete?: string
  disabled?: boolean
  showPasswordToggle?: boolean
}

function toErrors(errors: AnyFieldApi["state"]["meta"]["errors"]) {
  return errors.map((e) => ({
    message: typeof e === "string" ? e : (e as { message?: string })?.message,
  }))
}

export function FormInput({
  field,
  label,
  type = "text",
  placeholder,
  description,
  subLabel,
  autoComplete,
  disabled,
  showPasswordToggle,
}: FormInputProps) {
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
  const [visible, setVisible] = useState(false)
  const isPassword = type === "password"
  const inputType = isPassword && showPasswordToggle ? (visible ? "text" : "password") : type

  return (
    <Field data-invalid={isInvalid}>
      <div className="flex items-center justify-between">
        <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
        {subLabel}
      </div>
      <div className="relative">
        <Input
          id={field.name}
          name={field.name}
          type={inputType}
          placeholder={placeholder}
          value={field.state.value as string}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
          aria-invalid={isInvalid}
          autoComplete={autoComplete}
          disabled={disabled}
          className={isPassword && showPasswordToggle ? "pr-10" : undefined}
        />
        {isPassword && showPasswordToggle && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setVisible((v) => !v)}
            tabIndex={-1}
          >
            {visible ? (
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Eye className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
        )}
      </div>
      {description && <FieldDescription>{description}</FieldDescription>}
      {isInvalid && <FieldError errors={toErrors(field.state.meta.errors)} />}
    </Field>
  )
}
