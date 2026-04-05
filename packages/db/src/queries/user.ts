import type { DB } from "../db";
import { schema } from "../schemas";
import type { SelectUser } from "../schemas/auth";

export type UserQueries = {
  // TODO: Add filter and pagination options
  getAllUser: () => Promise<SelectUser[]>;
};

export function createUserQueries(db: DB): UserQueries {
  return {
    getAllUser: async () => {
      const users = await db.select().from(schema.userTable);
      return users;
    },
  };
}
