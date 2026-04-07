import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { createTRPCRouter } from "../trpc";
import { fileRouter } from "./file";
import { userRouter } from "./user";

export const trpcRouter = createTRPCRouter({
  userRouter,
  fileRouter,
});

export type TRPCRouter = typeof trpcRouter;
export type RouterInputs = inferRouterInputs<TRPCRouter>;
export type RouterOutputs = inferRouterOutputs<TRPCRouter>;
