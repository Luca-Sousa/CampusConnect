import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().min(1, "Nome obrigatório.").max(200),
  image: z.string().max(500000).nullable().optional(),
  course: z.string().max(200).nullable().optional(),
  bio: z.string().max(500).nullable().optional(),
});

export type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>;
