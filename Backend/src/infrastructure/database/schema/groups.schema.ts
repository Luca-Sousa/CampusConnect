import { relations } from "drizzle-orm";
import {
  index,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";
import { user } from "./auth.schema.js";

export const group = pgTable(
  "group",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    description: text("description"),
    authorId: uuid("author_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (t) => [
    index("group_authorId_idx").on(t.authorId),
    index("group_createdAt_idx").on(t.createdAt),
  ],
);

export const groupMember = pgTable(
  "group_member",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    groupId: uuid("group_id")
      .notNull()
      .references(() => group.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    unique("group_member_unique").on(t.groupId, t.userId),
    index("group_member_groupId_idx").on(t.groupId),
    index("group_member_userId_idx").on(t.userId),
  ],
);

export const groupMessage = pgTable(
  "group_message",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    groupId: uuid("group_id")
      .notNull()
      .references(() => group.id, { onDelete: "cascade" }),
    authorId: uuid("author_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    content: text("content").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    index("group_message_groupId_idx").on(t.groupId),
    index("group_message_authorId_idx").on(t.authorId),
    index("group_message_createdAt_idx").on(t.createdAt),
  ],
);

export const groupRelations = relations(group, ({ one, many }) => ({
  author: one(user, { fields: [group.authorId], references: [user.id] }),
  members: many(groupMember),
  messages: many(groupMessage),
}));

export const groupMemberRelations = relations(groupMember, ({ one }) => ({
  group: one(group, { fields: [groupMember.groupId], references: [group.id] }),
  user: one(user, { fields: [groupMember.userId], references: [user.id] }),
}));

export const groupMessageRelations = relations(groupMessage, ({ one }) => ({
  group: one(group, {
    fields: [groupMessage.groupId],
    references: [group.id],
  }),
  author: one(user, {
    fields: [groupMessage.authorId],
    references: [user.id],
  }),
}));
