import nodemailer from "nodemailer";
import { env } from "../../shared/env.js";
import type {
  IEmailService,
  SendEmailInput,
} from "../../domain/ports/services/email.service.js";

class NodemailerEmailService implements IEmailService {
  private _transporter: nodemailer.Transporter | null = null;

  private getTransporter(): nodemailer.Transporter {
    if (!this._transporter) {
      this._transporter = nodemailer.createTransport({
        host: env.SMTP_HOST,
        port: env.SMTP_PORT,
        secure: env.SMTP_PORT === 465,
        auth: {
          user: env.SMTP_USER,
          pass: env.SMTP_PASS,
        },
      });
    }
    return this._transporter;
  }

  async send({ to, subject, html }: SendEmailInput): Promise<void> {
    if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASS) {
      console.warn(`[Email DEV] Para: ${to} | Assunto: ${subject}`);
      return;
    }

    try {
      await this.getTransporter().sendMail({
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
}

/** Singleton para injeção de dependência. */
export const emailService = new NodemailerEmailService();
