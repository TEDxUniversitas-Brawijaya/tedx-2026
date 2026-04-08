# @tedx-2026/core

Core business logic and domain services.

## Purpose

Contains all business rules, logic, and domain-specific operations. This is the heart of the application.

## Key Responsibilities

- Implement business rules and validation
- Orchestrate queries, operations, and external services
- Define and throw domain errors (AppError)
- Independent of frameworks (no Hono, tRPC, React)
- Easy to test with mocked dependencies

## Main Exports

- `createUserService` - User business logic
- `createOrderService` - Order processing
- `createFileService` - File management
- `AppError` - Domain error class
- `ErrorCode` - Error codes

## When to Use

- Implementing business logic
- Enforcing business rules
- Orchestrating multiple operations

## Related

- [Architecture](../../docs/architecture.md)
- [ADR](../../docs/adr.md)
