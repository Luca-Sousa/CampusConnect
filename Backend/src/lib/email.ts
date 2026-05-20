import nodemailer from "nodemailer";
import { env } from "../env";

export interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

/**
 * Envia um e-mail via SMTP.
 * Se as variáveis SMTP não estiverem configuradas, loga no console (modo dev).
 */
export async function sendEmail({ to, subject, html }: SendEmailParams): Promise<void> {
  if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASS) {
    console.warn(`[Email DEV] Para: ${to} | Assunto: ${subject}`);
    return;
  }

  const transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: env.SMTP_FROM ?? env.SMTP_USER,
      to,
      subject,
      html,
    });
    console.log(`[Email] ✓ Enviado para: ${to} | Assunto: ${subject}`);
  } catch (err) {
    console.error(`[Email] ✗ Falha ao enviar para: ${to}`, err);
    throw err;
  }
}
