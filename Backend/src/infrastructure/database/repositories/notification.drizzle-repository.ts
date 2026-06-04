import { eq, desc, count, isNull, and, sql } from "drizzle-orm";
import { db } from "../client.js";
import { notification } from "../schema/notifications.schema.js";
import { user } from "../schema/auth.schema.js";
import type { INotificationRepository } from "../../../domain/ports/repositories/notification.repository.js";
import type {
  NotificationWithActor,
  CreateNotificationInput,
} from "../../../domain/entities/notification.js";

export class NotificationDrizzleRepository implements INotificationRepository {
  async create(input: CreateNotificationInput) {
    const [row] = await db
      .insert(notification)
      .values({
        recipientId: input.recipientId,
        actorId: input.actorId,
        type: input.type,
        entityType: input.entityType,
        entityId: input.entityId,
        message: input.message,
      })
      .returning();

    return row;
  }

  async createMany(inputs: CreateNotificationInput[]): Promise<void> {
    if (inputs.length === 0) return;

    await db.insert(notification).values(
      inputs.map((input) => ({
        recipientId: input.recipientId,
        actorId: input.actorId,
        type: input.type,
        entityType: input.entityType,
        entityId: input.entityId,
        message: input.message,
      })),
    );
  }

  async findByRecipient(
    recipientId: string,
    options: { limit: number; offset: number },
  ): Promise<NotificationWithActor[]> {
    const rows = await db
      .select({
        id: notification.id,
        recipientId: notification.recipientId,
        actorId: notification.actorId,
        type: notification.type,
        entityType: notification.entityType,
        entityId: notification.entityId,
        message: notification.message,
        readAt: notification.readAt,
        createdAt: notification.createdAt,
        actor: {
          id: user.id,
          name: user.name,
          image: user.image,
        },
      })
      .from(notification)
      .leftJoin(user, eq(notification.actorId, user.id))
      .where(eq(notification.recipientId, recipientId))
      .orderBy(desc(notification.createdAt))
      .limit(options.limit)
      .offset(options.offset);

    return rows;
  }

  async countUnread(recipientId: string): Promise<number> {
    const [result] = await db
      .select({ value: count() })
      .from(notification)
      .where(
        and(
          eq(notification.recipientId, recipientId),
          isNull(notification.readAt),
        ),
      );

    return result?.value ?? 0;
  }

  async markAsRead(id: string, recipientId: string): Promise<void> {
    await db
      .update(notification)
      .set({ readAt: new Date() })
      .where(
        and(
          eq(notification.id, id),
          eq(notification.recipientId, recipientId),
        ),
      );
  }

  async markAllAsRead(recipientId: string): Promise<void> {
    await db
      .update(notification)
      .set({ readAt: new Date() })
      .where(
        and(
          eq(notification.recipientId, recipientId),
          isNull(notification.readAt),
        ),
      );
  }

  async findManyByRecipient(
    recipientId: string,
    options: { limit: number; offset: number; unreadOnly: boolean },
  ): Promise<{ notifications: NotificationWithActor[]; total: number }> {
    const where = options.unreadOnly
      ? and(
          eq(notification.recipientId, recipientId),
          isNull(notification.readAt),
        )
      : eq(notification.recipientId, recipientId);

    const [{ total }] = await db
      .select({ total: count() })
      .from(notification)
      .where(where);

    const notifications = await db
      .select({
        id: notification.id,
        recipientId: notification.recipientId,
        actorId: notification.actorId,
        type: notification.type,
        entityType: notification.entityType,
        entityId: notification.entityId,
        message: notification.message,
        readAt: notification.readAt,
        createdAt: notification.createdAt,
        actor: {
          id: user.id,
          name: user.name,
          image: user.image,
        },
      })
      .from(notification)
      .leftJoin(user, eq(notification.actorId, user.id))
      .where(where)
      .orderBy(desc(notification.createdAt))
      .limit(options.limit)
      .offset(options.offset);

    return { notifications, total };
  }
}
