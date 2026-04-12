import type {
  ExecutionContext,
  ScheduledController,
} from "@cloudflare/workers-types";
import { trpcServer } from "@hono/trpc-server";
import { createContext, trpcRouter } from "@tedx-2026/api";
import { createAuth } from "@tedx-2026/auth";
import { createDB, type D1Database } from "@tedx-2026/db";
import type { KVNamespaceType } from "@tedx-2026/kv";
import { createLogger } from "@tedx-2026/logger";
import type { R2BucketType } from "@tedx-2026/storage";
import { createNanoId } from "@tedx-2026/utils";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

type Bindings = {
  DB: D1Database;
  KV: KVNamespaceType;
  CDN: R2BucketType;
  CDN_DOMAIN: string;
  APP_URL: string;
  AUTH_SECRET: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  BREVO_API_KEY: string;
  SENDER_NAME: string;
  SENDER_EMAIL: string;
  SUPERADMIN_EMAILS: string; // Comma-separated list of superadmin emails
};

// CORS allowed origin patterns (top-level for performance)
const ALLOWED_ORIGIN_PATTERNS = [
  /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/, // localhost with any port (http/https)
  /^https:\/\/(.*\.)?tedxuniversitasbrawijaya\.com$/, // production domain + subdomains (https only)
  /^https:\/\/.*\.workers\.dev$/, // Cloudflare Workers preview (https only)
];

const app = new Hono<{
  Bindings: Bindings;
}>();

app.use(logger());

app.use(
  "/*",
  cors({
    origin: (origin) => {
      // Secure CORS origin validation using regex with proper anchoring
      // Prevents attacks from domains like "evil-localhost.com" or "tedxuniversitasbrawijaya.com.attacker.com"
      const isAllowed = ALLOWED_ORIGIN_PATTERNS.some((pattern) =>
        pattern.test(origin)
      );

      return isAllowed ? origin : null;
    },
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization", "trpc-accept"],
    credentials: true,
  })
);

app.on(["POST", "GET"], "/auth/*", (c) => {
  const db = createDB(c.env.DB);

  const auth = createAuth(db, {
    secret: c.env.AUTH_SECRET,
    baseURL: c.env.APP_URL,
    googleClientId: c.env.GOOGLE_CLIENT_ID,
    googleClientSecret: c.env.GOOGLE_CLIENT_SECRET,
    waitUntil: (promise) => c.executionCtx.waitUntil(promise),
    superadminEmails: c.env.SUPERADMIN_EMAILS.split(","),
  });

  return auth.handler(c.req.raw);
});

app.get("/", (c) => c.text("Hello World"));
app.get("/health", (c) => c.json({ status: "ok" }));

app.use(
  "/trpc/*",
  trpcServer({
    router: trpcRouter,
    createContext: (opts, c) => {
      const requestId = createNanoId();
      const customLogger = createLogger({ requestId });

      return createContext({
        env: {
          db: c.env.DB,
          kv: c.env.KV,
          cdn: c.env.CDN,

          APP_URL: c.env.APP_URL,
          CDN_DOMAIN: c.env.CDN_DOMAIN,
          AUTH_SECRET: c.env.AUTH_SECRET,
          GOOGLE_CLIENT_ID: c.env.GOOGLE_CLIENT_ID,
          GOOGLE_CLIENT_SECRET: c.env.GOOGLE_CLIENT_SECRET,
          BREVO_API_KEY: c.env.BREVO_API_KEY,
          SENDER_NAME: c.env.SENDER_NAME,
          SENDER_EMAIL: c.env.SENDER_EMAIL,
          SUPERADMIN_EMAILS: c.env.SUPERADMIN_EMAILS.split(","),
        },
        fetchCreateContextFnOptions: opts,
        logger: customLogger,
        requestId,
        waitUntil: (promise) => c.executionCtx.waitUntil(promise),
      });
    },
  })
);

export default {
  fetch: app.fetch,
  scheduled(
    controller: ScheduledController,
    _env: Bindings,
    _ctx: ExecutionContext
  ) {
    switch (controller.cron) {
      case "0 0 * * *": // Every day at midnight
        console.log("Running daily scheduled task");
        break;

      default:
        break;
    }
    console.log("Running scheduled task");
  },
};
