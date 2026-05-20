import { z } from "zod";

const ALUNO_DOMAIN = "@aluno.ifce.edu.br";
const IFCE_DOMAIN = "@ifce.edu.br";

const isAlunoEmail = (e: string) => e.toLowerCase().endsWith(ALUNO_DOMAIN);
const isIfceEmail = (e: string) => e.toLowerCase().endsWith(IFCE_DOMAIN);
const isColaboradorEmail = (e: string) => isIfceEmail(e) && !isAlunoEmail(e);

export const alunoSchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres."),
  email: z
    .email("E-mail inválido.")
    .refine(isAlunoEmail, { message: "Use um e-mail @aluno.ifce.edu.br." }),
  password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres."),
});

export const colaboradorSchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres."),
  email: z.email("E-mail inválido.").refine(isColaboradorEmail, {
    message: "Use um e-mail @ifce.edu.br (não de aluno).",
  }),
  password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres."),
  cargo: z.string().min(1, "Selecione seu cargo."),
});

export const signinSchema = z.object({
  email: z
    .email("E-mail inválido.")
    .refine((e) => isAlunoEmail(e) || isIfceEmail(e), {
      message: "Use seu e-mail institucional do IFCE.",
    }),
  password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres."),
});

export const otpSchema = z.object({
  otp: z.string().length(6, "O código deve ter 6 dígitos."),
});

export type AlunoFormValues = z.infer<typeof alunoSchema>;
export type ColaboradorFormValues = z.infer<typeof colaboradorSchema>;
export type SigninFormValues = z.infer<typeof signinSchema>;
export type OTPFormValues = z.infer<typeof otpSchema>;

export const forgotPasswordSchema = z.object({
  email: z
    .email("E-mail inválido.")
    .refine((e) => isAlunoEmail(e) || isIfceEmail(e), {
      message: "Use seu e-mail institucional do IFCE.",
    }),
});

export const signinOtpSchema = z.object({
  email: z
    .email("E-mail inválido.")
    .refine((e) => isAlunoEmail(e) || isIfceEmail(e), {
      message: "Use seu e-mail institucional do IFCE.",
    }),
});

export const resetPasswordSchema = z
  .object({
    otp: z.string().length(6, "O código deve ter 6 dígitos."),
    password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres."),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
  });

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
export type SigninOtpFormValues = z.infer<typeof signinOtpSchema>;
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
