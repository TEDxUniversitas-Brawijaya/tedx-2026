import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { createTRPCRouter } from "../trpc";
import { adminRouter } from "./admin";
import { fileRouter } from "./file";
import { merchRouter } from "./merch";
import { refundRouter } from "./refund";
import { ticketRouter } from "./ticket";
import { userRouter } from "./user";

export const trpcRouter = createTRPCRouter({
  userRouter,
  fileRouter,
  ticket: ticketRouter,
  merch: merchRouter,
  refund: refundRouter,
  admin: adminRouter,
});

export type TRPCRouter = typeof trpcRouter;
export type RouterInputs = inferRouterInputs<TRPCRouter>;
export type RouterOutputs = inferRouterOutputs<TRPCRouter>;
