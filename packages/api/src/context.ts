import { createAuth, type Session } from "@tedx-2026/auth";
import {
  createCaptchaServices,
  createAttendanceServices,
  createConfigServices,
  createEmailServices,
  createFileServices,
  createOrderServices,
  createPaymentServices,
  createProductServices,
  createRefundServices,
  createTicketServices,
  createUserServices,
  type AttendanceServices,
  type FileServices,
  type OrderServices,
  type ProductServices,
  type RefundServices,
  type UserServices,
} from "@tedx-2026/core";
import {
  createConfigQueries,
  createAttendanceQueries,
  createDB,
  createOrderQueries,
  createProductQueries,
  createRefundQueries,
  createTicketQueries,
  createUserQueries,
  type D1Database,
  type DB,
} from "@tedx-2026/db";
import { createBrevo } from "@tedx-2026/email";
import {
  createConfigOperations,
  createKV,
  createOrderOperations,
  createProductOperations,
  type KVNamespaceType,
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
    TURNSTILE_SECRET_KEY: string;
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
  const cdn = createR2(env.cdn);
  const email = createBrevo(env.BREVO_API_KEY, {
    // sandbox: process.env.NODE_ENV !== "production",
  });

  const auth = createAuth(db, {
    secret: env.AUTH_SECRET,
    baseURL: env.APP_URL,
    googleClientId: env.GOOGLE_CLIENT_ID,
    googleClientSecret: env.GOOGLE_CLIENT_SECRET,
    waitUntil,
    superadminEmails: env.SUPERADMIN_EMAILS,
  });

  const session = await auth.api.getSession({
    headers: fetchCreateContextFnOptions.req.headers,
  });

  const orderOperations = createOrderOperations(kv);
  const configOperations = createConfigOperations(kv);
  const productOperations = createProductOperations(kv);

  const userQueries = createUserQueries(db);
  const attendanceQueries = createAttendanceQueries(db);
  const orderQueries = createOrderQueries(db);
  const configQueries = createConfigQueries(db);
  const productQueries = createProductQueries(db);
  const refundQueries = createRefundQueries(db);
  const ticketQueries = createTicketQueries(db);

  const configServices = createConfigServices({
    ...baseContext,
    logger: logger.child({ service: "config" }),
    configQueries,
    configOperations,
  });

  const userServices = createUserServices({
    ...baseContext,
    logger: logger.child({ service: "user" }),
    userQueries,
  });

  const emailServices = createEmailServices(
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

  const fileServices = createFileServices({
    ...baseContext,
    logger: logger.child({ service: "file" }),
    r2: cdn,
    CDN_DOMAIN: env.CDN_DOMAIN,
  });

  const paymentServices = createPaymentServices({
    ...baseContext,
    logger: logger.child({ service: "payment" }),
  });

  const productServices = createProductServices({
    ...baseContext,
    logger: logger.child({ service: "product" }),
    productQueries,
    productOperations,
    configServices,
  });

  const captchaServices = createCaptchaServices({
    ...baseContext,
    logger: logger.child({ service: "captcha" }),
    turnstileSecretKey: env.TURNSTILE_SECRET_KEY,
  });

  const ticketServices = createTicketServices({
    ...baseContext,
    logger: logger.child({ service: "ticket" }),
    configServices,
    ticketQueries,
  });

  const attendanceServices = createAttendanceServices({
    ...baseContext,
    logger: logger.child({ service: "attendance" }),
    attendanceQueries,
    configServices,
  });

  const orderServices = createOrderServices({
    ...baseContext,
    logger: logger.child({ service: "order" }),

    captchaServices,
    configServices,
    fileServices,
    paymentServices,
    emailServices,
    ticketServices,

    orderQueries,
    refundQueries,
    userQueries,
    productQueries,

    orderOperations,
    productOperations,
  });

  const refundServices = createRefundServices({
    ...baseContext,
    logger: logger.child({ service: "refund" }),

    configServices,
    fileServices,

    orderQueries,
    refundQueries,
    productQueries,
  });

  return {
    requestId,
    db,
    logger,
    waitUntil,
    session,
    services: {
      user: userServices,
      attendance: attendanceServices,
      file: fileServices,
      order: orderServices,
      refund: refundServices,
      product: productServices,
    },
  };
};

export type Context = {
  requestId: string;
  db: DB;
  logger: LoggerType;
  services: {
    user: UserServices;
    attendance: AttendanceServices;
    file: FileServices;
    order: OrderServices;
    refund: RefundServices;
    product: ProductServices;
  };
  waitUntil: (promise: Promise<unknown>) => void;
  session: Session | null;
};
