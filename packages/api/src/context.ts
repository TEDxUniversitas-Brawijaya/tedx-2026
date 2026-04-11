import { createAuth, type Session } from "@tedx-2026/auth";
import {
  createEmailService,
  createFileService,
  createUserService,
  type EmailService,
  type FileServices,
  type UserServices,
} from "@tedx-2026/core";
import { createDB, createUserQueries, type D1Database } from "@tedx-2026/db";
import { createBrevo } from "@tedx-2026/email";
import type { KVNamespaceType } from "@tedx-2026/kv";
import type { LoggerType } from "@tedx-2026/logger";
import { createR2, type R2BucketType } from "@tedx-2026/storage";
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

type CreateContextOptions = {
  env: {
    db: D1Database;
    kv: KVNamespaceType;
    cdn: R2BucketType;
    CDN_DOMAIN: string;
    APP_URL: string;
    AUTH_SECRET: string;
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    BREVO_API_KEY: string;
    SENDER_NAME: string;
    SENDER_EMAIL: string;
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
  const cdn = createR2(env.cdn);
  const email = createBrevo(env.BREVO_API_KEY, {
    // sandbox: process.env.NODE_ENV !== "production",
  });

  const userQueries = createUserQueries(db);

  const userService = createUserService({
    ...baseContext,
    logger: logger.child({ service: "user" }),
    userQueries,
  });

  const emailService = createEmailService(
    {
      ...baseContext,
      logger: logger.child({ service: "email" }),
      email,
    },
    {
      senderName: env.SENDER_NAME,
      senderEmail: env.SENDER_EMAIL,
    }
  );

  const fileService = createFileService({
    ...baseContext,
    logger: logger.child({ service: "file" }),
    r2: cdn,
    CDN_DOMAIN: env.CDN_DOMAIN,
    email: emailService,
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
      file: fileService,
      email: emailService,
    },
  };
};

export type Context = {
  requestId: string;
  logger: LoggerType;
  services: {
    user: UserServices;
    file: FileServices;
    email: EmailService;
  };
  waitUntil: (promise: Promise<unknown>) => void;
  session: Session | null;
};
