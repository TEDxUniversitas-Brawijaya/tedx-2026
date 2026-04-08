# @tedx-2026/api

tRPC router definitions and Zod validation schemas for the API layer.

## Purpose

Defines the API contract between frontend and backend. Handles request validation, authentication, and error translation.

## Key Responsibilities

- Define tRPC procedures (API endpoints)
- Validate requests with Zod schemas
- Check authentication and authorization
- Translate AppError to TRPCError
- Delegate business logic to @tedx-2026/core

## Main Exports

- `appRouter` - Main tRPC router
- `createContext` - tRPC context creation
- Input/output schemas (Zod)
- Middleware (auth, error handling)

## When to Use

- Creating new API endpoints
- Defining request validation schemas
- Implementing authentication checks

## Related

- [Architecture](../../docs/architecture.md)
- [API Design](../../docs/api-design.md)
