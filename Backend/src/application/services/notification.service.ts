import type { INotificationEventBus } from "../../domain/ports/services/notification-event-bus.js";
import { getAllUserIds, getGroupMemberIds } from "../../infrastructure/helpers/user-ids.js";

function truncate(text: string, maxLen = 50): string {
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen) + "...";
}

/**
 * Application-layer service that encapsulates all notification emission logic.
 *
 * Instead of routes directly calling `notificationEventBus.emit()` with
 * hand-crafted messages, they delegate to this service. This:
 *  - Centralizes message formatting (DRY).
 *  - Keeps routes focused on HTTP concerns (SRP).
 *  - Makes notification logic testable in isolation.
 */
export class NotificationService {
  constructor(private readonly eventBus: INotificationEventBus) {}

  async notifyPostCreated(
    postType: string,
    actorId: string,
    actorName: string,
    postId: string,
  ): Promise<void> {
    const allUserIds = await getAllUserIds();
    const recipientIds = allUserIds.filter((id) => id !== actorId);
    if (recipientIds.length === 0) return;

    const typeLabel =
      postType === "event" ? "evento" : postType === "news" ? "notícia" : "publicação";

    this.eventBus.emit({
      type: "post_created",
      actorId,
      entityType: "post",
      entityId: postId,
      recipientIds,
      message: `${actorName} publicou um novo ${typeLabel}.`,
    });
  }

  notifyModerationRejected(
    postId: string,
    authorId: string,
    actorId: string,
    actorRole?: string,
  ): void {
    const roleLabel = actorRole === "colaborador" ? "um colaborador" : "um administrador";

    this.eventBus.emit({
      type: "post_moderation_rejected",
      actorId,
      entityType: "post",
      entityId: postId,
      recipientIds: [authorId],
      message: `Sua publicação foi rejeitada pela moderação e removida por ${roleLabel}.`,
    });
  }

  notifyLike(
    postId: string,
    postAuthorId: string,
    actorId: string,
    actorName: string,
  ): void {
    this.eventBus.emit({
      type: "like",
      actorId,
      entityType: "post",
      entityId: postId,
      recipientIds: [postAuthorId],
      message: `${actorName} curtiu sua publicação.`,
    });
  }

  notifyComment(
    postId: string,
    recipientIds: string[],
    actorId: string,
    actorName: string,
    content: string,
  ): void {
    if (recipientIds.length === 0) return;

    this.eventBus.emit({
      type: "comment",
      actorId,
      entityType: "post",
      entityId: postId,
      recipientIds,
      message: `${actorName} comentou: "${truncate(content)}"`,
    });
  }

  async notifyGroupCreated(
    groupId: string,
    groupName: string,
    actorId: string,
    actorName: string,
  ): Promise<void> {
    const allUserIds = await getAllUserIds();
    const recipientIds = allUserIds.filter((id) => id !== actorId);
    if (recipientIds.length === 0) return;

    this.eventBus.emit({
      type: "group_created",
      actorId,
      entityType: "group",
      entityId: groupId,
      recipientIds,
      message: `${actorName} criou o grupo "${groupName}".`,
    });
  }

  async notifyGroupMessage(
    groupId: string,
    groupName: string,
    messageId: string,
    actorId: string,
    actorName: string,
    content: string,
  ): Promise<void> {
    const memberIds = await getGroupMemberIds(groupId, actorId);
    if (memberIds.length === 0) return;

    this.eventBus.emit({
      type: "group_message",
      actorId,
      entityType: "group_message",
      entityId: messageId,
      recipientIds: memberIds,
      message: `${actorName} enviou uma mensagem em "${groupName}": "${truncate(content)}"`,
    });
  }
}
