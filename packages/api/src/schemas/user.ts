import { z } from "zod";
import { isoDateStringSchema, userIdSchema, userRoleSchema } from "./common";

// admin.user.list
export const listUsersInputSchema = z.object({});

export const listUsersOutputSchema = z.array(
  z.object({
    id: userIdSchema,
    name: z.string(),
    email: z.email(),
    role: userRoleSchema,
    emailVerified: z.boolean(),
    createdAt: isoDateStringSchema,
    updatedAt: isoDateStringSchema,
  })
);

// admin.user.create
export const createUserInputSchema = z.object({
  email: z.email(),
  name: z.string().min(1).max(255),
  password: z.string().min(8).max(255),
  role: userRoleSchema,
});

export const createUserOutputSchema = z.object({
  userId: userIdSchema,
  message: z.string(),
});

// admin.user.updateRole
export const updateUserRoleInputSchema = z.object({
  userId: userIdSchema,
  role: userRoleSchema,
});

export const updateUserRoleOutputSchema = z.object({
  userId: userIdSchema,
  role: userRoleSchema,
  message: z.string(),
});

// admin.user.delete
export const deleteUserInputSchema = z.object({
  userId: userIdSchema,
});

export const deleteUserOutputSchema = z.object({
  userId: userIdSchema,
  message: z.string(),
});
