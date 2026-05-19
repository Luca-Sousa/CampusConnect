import { APIError } from "better-auth";
import { isAlunoEmail, isValidIfceEmail } from "./ifce-email";

type UserBeforeCreate = { email: string } & Record<string, unknown>;

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

export const authDatabaseHooks = {
  user: {
    create: {
      before: beforeUserCreate,
    },
  },
};
