import { z } from "zod";

export const createGroupSchema = z.object({
  name: z.string().min(1, "Nome obrigatório.").max(200),
  description: z.string().max(2000).optional(),
  icon: z.string().max(10).nullable().optional(),
});

export const updateGroupSchema = z.object({
  name: z.string().min(1, "Nome obrigatório.").max(200).optional(),
  description: z.string().max(2000).nullable().optional(),
  icon: z.string().max(10).nullable().optional(),
});

export const sendMessageSchema = z.object({
  content: z.string().min(1, "Mensagem obrigatória.").max(2000),
});
