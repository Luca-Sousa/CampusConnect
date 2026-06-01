import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { i18n } from "@better-auth/i18n";
import { db } from "../drizzle/client";
import { user, session, account, verification } from "../drizzle/schema/auth";
import { env } from "../env";
import { ptBR } from "./auth-i18n";
import { authDatabaseHooks } from "./auth-hooks";
import { emailOTP } from "better-auth/plugins";
import { sendEmail } from "./email";
import {
  buildOtpEmailHtml,
  buildResetPasswordOtpEmailHtml,
  buildSignInOtpEmailHtml,
} from "./email-templates";

type OtpType =
  | "email-verification"
  | "forget-password"
  | "sign-in"
  | "change-email";

const OTP_EMAIL_CONFIG: Record<
  OtpType,
  { subject: string; buildHtml: (otp: string) => string }
> = {
  "email-verification": {
    subject: "Código de verificação - CampusConnect",
    buildHtml: buildOtpEmailHtml,
  },
  "forget-password": {
    subject: "Redefinição de senha - CampusConnect",
    buildHtml: buildResetPasswordOtpEmailHtml,
  },
  "sign-in": {
    subject: "Seu código de acesso - CampusConnect",
    buildHtml: buildSignInOtpEmailHtml,
  },
  "change-email": {
    subject: "Código de alteração de e-mail - CampusConnect",
    buildHtml: buildOtpEmailHtml,
  },
};

export const auth = betterAuth({
  secret: env.BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: { user, session, account, verification },
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "aluno",
      },
      cargo: {
        type: "string",
        required: false,
      },
    },
  },
  databaseHooks: authDatabaseHooks,
  trustedOrigins: [env.FRONTEND_URL, env.BACKEND_URL],
  advanced: {
    database: {
      generateId: "uuid",
    },
    defaultCookieAttributes: {
      sameSite: "none",
      secure: true,
      httpOnly: true,
    },
  },
  plugins: [
    i18n({
      defaultLocale: "pt",
      detection: ["callback"],
      getLocale: () => "pt",
      translations: { pt: ptBR },
    }),
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        const config = OTP_EMAIL_CONFIG[type as OtpType];
        if (!config) return;
        await sendEmail({
          to: email,
          subject: config.subject,
          html: config.buildHtml(otp),
        });
      },
      sendVerificationOnSignUp: true,
      expiresIn: 300,
      otpLength: 6,
    }),
  ],
});
