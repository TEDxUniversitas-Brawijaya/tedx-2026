import type { UserQueries } from "@tedx-2026/db/queries/user";
import type { User } from "@tedx-2026/types";
import type { BaseContext } from "../types";

export type UserServices = {
  getAllUser: () => Promise<User[]>;
};

type CreateUserServiceCtx = {
  userQueries: UserQueries;
} & BaseContext;

export const createUserService = (ctx: CreateUserServiceCtx): UserServices => ({
  getAllUser: async () => {
    const users = await ctx.userQueries.getAllUser();
    return users;
  },
});
