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
  SUPERADMIN_EMAILS: string; // Comma-separated list of superadmin emails
};

const app = new Hono<{
  Bindings: Bindings;
}>();

app.use(logger());

// TODO: SCALABILITY - Add rate limiting middleware
// Current implementation has no rate limiting, making it vulnerable to:
// - DDoS attacks
// - Resource exhaustion
// - API abuse
// Recommended solutions:
// 1. Use Cloudflare Workers KV for rate limiting state
// 2. Implement sliding window algorithm (e.g., 100 requests per minute per IP)
// 3. Add different limits for authenticated vs unauthenticated users
// 4. Return 429 Too Many Requests with Retry-After header
// Example: app.use(rateLimit({ windowMs: 60000, maxRequests: 100 }))

app.use(
  "/*",
  cors({
    origin: (origin) => {
      // TODO: SECURITY VULNERABILITY - Fix CORS origin matching
      // Current implementation uses .includes() which is unsafe:
      // - "evil-localhost.com" would match "localhost"
      // - "tedxuniversitasbrawijaya.com.attacker.com" would match "tedxuniversitasbrawijaya.com"
      // Fix: Use exact domain matching or regex with proper anchoring:
      // const allowedOrigins = ["http://localhost:5173", "https://tedxuniversitasbrawijaya.com"];
      // return allowedOrigins.includes(origin) ? origin : null;
      // Or use regex: /^https:\/\/(.*\.)?ahargunyllib\.dev$/
      const allowedOrigins = [
        "localhost",
        "tedxuniversitasbrawijaya.com",
        "workers.dev",
      ];
      if (
        allowedOrigins.some((allowedOrigin) => origin.includes(allowedOrigin))
      ) {
        return origin;
      }
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
    waitUntil: c.executionCtx.waitUntil,
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
          SUPERADMIN_EMAILS: c.env.SUPERADMIN_EMAILS.split(","),
        },
        fetchCreateContextFnOptions: opts,
        logger: customLogger,
        requestId,
        waitUntil: c.executionCtx.waitUntil,
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
