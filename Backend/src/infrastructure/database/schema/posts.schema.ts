import { relations } from "drizzle-orm";
import {
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";
import { user } from "./auth.schema.js";

export const postTypeEnum = pgEnum("post_type", [
  "text",
  "image",
  "event",
  "news",
]);

export const post = pgTable(
  "post",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    authorId: uuid("author_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    type: postTypeEnum("type").notNull(),
    content: text("content"),
    imageUrl: text("image_url"),
    eventTitle: text("event_title"),
    eventDate: text("event_date"),
    eventTime: text("event_time"),
    eventLocation: text("event_location"),
    newsTitle: text("news_title"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (t) => [
    index("post_authorId_idx").on(t.authorId),
    index("post_createdAt_idx").on(t.createdAt),
  ],
);

export const rsvp = pgTable(
  "rsvp",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    postId: uuid("post_id")
      .notNull()
      .references(() => post.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [unique("rsvp_unique").on(t.postId, t.userId)],
);

export const postRelations = relations(post, ({ one, many }) => ({
  author: one(user, { fields: [post.authorId], references: [user.id] }),
  rsvps: many(rsvp),
}));

export const rsvpRelations = relations(rsvp, ({ one }) => ({
  post: one(post, { fields: [rsvp.postId], references: [post.id] }),
  user: one(user, { fields: [rsvp.userId], references: [user.id] }),
}));
