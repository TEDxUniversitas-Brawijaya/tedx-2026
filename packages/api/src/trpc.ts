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
    error: {
      code: error.code,
      message: error.message,
      name: error.name,
    },
  });

  if (error.cause instanceof AppError) {
    const appError = error.cause;
    throw new TRPCError({
      code: appError.code,
      message: appError.message,
      cause: appError,
    });
  }

  throw new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message: "An unexpected error occurred",
    cause: error,
  });
});

export const createTRPCRouter = t.router;

/**
 * Public procedure that does not require authentication.
 */
export const publicProcedure = baseProcedure;

/**
 * Protected procedure that requires authentication. If the user is not authenticated, it will throw an UNAUTHORIZED error.
 */
export const protectedProcedure = baseProcedure.use((opts) => {
  const { ctx } = opts;

  if (!ctx.session) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return opts.next({
    ctx: {
      ...ctx,
      session: ctx.session,
    },
  });
});

/**
 * Superadmin-only procedure that requires the user to have the "superadmin" role. If the user does not have the required role, it will throw a FORBIDDEN error.
 */
export const superadminOnlyProcedure = protectedProcedure.use((opts) => {
  const { ctx } = opts;

  if (ctx.session.user.role !== "superadmin") {
    throw new TRPCError({ code: "FORBIDDEN" });
  }

  return opts.next();
});

/**
 * Admin-only procedure that requires the user to have the "admin" role. If the user does not have the required role, it will throw a FORBIDDEN error.
 */
export const adminOnlyProcedure = protectedProcedure.use((opts) => {
  const { ctx } = opts;

  if (ctx.session.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN" });
  }

  return opts.next();
});
