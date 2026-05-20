import { APIError } from "better-auth";
import { eq } from "drizzle-orm";
import { db } from "../drizzle/client";
import * as schema from "../drizzle/schema/auth";
import { isAlunoEmail, isValidIfceEmail } from "./ifce-email";
import { sendEmail } from "./email";
import {
  buildWelcomeEmailHtml,
  buildPasswordChangedEmailHtml,
} from "./email-templates";

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

async function beforeUserCreate(user: UserBeforeCreate) {
  if (!isValidIfceEmail(user.email)) {
    throw new APIError("BAD_REQUEST", {
      message:
        "Use seu e-mail institucional do IFCE (@aluno.ifce.edu.br ou @ifce.edu.br).",
    });
  }

  if (isAlunoEmail(user.email)) {
    return { data: { ...user, role: "aluno", cargo: "aluno" } };
  }
}

async function afterUserCreate(user: UserAfterCreate): Promise<void> {
  sendEmail({
    to: user.email,
    subject: "Bem-vindo ao CampusConnect!",
    html: buildWelcomeEmailHtml(user.name),
  }).catch(console.error);
}

async function afterAccountUpdate(
  account: AccountAfterUpdate,
): Promise<void> {
  if (account.providerId !== "credential") return;

  const user = await db.query.user
    .findFirst({ where: eq(schema.user.id, account.userId as string) })
    .catch(() => null);

  if (!user) return;

  sendEmail({
    to: user.email,
    subject: "Senha alterada - CampusConnect",
    html: buildPasswordChangedEmailHtml(user.name),
  }).catch(console.error);
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
