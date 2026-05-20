import type { AnyFieldApi } from "@tanstack/react-form"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

interface FormInputProps {
  field: AnyFieldApi
  label: string
  type?: string
  placeholder?: string
  subLabel?: React.ReactNode
}

function toErrors(errors: AnyFieldApi["state"]["meta"]["errors"]) {
  return errors.map((e) => ({
    message: typeof e === "string" ? e : (e as { message?: string })?.message,
  }))
}

export function FormInput({ field, label, type = "text", placeholder, subLabel  }: FormInputProps) {
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
      />
      {isInvalid && <FieldError errors={toErrors(field.state.meta.errors)} />}
    </Field>
  )
}
