import { eq } from "drizzle-orm";
import { db } from "../client.js";
import { user } from "../schema/auth.schema.js";
import type {
  IUserRepository,
  UpdateUserProfileInput,
} from "../../../domain/ports/repositories/user.repository.js";
import type { User } from "../../../domain/entities/user.js";

export class UserDrizzleRepository implements IUserRepository {
  async findById(id: string): Promise<User | null> {
    const [existing] = await db
      .select()
      .from(user)
      .where(eq(user.id, id))
      .limit(1);

    return (existing as User) ?? null;
  }

  async updateProfile(id: string, input: UpdateUserProfileInput): Promise<User> {
    const updates: Partial<typeof user.$inferInsert> = { updatedAt: new Date() };
    if (input.name !== undefined && input.name !== null) updates.name = input.name;
    if (input.image !== undefined) updates.image = input.image;
    if (input.course !== undefined) updates.course = input.course;
    if (input.bio !== undefined) updates.bio = input.bio;

    const [updated] = await db
      .update(user)
      .set(updates)
      .where(eq(user.id, id))
      .returning();

    return updated as User;
  }
}
