import { z } from "zod";

// ——— Helper de normalização para o body do PUT ———
// Convenção de três estados:
//  - chave AUSENTE no body → retorna `undefined` (sentinela: "não tocar no DB")
//  - chave presente com `null` ou `""` → retorna `null` (limpar explicitamente)
//  - chave presente com string não-vazia → retorna a string (atualizar)
//
// Isso evita o bug antigo em que editar um campo que não era imagem
// apagava a imagem existente, porque a rota normalizava campo ausente
// para `null` e o repositório sempre incluía o campo no UPDATE.
export function pickField(
  body: Record<string, unknown>,
  key: string,
): string | null | undefined {
  if (!(key in body)) return undefined;
  const v = body[key];
  if (v === null) return null;
  if (typeof v === "string") return v === "" ? null : v;
  return undefined;
}

// ——— Helpers de validação temporal ———
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const ISO_TIME = /^\d{2}:\d{2}$/;
const pad2 = (n: number) => String(n).padStart(2, "0");
const toIsoDate = (d: Date) =>
  `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;

// ——— Schema de validação ———
export const eventSchema = z
  .object({
    type: z.literal("event"),
    content: z.string().max(2000).optional(),
    eventTitle: z
      .string()
      .min(1, "Título do evento obrigatório.")
      .max(200),
    eventDate: z
      .string()
      .regex(ISO_DATE, "Data inválida.")
      .min(1, "Data de início obrigatória."),
    eventTime: z
      .string()
      .regex(ISO_TIME, "Horário inválido.")
      .min(1, "Horário de início obrigatório."),
    eventEndTime: z
      .union([
        z.literal(""),
        z.string().regex(ISO_TIME, "Horário final inválido."),
      ])
      .optional(),
    eventLocation: z
      .string()
      .min(1, "Local obrigatório.")
      .max(300),
    imageUrl: z
      .union([z.literal(""), z.string().min(1)])
      .optional(),
  })
  .superRefine((val, ctx) => {
    const now = new Date();
    const todayIso = toIsoDate(now);
    const nowHHmm = `${pad2(now.getHours())}:${pad2(now.getMinutes())}`;
    if (val.eventDate < todayIso) {
      ctx.addIssue({
        code: "custom",
        path: ["eventDate"],
        message: "Data de início não pode ser no passado.",
      });
    } else if (val.eventDate === todayIso && val.eventTime <= nowHHmm) {
      ctx.addIssue({
        code: "custom",
        path: ["eventTime"],
        message: "Horário deve ser posterior ao atual.",
      });
    }
    if (val.eventEndTime && val.eventEndTime <= val.eventTime) {
      ctx.addIssue({
        code: "custom",
        path: ["eventEndTime"],
        message: "Horário final deve ser posterior ao inicial.",
      });
    }
  });

export const createPostSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("text"),
    content: z.string().min(1, "Conteúdo obrigatório.").max(5000),
  }),
  z.object({
    type: z.literal("image"),
    content: z.string().max(2000).optional(),
    imageUrl: z.string().min(1, "Imagem obrigatória."),
  }),
  eventSchema,
  z.object({
    type: z.literal("news"),
    newsTitle: z.string().min(1, "Título obrigatório.").max(200),
    content: z.string().min(1, "Conteúdo obrigatório.").max(5000),
    imageUrl: z
      .union([z.literal(""), z.string().min(1)])
      .optional(),
  }),
]);

export const updateEventSchema = z
  .object({
    eventTitle: z
      .string()
      .min(1, "Título do evento obrigatório.")
      .max(200),
    eventDate: z
      .string()
      .regex(ISO_DATE, "Data inválida.")
      .min(1, "Data de início obrigatória."),
    eventTime: z
      .string()
      .regex(ISO_TIME, "Horário inválido.")
      .min(1, "Horário de início obrigatório."),
    eventEndTime: z
      .union([
        z.literal(""),
        z.string().regex(ISO_TIME, "Horário final inválido."),
      ])
      .nullable()
      .optional(),
    eventLocation: z
      .string()
      .min(1, "Local obrigatório.")
      .max(300),
    content: z.string().max(2000).nullable().optional(),
    imageUrl: z
      .union([z.literal(""), z.string().min(1)])
      .nullable()
      .optional(),
  })
  .superRefine((val, ctx) => {
    if (val.eventEndTime && val.eventEndTime <= val.eventTime) {
      ctx.addIssue({
        code: "custom",
        path: ["eventEndTime"],
        message: "Horário final deve ser posterior ao inicial.",
      });
    }
  });

export const updatePostSchema = z.union([
  z.object({
    content: z.string().min(1, "Conteúdo obrigatório.").max(5000),
  }),
  z.object({
    content: z.string().max(2000).nullable().optional(),
    imageUrl: z.string().min(1, "Imagem obrigatória.").nullable().optional(),
  }),
  updateEventSchema,
  z.object({
    newsTitle: z.string().min(1, "Título obrigatório.").max(200),
    content: z.string().min(1, "Conteúdo obrigatório.").max(5000),
    imageUrl: z
      .union([z.literal(""), z.string().min(1)])
      .nullable()
      .optional(),
  }),
]);
