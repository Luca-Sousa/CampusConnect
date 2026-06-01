CREATE TYPE "public"."user_cargo" AS ENUM('aluno', 'professor', 'coordenador', 'direcao', 'administracao', 'secretaria', 'centro_academico', 'biblioteca', 'ti');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('aluno', 'colaborador', 'admin');--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "role" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "role" SET DATA TYPE "public"."user_role" USING "role"::text::"public"."user_role";--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT 'aluno';--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "cargo" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "cargo" SET DATA TYPE "public"."user_cargo" USING "cargo"::text::"public"."user_cargo";--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "cargo" SET DEFAULT 'aluno';--> statement-breakpoint
DROP TYPE "public"."cargo";--> statement-breakpoint
DROP TYPE "public"."role";