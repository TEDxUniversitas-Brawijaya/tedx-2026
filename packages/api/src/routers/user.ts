import { createTRPCRouter, superadminOnlyProcedure } from "../trpc";

const getAllUsers = superadminOnlyProcedure.query((c) => {
  return c.ctx.services.user.getAllUser();
});

export const userRouter = createTRPCRouter({
  getAllUsers,
});
