DROP INDEX "verification_identifier_idx";--> statement-breakpoint
ALTER TABLE "account" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "session" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "post" ADD COLUMN "event_end_date" text;--> statement-breakpoint
ALTER TABLE "post" ADD COLUMN "event_end_time" text;