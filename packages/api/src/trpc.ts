import { AppError } from "@tedx-2026/core";
import { initTRPC, TRPCError } from "@trpc/server";
import SuperJSON from "superjson";
import type { Context } from "./context";

const t = initTRPC.context<Context>().create({
  transformer: SuperJSON,
});

const baseProcedure = t.procedure.use(async (opts) => {
  const { ctx, next, path, type } = opts;
  const startTime = Date.now();

  const response = await next();
  const durationMs = Date.now() - startTime;

  if (response.ok) {
    ctx.logger.info("trpc request completed", {
      path,
      type,
      durationMs,
      status: "success",
    });
    return response;
  }

  const { error } = response;
  ctx.logger.error("trpc request failed", {
    path,
    type,
    durationMs,
    status: "error",
    error,
  });

  if (error.cause instanceof AppError) {
    const appError = error.cause;
    throw new TRPCError({
      code: appError.code,
      message: appError.message,
      cause: appError,
    });
  }

  throw error;
});

export const createTRPCRouter = t.router;
export const publicProcedure = baseProcedure;
