import type { AnyFieldApi } from "@tanstack/react-form"

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

interface FormInputProps {
  field: AnyFieldApi
  label: React.ReactNode
  type?: string
  placeholder?: string
  description?: string
  subLabel?: React.ReactNode
  autoComplete?: string
  disabled?: boolean
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
}: FormInputProps) {
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  return (
    <Field data-invalid={isInvalid}>
      <div className="flex items-center justify-between">
        <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
        {subLabel}
      </div>
      <Input
        id={field.name}
        name={field.name}
        type={type}
        placeholder={placeholder}
        value={field.state.value as string}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        aria-invalid={isInvalid}
        autoComplete={autoComplete}
        disabled={disabled}
      />
      {description && <FieldDescription>{description}</FieldDescription>}
      {isInvalid && <FieldError errors={toErrors(field.state.meta.errors)} />}
    </Field>
  )
}
