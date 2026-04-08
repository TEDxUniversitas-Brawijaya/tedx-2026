# Development Guide

## Prerequisites

- **Bun** v1.3.6 or higher ([install guide](https://bun.sh))
- **Git** for version control
- **Cloudflare account** (free tier) for API development

## Initial Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/TEDxUniversitas-Brawijaya/tedx-2026.git
   cd tedx-2026
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```
   This installs all dependencies for all workspaces and sets up git hooks via Lefthook.

3. **Verify setup**
   ```bash
   bunx ultracite doctor
   ```

4. **Set up API resources** (if working on backend)
   ```bash
   cd apps/api
   cp .env.example .env
   # Edit .env with your credentials
   ```

## Development Commands

All commands from the **project root**:

### Run Apps

```bash
# Store + API
bun run dev:store

# Dashboard + API
bun run dev:dash

# Marketing site (www)
cd apps/www && bun run dev
```

### Code Quality

```bash
# Check code for issues
bun run check

# Auto-fix formatting and linting
bun run fix

# Type check all packages
bun run typecheck
```

### Database

```bash
# Generate migration after schema changes
bun run db:generate
```

## Code Quality

This project uses **Ultracite** for code quality enforcement:

- **Pre-commit hook**: Auto-runs `ultracite fix` on staged files
- **Manual**: Run `bun run fix` anytime

Code standards are defined in `.claude/CLAUDE.md`.

## Common Tasks

### Add Dependencies

```bash
# To specific app/package
cd apps/store
bun add zustand

# To root (dev tools only)
bun add -D vitest
```

### Manage API Resources

```bash
cd apps/api

# Deploy resources
bunx alchemy deploy

# Destroy resources (local dev)
bunx alchemy destroy

# Check status
bunx alchemy status
```

### Git Workflow

1. Update main: `git pull origin main`
2. Create branch: `git switch -c feat/your-feature`
3. Make changes
4. Check quality: `bun run fix && bun run typecheck`
5. Commit: `git commit -m "feat: add feature"`
6. Push: `git push -u origin feat/your-feature`
7. Open PR on GitHub

See [Workflow Guide](./workflow.md) for detailed conventions.
