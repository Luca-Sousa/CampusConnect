import * as React from "react"
import type { ReactNode } from "react"
import type { AnyFieldApi } from "@tanstack/react-form"
import { format, parse, startOfDay, startOfToday } from "date-fns"
import { ptBR } from "react-day-picker/locale"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { CalendarIcon, Clock2Icon } from "lucide-react"

interface EventDateTimePickerProps {
  dateField: AnyFieldApi
  startTimeField: AnyFieldApi
  endTimeField: AnyFieldApi
  label: ReactNode
  disabled?: boolean
}

function toErrors(errors: AnyFieldApi["state"]["meta"]["errors"]) {
  return errors.map((e) => ({
    message: typeof e === "string" ? e : (e as { message?: string })?.message,
  }))
}

function parseIsoDate(value: string): Date | undefined {
  if (!value) return undefined
  try {
    const d = parse(value, "yyyy-MM-dd", new Date())
    return Number.isNaN(d.getTime()) ? undefined : d
  } catch {
    return undefined
  }
}

function formatIsoDate(date: Date | undefined): string {
  if (!date) return ""
  return format(startOfDay(date), "yyyy-MM-dd")
}

function formatTriggerLabel(args: {
  date: string
  startTime: string
  endTime: string
}): string {
  const { date, startTime, endTime } = args
  if (!date) return "Selecione data e horário"

  const d = parseIsoDate(date)
  if (!d) return "Selecione data e horário"

  const dFormatted = format(d, "d 'de' MMMM 'de' yyyy", { locale: ptBR })

  const start = startTime ? `${startTime}h` : ""
  const end = endTime ? `${endTime}h` : ""

  if (!start && !end) return dFormatted
  if (start && end) return `${dFormatted}, ${start} às ${end}`
  return `${dFormatted}, ${start}`
}

export function EventDateTimePicker({
  dateField,
  startTimeField,
  endTimeField,
  label,
  disabled,
}: EventDateTimePickerProps) {
  const [open, setOpen] = React.useState(false)

  const date = dateField.state.value as string
  const startTime = startTimeField.state.value as string
  const endTime = endTimeField.state.value as string

  const isInvalid =
    (dateField.state.meta.isTouched && !dateField.state.meta.isValid) ||
    (startTimeField.state.meta.isTouched && !startTimeField.state.meta.isValid) ||
    (endTimeField.state.meta.isTouched && !endTimeField.state.meta.isValid)

  const selected = date ? parseIsoDate(date) : undefined

  const labelText = formatTriggerLabel({ date, startTime, endTime })

  const allErrors = [
    ...dateField.state.meta.errors,
    ...startTimeField.state.meta.errors,
    ...endTimeField.state.meta.errors,
  ]
  const errorArray = toErrors(allErrors)

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel>{label}</FieldLabel>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            disabled={disabled}
            data-empty={!date}
            className={cn(
              "w-full min-h-12 justify-start text-left font-normal whitespace-normal",
              !date && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="h-4 w-4 shrink-0" />
            <span className="whitespace-normal leading-tight text-left">
              {labelText}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0"
          align="start"
          sideOffset={6}
        >
          <Calendar
            mode="single"
            locale={ptBR}
            selected={selected}
            onSelect={(next) => dateField.handleChange(formatIsoDate(next))}
            disabled={(d) => startOfDay(d) < startOfToday()}
            startMonth={new Date()}
            numberOfMonths={1}
            defaultMonth={selected ?? new Date()}
            className="rounded-md border-0 pb-0"
          />
          <div className="border-t p-3">
            <FieldGroup className="grid grid-cols-2 gap-3">
              <Field>
                <FieldLabel htmlFor="event-time-start">Início</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id="event-time-start"
                    type="time"
                    value={startTime}
                    onBlur={startTimeField.handleBlur}
                    onChange={(e) =>
                      startTimeField.handleChange(e.target.value)
                    }
                    className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                  />
                  <InputGroupAddon>
                    <Clock2Icon className="text-muted-foreground" />
                  </InputGroupAddon>
                </InputGroup>
              </Field>
              <Field>
                <FieldLabel htmlFor="event-time-end">Fim (opcional)</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id="event-time-end"
                    type="time"
                    value={endTime}
                    onBlur={endTimeField.handleBlur}
                    onChange={(e) => endTimeField.handleChange(e.target.value)}
                    className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                  />
                  <InputGroupAddon>
                    <Clock2Icon className="text-muted-foreground" />
                  </InputGroupAddon>
                </InputGroup>
              </Field>
            </FieldGroup>
          </div>
        </PopoverContent>
      </Popover>
      {isInvalid && errorArray.length > 0 && (
        <FieldError errors={errorArray} />
      )}
    </Field>
  )
}
