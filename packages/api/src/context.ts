import { createAuth, type Session } from "@tedx-2026/auth";
import {
  createMerchService,
  createOrderService,
  createPaymentService,
  createEmailService,
  createFileService,
  createUserService,
  type MerchService,
  type OrderService,
  type PaymentService,
  type EmailService,
  type FileServices,
  type UserServices,
} from "@tedx-2026/core";
import {
  createConfigQueries,
  createDB,
  createMerchQueries,
  createUserQueries,
  type ConfigQueries,
  type D1Database,
  type DB,
  type MerchQueries,
  type UserQueries,
} from "@tedx-2026/db";
import { createBrevo } from "@tedx-2026/email";
import {
  createKV,
  createOrderKVOperations,
  type KVNamespaceType,
  type OrderKVOperations,
} from "@tedx-2026/kv";
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
  const kv = createKV(env.kv);
  const orderKVOperations = createOrderKVOperations(kv);
  const cdn = createR2(env.cdn);
  const email = createBrevo(env.BREVO_API_KEY, {
    // sandbox: process.env.NODE_ENV !== "production",
  });

  const userQueries = createUserQueries(db);
  const merchQueries = createMerchQueries(db);
  const configQueries = createConfigQueries(db);

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

  const midtransServerKeyConfig = await configQueries.getByKey(
    "midtrans_server_key"
  );
  const midtransIsProductionConfig = await configQueries.getByKey(
    "midtrans_is_production"
  );

  const paymentService = createPaymentService({
    serverKey: midtransServerKeyConfig?.value ?? "",
    isProduction: midtransIsProductionConfig?.value === "true",
  });

  const merchService = createMerchService({
    configQueries,
    merchQueries,
    orderKVOperations,
    paymentService,
    apiBaseUrl: env.APP_URL,
  });

  const signProofUrl = (key: string) => {
    if (key.startsWith("http://") || key.startsWith("https://")) {
      return key;
    }

    return `https://${env.CDN_DOMAIN}/${key}`;
  };

  const orderService = createOrderService({
    configQueries,
    merchQueries,
    signProofUrl,
  });

  return {
    requestId,
    db,
    logger,
    waitUntil,
    session,
    queries: {
      user: userQueries,
      merch: merchQueries,
      config: configQueries,
    },
    operations: {
      orderKV: orderKVOperations,
    },
    services: {
      user: userService,
      file: fileService,
      email: emailService,
      payment: paymentService,
      merch: merchService,
      order: orderService,
    },
  };
};

export type Context = {
  requestId: string;
  db: DB;
  logger: LoggerType;
  queries: {
    user: UserQueries;
    merch: MerchQueries;
    config: ConfigQueries;
  };
  operations: {
    orderKV: OrderKVOperations;
  };
  services: {
    user: UserServices;
    file: FileServices;
    email: EmailService;
    payment: PaymentService;
    merch: MerchService;
    order: OrderService;
  };
  waitUntil: (promise: Promise<unknown>) => void;
  session: Session | null;
};
