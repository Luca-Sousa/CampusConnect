import { APIError } from "better-auth";
import { eq } from "drizzle-orm";
import { db } from "../database/client.js";
import { user } from "../database/schema/auth.schema.js";
import {
  isAlunoEmail,
  isValidIfceEmail,
} from "../../domain/value-objects/ifce-email.js";
import { emailService } from "../email/nodemailer.service.js";
import {
  buildWelcomeEmailHtml,
  buildPasswordChangedEmailHtml,
} from "../email/templates.js";

type UserBeforeCreate = { email: string } & Record<string, unknown>;
type UserAfterCreate = {
  id: string;
  email: string;
  name: string;
} & Record<string, unknown>;
type AccountAfterUpdate = {
  userId: string;
  providerId: string;
} & Record<string, unknown>;

async function beforeUserCreate(data: UserBeforeCreate) {
  if (!isValidIfceEmail(data.email)) {
    throw new APIError("BAD_REQUEST", {
      message:
        "Use seu e-mail institucional do IFCE (@aluno.ifce.edu.br ou @ifce.edu.br).",
    });
  }

  if (isAlunoEmail(data.email)) {
    return { data: { ...data, role: "aluno", cargo: "aluno" } };
  }
}

async function afterUserCreate(data: UserAfterCreate): Promise<void> {
  emailService
    .send({
      to: data.email,
      subject: "Bem-vindo ao CampusConnect!",
      html: buildWelcomeEmailHtml(data.name),
    })
    .catch(console.error);
}

async function afterAccountUpdate(account: AccountAfterUpdate): Promise<void> {
  if (account.providerId !== "credential") return;

  const found = await db.query.user
    .findFirst({ where: eq(user.id, account.userId as string) })
    .catch(() => null);

  if (!found) return;

  emailService
    .send({
      to: found.email,
      subject: "Senha alterada - CampusConnect",
      html: buildPasswordChangedEmailHtml(found.name),
    })
    .catch(console.error);
}

export const authDatabaseHooks = {
  user: {
    create: {
      before: beforeUserCreate,
      after: afterUserCreate,
    },
  },
  account: {
    update: {
      after: afterAccountUpdate,
    },
  },
};
