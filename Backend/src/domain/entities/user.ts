export type UserRole = "aluno" | "colaborador" | "admin";

export type UserCargo =
  | "aluno"
  | "professor"
  | "coordenador"
  | "direcao"
  | "administracao"
  | "secretaria"
  | "centro_academico"
  | "biblioteca"
  | "ti";

export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  course: string | null;
  bio: string | null;
  role: UserRole;
  cargo: UserCargo;
  createdAt: Date;
  updatedAt: Date;
}
