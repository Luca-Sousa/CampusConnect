import type { AnyFieldApi } from "@tanstack/react-form"

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { Textarea } from "@/components/ui/textarea"

interface FormTextareaProps {
  field: AnyFieldApi
  label: string
  placeholder?: string
  description?: string
  rows?: number
  maxLength?: number
  showCounter?: boolean
  disabled?: boolean
}

function toErrors(errors: AnyFieldApi["state"]["meta"]["errors"]) {
  return errors.map((e) => ({
    message: typeof e === "string" ? e : (e as { message?: string })?.message,
  }))
}

export function FormTextarea({
  field,
  label,
  placeholder,
  description,
  rows = 5,
  maxLength,
  showCounter = false,
  disabled,
}: FormTextareaProps) {
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
  const value = (field.state.value as string) ?? ""

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      {showCounter && maxLength ? (
        <InputGroup>
          <InputGroupTextarea
            id={field.name}
            name={field.name}
            value={value}
            onBlur={field.handleBlur}
            onChange={(e) => field.handleChange(e.target.value)}
            placeholder={placeholder}
            rows={rows}
            maxLength={maxLength}
            disabled={disabled}
            aria-invalid={isInvalid}
            className="resize-none"
          />
          <InputGroupAddon align="block-end">
            <InputGroupText className="tabular-nums">
              {value.length}/{maxLength} caracteres
            </InputGroupText>
          </InputGroupAddon>
        </InputGroup>
      ) : (
        <Textarea
          id={field.name}
          name={field.name}
          value={value}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          maxLength={maxLength}
          disabled={disabled}
          aria-invalid={isInvalid}
          className="resize-none"
        />
      )}
      {description && <FieldDescription>{description}</FieldDescription>}
      {isInvalid && <FieldError errors={toErrors(field.state.meta.errors)} />}
    </Field>
  )
}
