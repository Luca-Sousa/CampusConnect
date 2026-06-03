CREATE TABLE "group" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"author_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "group_member" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"group_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "group_member_unique" UNIQUE("group_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "group_message" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"group_id" uuid NOT NULL,
	"author_id" uuid NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "group" ADD CONSTRAINT "group_author_id_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "group_member" ADD CONSTRAINT "group_member_group_id_group_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."group"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "group_member" ADD CONSTRAINT "group_member_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "group_message" ADD CONSTRAINT "group_message_group_id_group_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."group"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "group_message" ADD CONSTRAINT "group_message_author_id_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "group_authorId_idx" ON "group" USING btree ("author_id");--> statement-breakpoint
CREATE INDEX "group_createdAt_idx" ON "group" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "group_member_groupId_idx" ON "group_member" USING btree ("group_id");--> statement-breakpoint
CREATE INDEX "group_member_userId_idx" ON "group_member" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "group_message_groupId_idx" ON "group_message" USING btree ("group_id");--> statement-breakpoint
CREATE INDEX "group_message_authorId_idx" ON "group_message" USING btree ("author_id");--> statement-breakpoint
CREATE INDEX "group_message_createdAt_idx" ON "group_message" USING btree ("created_at");