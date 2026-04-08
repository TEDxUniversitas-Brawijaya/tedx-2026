# Store

Ticketing and merchandise storefront for TEDx UB 2026, built with React and TanStack Router.

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

All commands should be run from **this directory** (`apps/store`):

### Start Development Server

```bash
bun run dev
```

Opens at `http://localhost:5173`

**Note**: The store requires the API to be running. Use the root command to run both:

```bash
# From project root
bun run dev:store
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
apps/store/
├── src/
│   ├── routes/          # TanStack Router file-based routes
│   ├── shared/          # Shared utilities and components
│   ├── main.tsx         # App entry point
│   └── routeTree.gen.ts # Auto-generated route tree
└── package.json
```

## Features

- **Ticket Purchasing** - Browse and buy event tickets
- **Merchandise Store** - Pre-order event merchandise
- **Order Status** - Check order and payment status
- **Refund Requests** - Submit refund requests

## Routing

Uses TanStack Router with file-based routing.

Route files in `src/routes/`:
- `__root.tsx` - Root layout
- `index.tsx` - Home page (`/`)
- `tickets/index.tsx` - Tickets page (`/tickets`)
- `merch/index.tsx` - Merchandise page (`/merch`)
- `order/[orderId]/index.tsx` - Order status (`/order/:orderId`)

## Environment Variables

Currently none required. All configuration comes from the API.

## Deployment

Deployed as a Cloudflare Worker (SPA).

## Related Documentation

- [Architecture](../../docs/architecture.md)
- [Development](../../docs/development.md)
- [Workflow](../../docs/workflow.md)
- [PRD](../../docs/prd.md)

## Note

This is the customer-facing storefront. No authentication is required for browsing and purchasing.
