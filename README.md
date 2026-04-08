# TEDx Universitas Brawijaya 2026

Marketing website, ticketing system, merchandise store, and admin panel for TEDx UB 2026. Built as a TypeScript monorepo on Cloudflare free tier.

## Project Overview

This is a full-stack monorepo containing:

- **Marketing Website** (`apps/www`) - Astro static site
- **Ticket Store** (`apps/store`) - React SPA for ticket and merch purchasing
- **Admin Dashboard** (`apps/dashboard`) - React SPA for order management
- **Backend API** (`apps/api`) - Hono + tRPC on Cloudflare Workers

## Tech Stack

- **Runtime**: Cloudflare Workers
- **Package Manager**: Bun
- **Database**: Cloudflare D1 (SQLite)
- **Storage**: Cloudflare R2
- **Cache**: Cloudflare KV
- **Queue**: Cloudflare Queues
- **Frontend**: React 19 + TanStack Router
- **Backend**: Hono + tRPC
- **ORM**: Drizzle
- **Auth**: better-auth
- **IaC**: Alchemy
- **Validation**: Zod
- **UI**: shadcn/ui + Tailwind CSS

## Quick Start

### Prerequisites

- Bun v1.3.6 or higher ([install](https://bun.sh))
- Cloudflare account (free tier)

### Installation

```bash
# Clone the repository
git clone https://github.com/TEDxUniversitas-Brawijaya/tedx-2026.git
cd tedx-2026

# Install dependencies
bun install

# Verify setup
bunx ultracite doctor
```

### Development

```bash
# Login to Cloudflare (using alchemy)
bunx alchemy configure

# Run store + API
bun run dev:store

# Run dashboard + API
bun run dev:dash

# Run marketing site
cd apps/www && bun run dev

# Run API only
cd apps/api && bun run dev
```

### Code Quality

```bash
# Check for issues
bun run check

# Auto-fix issues
bun run fix

# Type check
bun run typecheck
```

## Monorepo Structure

```
tedx-2026/
├── apps/               # Applications
│   ├── www/           # Marketing website (Astro)
│   ├── store/         # Ticket store (React)
│   ├── dashboard/     # Admin panel (React)
│   └── api/           # Backend API (Hono + tRPC)
│
├── packages/          # Shared packages
│   ├── api/          # tRPC routes & schemas
│   ├── auth/         # Authentication (better-auth)
│   ├── core/         # Business logic
│   ├── db/           # Database (Drizzle ORM)
│   ├── email/        # Email service
│   ├── kv/           # KV operations
│   ├── logger/       # Logging utilities
│   ├── queue/        # Queue management
│   ├── storage/      # R2 storage
│   ├── types/        # Shared types
│   ├── ui/           # UI components (shadcn/ui)
│   ├── utils/        # Utilities
│   └── tsconfig/     # TypeScript config
│
└── docs/             # Documentation
    ├── architecture.md  # Architecture guide
    ├── development.md   # Development setup
    ├── workflow.md      # Git workflow & conventions
    ├── api-design.md    # API endpoints
    ├── adr.md           # Architecture decisions
    ├── erd.md           # Database schema
    ├── prd.md           # Product requirements
    └── monorepo.md      # Monorepo guide
```

## Documentation

### Getting Started

- [Development Guide](./docs/development.md) - Setup and commands
- [Workflow Guide](./docs/workflow.md) - Git workflow and conventions
- [Monorepo Guide](./docs/monorepo.md) - How the monorepo works

### Architecture & Design

- [Architecture](./docs/architecture.md) - Clean architecture and patterns
- [API Design](./docs/api-design.md) - API endpoints and contracts
- [ADR](./docs/adr.md) - Architecture Decision Records
- [ERD](./docs/erd.md) - Database schema and relationships
- [PRD](./docs/prd.md) - Product requirements

### Packages & Apps

Each package and app has its own README:
- Package READMEs: `packages/*/README.md`
- App READMEs: `apps/*/README.md`

## Key Features

### Ticketing

- Limited inventory management
- Bundle support (multi-day tickets)
- QR code generation per event day
- Stock caching with KV
- Order expiry (20 minutes)
- Email confirmations

### Merchandise

- Pre-order system (no inventory limits)
- Variant support (size, color)
- Bundle options
- On-site pickup only

### Payment

- Midtrans QRIS (instant, webhook-based)
- Manual QRIS upload (admin verification)
- System-determined payment mode

### Admin Panel

- Order management
- Payment verification
- Attendance tracking (QR scanner)
- Merch pickup tracking
- Analytics dashboard
- CSV export

### Refunds

- Tokenized refund links (sent via email)
- H-3 deadline enforcement
- Admin approval workflow

## Architecture

This project follows **Clean Architecture** with these layers:

1. **Presentation** - UI (React apps)
2. **API** - Request handling (tRPC + Zod validation)
3. **Domain** - Business logic (`packages/core`)
4. **Infrastructure** - External systems (`packages/db`, `kv`, etc.)

Uses **Dependency Injection** throughout for testability and maintainability.

See [Architecture Guide](./docs/architecture.md) for details.

## Contributing

We welcome contributions! Please read:

- [Development Guide](./docs/development.md) - Setup and commands
- [Workflow Guide](./docs/workflow.md) - Git conventions and PR process

### Quick Contribution Steps

1. Create a branch: `git switch -c feat/your-feature`
2. Make changes and commit: `git commit -m "feat: add feature"`
3. Run quality checks: `bun run fix && bun run typecheck`
4. Push and open a PR on GitHub

## License
This project is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License. See [LICENSE](./LICENSE) for details.

## Links

- Website: [tedxuniversitasbrawijaya.com](https://tedxuniversitasbrawijaya.com)
- Instagram: [@tedxuniversitasbrawijaya](https://instagram.com/tedxuniversitasbrawijaya)
- GitHub: [TEDxUniversitas-Brawijaya/tedx-2026](https://github.com/TEDxUniversitas-Brawijaya/tedx-2026)
