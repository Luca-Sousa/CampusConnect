import { relations } from "drizzle-orm";
import { index, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { user } from "./auth.schema.js";

export const notificationTypeEnum = pgEnum("notification_type", [
  "like",
  "comment",
  "post_created",
  "group_created",
  "group_message",
]);

export const notification = pgTable(
  "notification",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    recipientId: uuid("recipient_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    actorId: uuid("actor_id")
      .references(() => user.id, { onDelete: "set null" }),
    type: notificationTypeEnum("type").notNull(),
    entityType: text("entity_type").notNull(),
    entityId: uuid("entity_id").notNull(),
    message: text("message").notNull(),
    readAt: timestamp("read_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    index("notification_recipientId_idx").on(t.recipientId),
    index("notification_recipientId_readAt_idx").on(t.recipientId, t.readAt),
    index("notification_recipientId_createdAt_idx").on(t.recipientId, t.createdAt),
    index("notification_type_idx").on(t.type),
  ],
);

export const notificationRelations = relations(notification, ({ one }) => ({
  recipient: one(user, {
    fields: [notification.recipientId],
    references: [user.id],
  }),
  actor: one(user, {
    fields: [notification.actorId],
    references: [user.id],
  }),
}));
