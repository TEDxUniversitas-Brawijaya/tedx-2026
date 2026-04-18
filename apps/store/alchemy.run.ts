import alchemy from "alchemy";
import { Vite } from "alchemy/cloudflare";
import { GitHubComment } from "alchemy/github";
import { CloudflareStateStore } from "alchemy/state";

const app = await alchemy("tedx-2026-store", {
  stateStore:
    process.env.NODE_ENV === "production"
      ? (scope) =>
          new CloudflareStateStore(scope, {
            scriptName: "tedx-2026-api-state-store",
          })
      : undefined, // Uses default FileSystemStateStore
  password: process.env.ALCHEMY_PASSWORD,
});

const worker = await Vite("store", {
  name: `tedx-2026-store-${app.stage}`,
  bindings: {
    VITE_PUBLIC_API_URL: process.env.API_URL || "http://localhost:3000",
    VITE_PUBLIC_TURNSTILE_SITE_KEY:
      process.env.VITE_PUBLIC_TURNSTILE_SITE_KEY || "1x00000000000000000000AA",
  },
  domains:
    app.stage === "prod" ? ["store.tedxuniversitasbrawijaya.com"] : undefined,
  // https://github.com/alchemy-run/alchemy/pull/1274
  assets: "./dist/client",
});

if (process.env.PULL_REQUEST) {
  // if this is a PR, add a comment to the PR with the preview URL
  // it will auto-update with each push
  await GitHubComment("preview-comment", {
    owner: "tedxuniversitas-brawijaya",
    repository: "tedx-2026",
    issueNumber: Number(process.env.PULL_REQUEST),
    body: `### Preview Store Deployment

**Commit:** \`${process.env.GITHUB_SHA}\`
**Preview URL:** ${worker.url}
**Deployed at:** ${new Date().toUTCString()}`,
  });
}

console.log(`Store deployed at: ${worker.url}`);

await app.finalize();
