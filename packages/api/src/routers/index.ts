import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { createTRPCRouter } from "../trpc";
import { adminRouter } from "./admin";
import { fileRouter } from "./file";
import { merchRouter } from "./merch";
import { refundRouter } from "./refund";
import { ticketRouter } from "./ticket";

export const trpcRouter = createTRPCRouter({
  file: fileRouter,
  ticket: ticketRouter,
  merch: merchRouter,
  refund: refundRouter,
  admin: adminRouter,
});

export type TRPCRouter = typeof trpcRouter;
export type RouterInputs = inferRouterInputs<TRPCRouter>;
export type RouterOutputs = inferRouterOutputs<TRPCRouter>;
