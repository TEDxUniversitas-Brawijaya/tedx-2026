import { TRPCError } from "@trpc/server";
import {
  createUserInputSchema,
  createUserOutputSchema,
  deleteUserInputSchema,
  listUsersInputSchema,
  listUsersOutputSchema,
  updateUserRoleInputSchema,
} from "../../schemas/user";
import { createTRPCRouter, superadminOnlyProcedure } from "../../trpc";

const list = superadminOnlyProcedure
  .input(listUsersInputSchema)
  .output(listUsersOutputSchema)
  .query(() => {
    // TODO: Implement admin.user.list
    // - Return all admin users with details
    throw new TRPCError({
      code: "NOT_IMPLEMENTED",
      message: "admin.user.list is not implemented yet",
    });
  });

const create = superadminOnlyProcedure
  .input(createUserInputSchema)
  .output(createUserOutputSchema)
  .mutation(() => {
    // TODO: Implement admin.user.create
    // - Create admin user with provided credentials
    // - Hash password
    // - Return user ID and success message
    throw new TRPCError({
      code: "NOT_IMPLEMENTED",
      message: "admin.user.create is not implemented yet",
    });
  });

const updateRole = superadminOnlyProcedure
  .input(updateUserRoleInputSchema)
  .output(createUserOutputSchema)
  .mutation(() => {
    // TODO: Implement admin.user.updateRole
    // - Validate user exists
    // - Update user role
    // - Return user ID, role, and success message
    throw new TRPCError({
      code: "NOT_IMPLEMENTED",
      message: "admin.user.updateRole is not implemented yet",
    });
  });

const deleteUser = superadminOnlyProcedure
  .input(deleteUserInputSchema)
  .output(createUserOutputSchema)
  .mutation(() => {
    // TODO: Implement admin.user.delete
    // - Validate user exists
    // - Delete user (hard delete or soft delete based on requirements)
    // - Return user ID and success message
    throw new TRPCError({
      code: "NOT_IMPLEMENTED",
      message: "admin.user.delete is not implemented yet",
    });
  });

export const adminUserRouter = createTRPCRouter({
  list,
  create,
  updateRole,
  delete: deleteUser,
});
