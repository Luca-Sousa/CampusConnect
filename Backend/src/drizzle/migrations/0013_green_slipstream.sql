ALTER TABLE "post" ADD COLUMN "tags" text;--> statement-breakpoint
ALTER TABLE "post" ADD COLUMN "moderated" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "post" ADD COLUMN "moderation_reasons" text;