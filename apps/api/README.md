# API

Backend API for TEDx UB 2026, built with Hono on Cloudflare Workers with tRPC for type-safe endpoints.

## Tech Stack

- **Framework**: Hono v4.7.9
- **RPC**: tRPC (via @hono/trpc-server)
- **Runtime**: Cloudflare Workers
- **Database**: D1 (SQLite)
- **Storage**: R2
- **Cache**: KV
- **Auth**: better-auth
- **IaC**: Alchemy

## Prerequisites

Before working on this app:

1. Set up the monorepo:
   ```bash
   # From project root
   bun install
   ```

2. Configure environment:
   ```bash
   # From apps/api
   cp .env.example .env
   # Edit .env with your Cloudflare credentials
   ```

3. Deploy local resources:
   ```bash
   bunx alchemy deploy
   ```

## Development Commands

All commands from **this directory** (`apps/api`):

### Start Development Server

```bash
bun run dev
```

Opens at `http://localhost:8787` (or `http://localhost:3000` when run via root scripts)

### Type Check

```bash
bun run typecheck
```

## Project Structure

```
apps/api/
├── src/
│   └── index.ts         # Main Hono app + tRPC setup
├── alchemy.run.ts       # Infrastructure as Code (D1, R2, KV)
├── .env.example         # Environment variables template
└── package.json         # Dependencies and scripts
```

## Infrastructure (Alchemy)

This app defines its own infrastructure via `alchemy.run.ts`:

- **D1 Database** - SQLite database with automatic migrations
- **R2 Buckets** - File storage (CDN and private storage)
- **KV Namespaces** - Caching and rate limiting

### Managing Resources

```bash
# Deploy resources
bunx alchemy deploy

# Destroy resources (local dev only)
bunx alchemy destroy

# Check status
bunx alchemy status
```

## Environment Variables

Required in `.env`:

- `AUTH_SECRET` - Secret for auth sessions
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth secret
- `SUPERADMIN_EMAILS` - Comma-separated superadmin emails

Cloudflare bindings (auto-configured by Alchemy):
- `DB` - D1 database
- `KV` - KV namespace
- `CDN` - R2 bucket

## Related Documentation

- [Architecture](../../docs/architecture.md)
- [API Design](../../docs/api-design.md)
- [ADR](../../docs/adr.md)

## Note

This app is the backend for both `apps/store` and `apps/dashboard`. It mounts the tRPC router from `@tedx-2026/api` and provides the context with all services.
