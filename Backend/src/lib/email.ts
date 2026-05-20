import nodemailer from "nodemailer";
import { env } from "../env";

export interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

let _transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
  if (!_transporter) {
    _transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_PORT === 465,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
    });
  }
  return _transporter;
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

  try {
    await getTransporter().sendMail({
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
