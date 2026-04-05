import { schema, type DB } from "@tedx-2026/db";
import { createUUIDv7 } from "@tedx-2026/utils";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

type CreateAuthOptions = {
  secret: string;
  baseURL: string;
  googleClientId: string;
  googleClientSecret: string;
  waitUntil: (promise: Promise<unknown>) => void;
};

export const createAuth = (
  db: DB,
  {
    secret,
    baseURL,
    googleClientId,
    googleClientSecret,
    waitUntil,
  }: CreateAuthOptions
) => {
  return betterAuth({
    appName: "TEDx Universitas Brawijaya 2026",
    database: drizzleAdapter(db, {
      provider: "sqlite",
      schema: {
        users: schema.userTable,
        sessions: schema.sessionTable,
        accounts: schema.accountTable,
        verifications: schema.verificationTable,
      },
      usePlural: true,
    }),
    trustedOrigins: [
      "http://localhost:3000",
      "https://*.tedxuniversitasbrawijaya.com",
      "https://*.ahargunyllib.workers.dev",
    ],
    baseURL: {
      baseURL,
      allowedHosts: [
        "localhost:*",
        "*.tedxuniversitasbrawijaya.com",
        "*.ahargunyllib.workers.dev",
      ],
    },
    basePath: "/auth",
    emailAndPassword: { enabled: true, disableSignUp: true },
    socialProviders: {
      google: {
        clientId: googleClientId,
        clientSecret: googleClientSecret,
      },
    },
    session: {
      cookieCache: {
        enabled: true,
        maxAge: 3600, // 1 hour
      },
    },
    secret,
    user: {
      additionalFields: {
        role: {
          type: ["admin", "superadmin"],
          defaultValue: "admin",
          input: true,
          required: true,
        },
      },
    },
    advanced: {
      defaultCookieAttributes: {
        secure: true,
        sameSite: "lax",
      },
      database: {
        generateId: () => createUUIDv7(),
      },
      backgroundTasks: {
        handler: waitUntil,
      },
    },
    experimental: {
      joins: true,
    },
  });
};

export type Auth = ReturnType<typeof createAuth>;
export type Session = Auth["$Infer"]["Session"];
