# Dashboard

Admin panel for TEDx UB 2026, built with React and TanStack Router.

## Tech Stack

- **Framework**: React 19
- **Router**: TanStack Router
- **Data Fetching**: tRPC + TanStack Query
- **Styling**: Tailwind CSS
- **UI Components**: @tedx-2026/ui (shadcn/ui)
- **Deployment**: Cloudflare Workers

## Prerequisites

Before working on this app, ensure you've set up the monorepo:

```bash
# From the project root
bun install
```

This installs all dependencies and links workspace packages.

## Development Commands

All commands should be run from **this directory** (`apps/dashboard`):

### Start Development Server

```bash
bun run dev
```

Opens at `http://localhost:5174`

**Note**: The dashboard requires the API to be running. Use the root command to run both:

```bash
# From project root
bun run dev:dash
```

### Build for Production

```bash
bun run build
```

Output directory: `dist/`

### Type Check

```bash
bun run typecheck
```

## Project Structure

```
apps/dashboard/
├── src/
│   ├── features/        # Feature-based organization
│   ├── routes/          # TanStack Router file-based routes
│   ├── shared/          # Shared utilities and components
│   ├── main.tsx         # App entry point
│   └── routeTree.gen.ts # Auto-generated route tree
└── package.json
```

## Feature-Based Organization

Features are organized by domain:

```
src/features/
├── auth/               # Authentication
├── orders/             # Order management
├── products/           # Product management
├── attendance/         # Attendance tracking
└── analytics/          # Dashboard analytics
```

Each feature contains:
- `components/` - Presentational components
- `containers/` - Data fetching and logic
- `hooks/` - Feature-specific hooks

## Routing

Uses TanStack Router with file-based routing.

Route files in `src/routes/`:
- `__root.tsx` - Root layout
- `index.tsx` - Home page (`/`)
- `admin/route.tsx` - Admin layout
- `admin/orders/index.tsx` - Orders page (`/admin/orders`)

### Protected Routes

Use `beforeLoad` to protect routes:

```typescript
// See examples in src/routes/admin/
```

## Authentication

Admin authentication is required. Users must log in with an admin account.

## Deployment

Deployed as a Cloudflare Worker (SPA).

## Related Documentation

- [Architecture](../../docs/architecture.md)
- [Development](../../docs/development.md)
- [Workflow](../../docs/workflow.md)

## Note

Keep the dashboard simple, clean, and consistent. Use components from `@tedx-2026/ui` as-is.
