import alchemy from "alchemy";
import { D1Database, KVNamespace, Worker } from "alchemy/cloudflare";
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
});

const kv = await KVNamespace("kv", {
  title: `tedx-2026-kv-${app.stage}`,
});

export const worker = await Worker("api", {
  name: `tedx-2026-api-${app.stage}`,
  entrypoint: "./src/index.ts",
  compatibilityDate: "2026-04-01",
  compatibilityFlags: ["nodejs_compat"],
  bindings: {
    DB: db,
    KV: kv,
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
    body: `### Preview Deployment

**Commit:** \`${process.env.GITHUB_SHA}\`
**Preview URL:** ${worker.url}
**Deployed at:** ${new Date().toUTCString()}`,
  });
}

await app.finalize();
