CREATE TYPE "public"."cargo" AS ENUM('aluno', 'professor', 'coordenador', 'direcao', 'administracao', 'secretaria', 'centro_academico', 'biblioteca', 'ti');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('aluno', 'colaborador', 'admin');--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT 'aluno'::"public"."role";--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "role" SET DATA TYPE "public"."role" USING "role"::"public"."role";--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "cargo" SET DEFAULT 'aluno'::"public"."cargo";--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "cargo" SET DATA TYPE "public"."cargo" USING "cargo"::"public"."cargo";