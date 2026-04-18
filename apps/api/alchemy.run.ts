import alchemy from "alchemy";
import { D1Database, KVNamespace, R2Bucket, Worker } from "alchemy/cloudflare";
import { GitHubComment } from "alchemy/github";
import { CloudflareStateStore } from "alchemy/state";

const app = await alchemy("tedx-2026-api", {
  stateStore:
    process.env.NODE_ENV === "production"
      ? (scope) =>
          new CloudflareStateStore(scope, {
            scriptName: "tedx-2026-api-state-store",
          })
      : undefined, // Uses default FileSystemStateStore
  password: process.env.ALCHEMY_PASSWORD,
});

const db = await D1Database("db", {
  name: `tedx-2026-db-${app.stage}`,
  migrationsDir: "./node_modules/@tedx-2026/db/migrations",
  dev: {
    remote: true,
  },
});

const kv = await KVNamespace("kv", {
  title: `tedx-2026-kv-${app.stage}`,
});

const cdn = await R2Bucket("cdn", {
  name: app.stage === "prod" ? "tedx-cdn" : `tedx-2026-cdn-${app.stage}`,
  domains:
    app.stage === "prod" ? ["cdn.tedxuniversitasbrawijaya.com"] : undefined,
  adopt: true,
  devDomain: true,
  dev: {
    remote: true,
  },
  cors: [
    {
      allowed: {
        origins: [
          "https://*.tedxuniversitasbrawijaya.com",
          "https://*.ahargunyllib.workers.dev",
          "http://localhost:5173",
        ],
        methods: ["GET"],
        headers: ["*"],
      },
    },
  ],
});

console.log("CDN URL:", cdn.devDomain);

export const worker = await Worker("api", {
  name: `tedx-2026-api-${app.stage}`,
  entrypoint: "./src/index.ts",
  compatibilityDate: "2026-04-01",
  compatibilityFlags: ["nodejs_compat"],
  bindings: {
    DB: db,
    KV: kv,
    CDN: cdn,
    CDN_DOMAIN: cdn.devDomain ?? "cdn.tedxuniversitasbrawijaya.com",
    APP_URL: Worker.DevUrl,
    AUTH_SECRET: alchemy.secret(process.env.AUTH_SECRET),
    GOOGLE_CLIENT_ID: alchemy.secret(process.env.GOOGLE_CLIENT_ID),
    GOOGLE_CLIENT_SECRET: alchemy.secret(process.env.GOOGLE_CLIENT_SECRET),
    BREVO_API_KEY: alchemy.secret(process.env.BREVO_API_KEY),
    SENDER_NAME: alchemy.secret(process.env.SENDER_NAME),
    SENDER_EMAIL: alchemy.secret(process.env.SENDER_EMAIL),
    SUPERADMIN_EMAILS: alchemy.secret(process.env.SUPERADMIN_EMAILS),
    TURNSTILE_SECRET_KEY: alchemy.secret(process.env.TURNSTILE_SECRET_KEY),
  },
  bundle: {
    external: ["bun:sqlite", "@libsql/client"],
  },
  observability: {
    enabled: true,
    logs: {
      enabled: true,
      headSamplingRate: 1,
      invocationLogs: true,
      persist: true,
    },
    traces: {
      enabled: true,
      headSamplingRate: 1,
      persist: true,
    },
  },
  domains: app.stage === "prod" ? ["api.ahargunyllib.dev"] : undefined,
  dev: {
    port: 3000,
  },
});

if (process.env.PULL_REQUEST) {
  // if this is a PR, add a comment to the PR with the preview URL
  // it will auto-update with each push
  await GitHubComment("preview-comment", {
    owner: "tedxuniversitas-brawijaya",
    repository: "tedx-2026",
    issueNumber: Number(process.env.PULL_REQUEST),
    body: `### Preview API Deployment

**Commit:** \`${process.env.GITHUB_SHA}\`
**Preview URL:** ${worker.url}
**Deployed at:** ${new Date().toUTCString()}`,
  });
}

await app.finalize();
