# Development Guide

## Prerequisites

- **Bun** v1.3.6 or higher ([install guide](https://bun.sh))
- **Git** for version control

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

## Development Commands

All commands are run from the **project root**:

### Code Quality

```bash
# Check code for issues
bun run lint

# Automatically fix formatting and linting issues
bun run lint:fix
```

### Working with Apps

See each app's README in `apps/` for specific development commands.

## Code Quality Workflow

This project uses **Ultracite** for strict code quality enforcement:

### Automatic Formatting

- **Pre-commit hook**: Automatically runs `ultracite fix` on staged files before each commit
- **Manual formatting**: Run `bun run lint:fix` anytime

### What Gets Checked

- TypeScript/JavaScript syntax and best practices
- Code complexity and maintainability
- React/JSX patterns (when applicable)
- Accessibility standards
- Performance anti-patterns
- Security issues

See `.claude/CLAUDE.md` for detailed code standards.

## Common Tasks

### Adding a New Dependency

```bash
# Add to a specific workspace
cd apps/www
bun add <package-name>

# Add to root (for development tools)
bun add -D <package-name>
```

### TypeScript Type Checking

```bash
# Check types across all workspaces
bun x tsc --noEmit
```

### Git Workflow

1. Create a new branch:
   ```bash
   git pull origin main # update local main
   git switch -c feat/your-feature-name # or fix/your-bugfix-name
   ```
2. Make your changes
3. Stage files
4. Commit, make sure to write clear commit messages.
5. Push
6. Open a Pull Request on GitHub, targeting `main`

See [`WORKFLOW.md`](./WORKFLOW.md) for detailed contribution guidelines including:
- Code and asset naming conventions
- Commit message format
- Branch naming standards
- Pull request best practices
