import { eq, or, inArray } from "drizzle-orm";
import { db } from "../database/client.js";
import { user } from "../database/schema/auth.schema.js";
import { groupMember } from "../database/schema/groups.schema.js";
import { OFFICIAL_CARGOS } from "../../application/constants/permissions.js";

export async function getAllUserIds(): Promise<string[]> {
  const rows = await db.select({ id: user.id }).from(user);
  return rows.map((r) => r.id);
}

export async function getGroupMemberIds(
  groupId: string,
  excludeUserId?: string,
): Promise<string[]> {
  const rows = await db
    .select({ userId: groupMember.userId })
    .from(groupMember)
    .where(eq(groupMember.groupId, groupId));

  return rows
    .map((r) => r.userId)
    .filter((id) => id !== excludeUserId);
}

export async function getModeratorUserIds(): Promise<string[]> {
  const officialCargos = Array.from(OFFICIAL_CARGOS) as ("direcao" | "administracao" | "coordenador" | "centro_academico")[];
  const rows = await db
    .select({ id: user.id })
    .from(user)
    .where(
      or(
        eq(user.role, "admin"),
        or(
          eq(user.role, "colaborador"),
          inArray(user.cargo, officialCargos),
        ),
      ),
    );
  return rows.map((r) => r.id);
}
