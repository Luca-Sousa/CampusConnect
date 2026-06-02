import { z } from "zod"

export const TEXT_CONTENT_MAX = 5000
export const IMAGE_CAPTION_MAX = 2000
export const EVENT_TITLE_MAX = 200
export const EVENT_LOCATION_MAX = 300
export const EVENT_CONTENT_MAX = 2000
export const NEWS_TITLE_MAX = 200
export const NEWS_CONTENT_MAX = 5000
export const IMAGE_MAX_BYTES = 2 * 1024 * 1024

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

export const eventPostSchema = z.object({
  eventTitle: z
    .string()
    .min(1, "Título do evento obrigatório.")
    .max(EVENT_TITLE_MAX, `Título deve ter no máximo ${EVENT_TITLE_MAX} caracteres.`),
  eventDate: z.string().min(1, "Data obrigatória."),
  eventTime: z.string().min(1, "Horário obrigatório."),
  eventLocation: z
    .string()
    .min(1, "Local obrigatório.")
    .max(EVENT_LOCATION_MAX, `Local deve ter no máximo ${EVENT_LOCATION_MAX} caracteres.`),
  content: z
    .string()
    .max(EVENT_CONTENT_MAX, `Descrição deve ter no máximo ${EVENT_CONTENT_MAX} caracteres.`)
    .optional()
    .or(z.literal("")),
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
})

export type TextPostValues = z.infer<typeof textPostSchema>
export type ImagePostValues = z.infer<typeof imagePostSchema>
export type EventPostValues = z.infer<typeof eventPostSchema>
export type NewsPostValues = z.infer<typeof newsPostSchema>
