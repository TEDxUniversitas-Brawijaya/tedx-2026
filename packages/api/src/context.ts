import { createAuth, type Session } from "@tedx-2026/auth";
import {
  createUserService,
  type UserServices,
} from "@tedx-2026/core/services/user";
import { createDB, type D1Database } from "@tedx-2026/db";
import { createUserQueries } from "@tedx-2026/db/queries/user";
import type {
  // createKV,
  KVNamespaceType,
} from "@tedx-2026/kv";
import type { LoggerType } from "@tedx-2026/logger";
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

type CreateContextOptions = {
  env: {
    db: D1Database;
    kv: KVNamespaceType;
    APP_URL: string;
    AUTH_SECRET: string;
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    SUPERADMIN_EMAILS: string[];
  };
  fetchCreateContextFnOptions: FetchCreateContextFnOptions;
  logger: LoggerType;
  requestId: string;
  waitUntil: (promise: Promise<unknown>) => void;
};

export const createContext = async ({
  env,
  fetchCreateContextFnOptions,
  logger,
  requestId,
  waitUntil,
}: CreateContextOptions): Promise<Context> => {
  const baseContext = {
    requestId,
    waitUntil,
  };

  const db = createDB(env.db);
  // const kv = createKV(env.kv);

  const userQueries = createUserQueries(db);

  const userService = createUserService({
    ...baseContext,
    logger: logger.child({ service: "user" }),
    userQueries,
  });

  const auth = createAuth(db, {
    secret: env.AUTH_SECRET,
    baseURL: env.APP_URL,
    googleClientId: env.GOOGLE_CLIENT_ID,
    googleClientSecret: env.GOOGLE_CLIENT_SECRET,
    waitUntil,
    superadminEmails: env.SUPERADMIN_EMAILS,
  });

  const session = await auth.api.getSession(fetchCreateContextFnOptions.req);

  return {
    requestId,
    logger,
    waitUntil,
    session,
    services: {
      user: userService,
    },
  };
};

export type Context = {
  requestId: string;
  logger: LoggerType;
  services: {
    user: UserServices;
  };
  // operations: {};
  waitUntil: (promise: Promise<unknown>) => void;
  session: Session | null;
};
