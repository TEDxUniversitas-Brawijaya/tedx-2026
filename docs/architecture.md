# Architecture

This project follows Clean Architecture (Hexagonal Architecture) with Dependency Injection to ensure maintainability and testability.

## Core Principles

### Clean Architecture Layers

The codebase is organized into four layers:

1. **Presentation Layer** - UI and user interactions (apps/store, apps/dashboard)
2. **API Layer** - Request handling and validation (apps/api, packages/api)
3. **Domain Layer** - Business logic (packages/core)
4. **Infrastructure Layer** - External systems (packages/db, kv, storage, email, queue, logger)

**Dependency Rule**: Dependencies only point inward. Inner layers never depend on outer layers.

### Dependency Injection Pattern

All services, queries, and operations follow a consistent pattern:

1. Define a type interface for the service
2. Define a context type listing dependencies
3. Export a create function that takes context and returns the service instance
4. Export both the type and create function from index.ts

This allows:
- Easy testing with mocked dependencies
- Clear contracts between layers
- Flexibility to swap implementations

## Package Organization

### Infrastructure Packages

- **db** - Database schemas, migrations, and query functions (Drizzle ORM)
- **kv** - Cloudflare KV operations for caching and rate limiting
- **storage** - R2 file storage service
- **email** - Email sending via Brevo API
- **queue** - Background job processing with Cloudflare Queues
- **logger** - Structured logging utilities

### Domain Packages

- **core** - Business logic services (order processing, payment, etc.)
- **types** - Shared domain types used across packages

### API Packages

- **api** - tRPC router definitions and Zod validation schemas
- **auth** - Authentication and session management (better-auth)

### Shared Packages

- **ui** - Shared React components (shadcn/ui)
- **utils** - Utility functions (ID generation, date formatting)
- **tsconfig** - Shared TypeScript configuration

## Layer Responsibilities

### Presentation (apps/store, apps/dashboard)

- Render UI and handle user interactions
- Use tRPC client to call API
- No business logic

### API (apps/api, packages/api)

- Validate requests with Zod schemas
- Check authentication and authorization
- Call services from core package
- Translate domain errors to API errors
- No business logic

### Domain (packages/core)

- Implement all business rules and logic
- Orchestrate queries, operations, and services
- Throw domain-specific errors (AppError)
- Independent of frameworks (no Hono, tRPC, React knowledge)

### Infrastructure (packages/db, kv, etc.)

- Access external systems (database, storage, KV, email)
- Provide interfaces for data access
- No business logic

## Key Patterns

### Context Pattern

Services receive dependencies via context:
- Database queries
- KV operations
- Other services
- Logger
- waitUntil function

### Error Handling

- **In core services**: Throw AppError with error codes
- **In API layer**: Translate AppError to TRPCError

### Saga Pattern

For operations needing rollback on failure (e.g., reserve stock, create order, charge payment - rollback stock if payment fails).

### waitUntil Pattern

Use Cloudflare Workers waitUntil to run async operations after response is sent (e.g., sending emails).

## Development Workflow

When implementing a new feature:

1. Define types in packages/types if needed
2. Create/update database schema in packages/db
3. Generate migration with bun run db:generate
4. Create queries in packages/db
5. Create KV operations in packages/kv if needed
6. Create services in packages/core
7. Wire up context in apps/api
8. Create tRPC procedures in packages/api
9. Create UI in apps/store or apps/dashboard
10. Test the feature

## Related Documentation

- [ADR](./adr.md) - Architectural Decision Records
- [API Design](./api-design.md) - API endpoints and contracts
- [ERD](./erd.md) - Database schema
- [PRD](./prd.md) - Product requirements
- Package READMEs in packages/*/README.md
