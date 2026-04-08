# @tedx-2026/types

Shared TypeScript types for domain models.

## Purpose

Defines domain model types that are used across multiple packages and apps.

## Key Responsibilities

- Define domain model types (User, Order, Product, Ticket)
- Share types between frontend and backend
- Ensure type consistency across codebase

## Main Exports

- `User` - User domain type
- `Order` - Order domain type
- `Product` - Product domain type
- `Ticket` - Ticket domain type
- Other shared domain types

## When to Use

- Defining types needed across multiple packages
- Sharing domain models between frontend and backend
- Ensuring type consistency

## Note

Only types that need to be used outside `packages/core` should be here. Internal types stay in their respective packages.

## Related

- [Architecture](../../docs/architecture.md)
