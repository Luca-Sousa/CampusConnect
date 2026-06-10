import { and, count, desc, eq, ilike, SQL } from "drizzle-orm";
import { db } from "../client.js";
import { group, groupMember, groupMessage } from "../schema/groups.schema.js";
import { user } from "../schema/auth.schema.js";
import type {
  IGroupRepository,
  ListGroupsOptions,
  ListMessagesOptions,
} from "../../../domain/ports/repositories/group.repository.js";
import type {
  Group,
  GroupWithAuthor,
  CreateGroupInput,
  UpdateGroupInput,
  GroupMessageWithAuthor,
} from "../../../domain/entities/group.js";

export class GroupDrizzleRepository implements IGroupRepository {
  async create(input: CreateGroupInput): Promise<Group> {
    const [created] = await db
      .insert(group)
      .values({
        name: input.name,
        description: input.description ?? null,
        icon: input.icon ?? null,
        authorId: input.authorId,
      })
      .returning();

    // Autor é automaticamente membro do grupo
    await db.insert(groupMember).values({
      groupId: created.id,
      userId: input.authorId,
    });

    return created as Group;
  }

  async findById(id: string): Promise<Group | null> {
    const [existing] = await db
      .select()
      .from(group)
      .where(eq(group.id, id))
      .limit(1);

    return (existing as Group) ?? null;
  }

  async findMany(options: ListGroupsOptions): Promise<GroupWithAuthor[]> {
    const conditions: SQL[] = [];
    if (options.search) {
      conditions.push(ilike(group.name, `%${options.search}%`));
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const rows = await db
      .select({
        group,
        author: {
          id: user.id,
          name: user.name,
          image: user.image,
          cargo: user.cargo,
        },
        memberCount: count(groupMember.id),
      })
      .from(group)
      .leftJoin(user, eq(group.authorId, user.id))
      .leftJoin(groupMember, eq(groupMember.groupId, group.id))
      .where(where)
      .groupBy(group.id, user.id)
      .orderBy(desc(group.createdAt))
      .limit(options.limit)
      .offset(options.offset);

    return Promise.all(
      rows.map(async (row) => {
        let isMember = false;
        if (options.currentUserId) {
          const member = await this.findMember(
            row.group.id,
            options.currentUserId,
          );
          isMember = !!member;
        }

        return {
          ...row.group,
          author: row.author,
          memberCount: Number(row.memberCount),
          isMember,
        };
      }),
    );
  }

  async update(id: string, input: UpdateGroupInput): Promise<Group> {
    const updates: Partial<typeof group.$inferInsert> = {};
    if (input.name !== undefined) updates.name = input.name;
    if (input.description !== undefined) updates.description = input.description ?? null;
    if (input.icon !== undefined) updates.icon = input.icon ?? null;

    const [updated] = await db
      .update(group)
      .set(updates)
      .where(eq(group.id, id))
      .returning();

    return updated as Group;
  }

  async delete(id: string): Promise<void> {
    await db.delete(group).where(eq(group.id, id));
  }

  async addMember(groupId: string, userId: string): Promise<void> {
    await db.insert(groupMember).values({ groupId, userId });
  }

  async removeMember(groupId: string, userId: string): Promise<void> {
    await db
      .delete(groupMember)
      .where(
        and(
          eq(groupMember.groupId, groupId),
          eq(groupMember.userId, userId),
        ),
      );
  }

  async findMember(
    groupId: string,
    userId: string,
  ): Promise<{ id: string } | null> {
    const [existing] = await db
      .select({ id: groupMember.id })
      .from(groupMember)
      .where(
        and(
          eq(groupMember.groupId, groupId),
          eq(groupMember.userId, userId),
        ),
      )
      .limit(1);

    return existing ?? null;
  }

  async findMessages(
    options: ListMessagesOptions,
  ): Promise<GroupMessageWithAuthor[]> {
    const rows = await db
      .select({
        message: groupMessage,
        author: {
          id: user.id,
          name: user.name,
          image: user.image,
          cargo: user.cargo,
        },
      })
      .from(groupMessage)
      .leftJoin(user, eq(groupMessage.authorId, user.id))
      .where(eq(groupMessage.groupId, options.groupId))
      .orderBy(desc(groupMessage.createdAt))
      .limit(options.limit)
      .offset(options.offset);

    return rows.map((row) => ({
      ...row.message,
      author: row.author,
    }));
  }

  async createMessage(
    groupId: string,
    authorId: string,
    content: string,
  ): Promise<GroupMessageWithAuthor> {
    const [created] = await db
      .insert(groupMessage)
      .values({ groupId, authorId, content })
      .returning();

    // Busca dados do autor
    const [authorData] = await db
      .select({ id: user.id, name: user.name, image: user.image, cargo: user.cargo })
      .from(user)
      .where(eq(user.id, authorId))
      .limit(1);

    return {
      ...created,
      author: authorData ?? null,
    } as GroupMessageWithAuthor;
  }

  async deleteMessage(id: string, userId: string): Promise<void> {
    await db
      .delete(groupMessage)
      .where(
        and(eq(groupMessage.id, id), eq(groupMessage.authorId, userId)),
      );
  }

  async deleteMessageAdmin(id: string): Promise<void> {
    await db.delete(groupMessage).where(eq(groupMessage.id, id));
  }

  async isAuthorOrAdmin(
    groupId: string,
    userId: string,
    userRole: string,
  ): Promise<boolean> {
    if (userRole === "admin") return true;

    const [found] = await db
      .select({ id: group.id })
      .from(group)
      .where(and(eq(group.id, groupId), eq(group.authorId, userId)))
      .limit(1);

    return !!found;
  }
}
