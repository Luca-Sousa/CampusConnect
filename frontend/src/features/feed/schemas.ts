import { z } from "zod"

export const TEXT_CONTENT_MAX = 5000
export const IMAGE_CAPTION_MAX = 2000
export const EVENT_TITLE_MAX = 200
export const EVENT_LOCATION_MAX = 300
export const EVENT_CONTENT_MAX = 2000
export const NEWS_TITLE_MAX = 200
export const NEWS_CONTENT_MAX = 5000
export const IMAGE_MAX_BYTES = 2 * 1024 * 1024

// Helpers de validação temporal (compartilhados por todos os schemas que usam data/hora).
// YYYY-MM-DD e HH:mm são lexicograficamente ordenáveis, então comparação de string é segura.
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/
const ISO_TIME = /^\d{2}:\d{2}$/
const pad2 = (n: number) => String(n).padStart(2, "0")
const toIsoDate = (d: Date) =>
  `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`

export const textPostSchema = z.object({
  content: z
    .string()
    .min(1, "Escreva algo antes de publicar.")
    .max(TEXT_CONTENT_MAX, `Limite de ${TEXT_CONTENT_MAX} caracteres.`),
})

export const imagePostSchema = z.object({
  imageUrl: z.string().min(1, "Selecione uma imagem."),
  content: z
    .string()
    .max(IMAGE_CAPTION_MAX, `Legenda deve ter no máximo ${IMAGE_CAPTION_MAX} caracteres.`)
    .optional()
    .or(z.literal("")),
})

export const eventPostSchema = z
  .object({
    eventTitle: z
      .string()
      .min(1, "Título do evento obrigatório.")
      .max(EVENT_TITLE_MAX, `Título deve ter no máximo ${EVENT_TITLE_MAX} caracteres.`),
    eventDate: z
      .string()
      .regex(ISO_DATE, "Data inválida.")
      .min(1, "Data de início obrigatória."),
    eventTime: z
      .string()
      .regex(ISO_TIME, "Horário inválido.")
      .min(1, "Horário de início obrigatório."),
    eventEndTime: z
      .union([z.literal(""), z.string().regex(ISO_TIME, "Horário final inválido.")])
      .optional(),
    eventLocation: z
      .string()
      .min(1, "Local obrigatório.")
      .max(EVENT_LOCATION_MAX, `Local deve ter no máximo ${EVENT_LOCATION_MAX} caracteres.`),
    content: z
      .string()
      .max(EVENT_CONTENT_MAX, `Descrição deve ter no máximo ${EVENT_CONTENT_MAX} caracteres.`)
      .optional()
      .or(z.literal("")),
    imageUrl: z
      .string()
      .optional()
      .or(z.literal("")),
  })
  .superRefine((val, ctx) => {
    // Validação em local time (BRT). Backend revalida em UTC; diferença de até 3h é aceitável.
    const now = new Date()
    const todayIso = toIsoDate(now)
    const nowHHmm = `${pad2(now.getHours())}:${pad2(now.getMinutes())}`

    if (val.eventDate < todayIso) {
      ctx.addIssue({
        code: "custom",
        path: ["eventDate"],
        message: "Data de início não pode ser no passado.",
      })
    } else if (val.eventDate === todayIso && val.eventTime <= nowHHmm) {
      ctx.addIssue({
        code: "custom",
        path: ["eventTime"],
        message: "Horário deve ser posterior ao atual.",
      })
    }

    if (val.eventEndTime && val.eventEndTime <= val.eventTime) {
      ctx.addIssue({
        code: "custom",
        path: ["eventEndTime"],
        message: "Horário final deve ser posterior ao inicial.",
      })
    }
  })

export const newsPostSchema = z.object({
  newsTitle: z
    .string()
    .min(1, "Título da notícia obrigatório.")
    .max(NEWS_TITLE_MAX, `Título deve ter no máximo ${NEWS_TITLE_MAX} caracteres.`),
  content: z
    .string()
    .min(1, "Conteúdo da notícia obrigatório.")
    .max(NEWS_CONTENT_MAX, `Conteúdo deve ter no máximo ${NEWS_CONTENT_MAX} caracteres.`),
  imageUrl: z
    .string()
    .optional()
    .or(z.literal("")),
})

export type TextPostValues = z.infer<typeof textPostSchema>
export type ImagePostValues = z.infer<typeof imagePostSchema>
export type EventPostValues = z.infer<typeof eventPostSchema>
export type NewsPostValues = z.infer<typeof newsPostSchema>

/**
 * Schema de edição de evento — igual ao de criação MAS sem o `superRefine`
 * temporal (passado + mesmo-dia). A UI desabilita a edição de eventos que
 * já começaram, então não precisamos rejeitar a salvamento. Mantemos a
 * invariante `eventEndTime > eventTime` para o usuário não salvar um range
 * inválido.
 */
export const eventPostEditSchema = z
  .object({
    eventTitle: z
      .string()
      .min(1, "Título do evento obrigatório.")
      .max(EVENT_TITLE_MAX, `Título deve ter no máximo ${EVENT_TITLE_MAX} caracteres.`),
    eventDate: z
      .string()
      .regex(ISO_DATE, "Data inválida.")
      .min(1, "Data de início obrigatória."),
    eventTime: z
      .string()
      .regex(ISO_TIME, "Horário inválido.")
      .min(1, "Horário de início obrigatório."),
    eventEndTime: z
      .union([z.literal(""), z.string().regex(ISO_TIME, "Horário final inválido.")])
      .optional(),
    eventLocation: z
      .string()
      .min(1, "Local obrigatório.")
      .max(EVENT_LOCATION_MAX, `Local deve ter no máximo ${EVENT_LOCATION_MAX} caracteres.`),
    content: z
      .string()
      .max(EVENT_CONTENT_MAX, `Descrição deve ter no máximo ${EVENT_CONTENT_MAX} caracteres.`)
      .optional()
      .or(z.literal("")),
    imageUrl: z
      .string()
      .optional()
      .or(z.literal("")),
  })
  .superRefine((val, ctx) => {
    if (val.eventEndTime && val.eventEndTime <= val.eventTime) {
      ctx.addIssue({
        code: "custom",
        path: ["eventEndTime"],
        message: "Horário final deve ser posterior ao inicial.",
      })
    }
  })

export type EventPostEditValues = z.infer<typeof eventPostEditSchema>
