import { eq, inArray } from "drizzle-orm";
import type { DB } from "../db";
import { schema } from "../schemas";
import type { SelectUser } from "../schemas/auth";

export type UserQueries = {
  // TODO: Add filter and pagination options
  getAllUser: () => Promise<SelectUser[]>;

  getUsersByIds: (ids: SelectUser["id"][]) => Promise<SelectUser[]>;
  getUserById: (id: SelectUser["id"]) => Promise<SelectUser | null>;
};

export function createUserQueries(db: DB): UserQueries {
  return {
    getAllUser: async () => {
      const users = await db.select().from(schema.userTable);
      return users;
    },

    getUsersByIds: async (ids) => {
      if (ids.length === 0) {
        return [];
      }

      const users = await db
        .select()
        .from(schema.userTable)
        .where(inArray(schema.userTable.id, ids));
      return users;
    },

    getUserById: async (id) => {
      const user = await db.query.userTable.findFirst({
        where: eq(schema.userTable.id, id),
      });

      return user ?? null;
    },
  };
}
