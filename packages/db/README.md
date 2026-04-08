# @tedx-2026/db

Database access layer using Drizzle ORM for Cloudflare D1.

## Purpose

Provides database schemas, migrations, and query functions for accessing data.

## Key Responsibilities

- Define database schemas (tables, columns, relationships)
- Generate SQL migrations
- Provide query functions organized by domain
- Export Select/Insert types for type safety

## Main Exports

- `createUserQueries` - User database queries
- `createOrderQueries` - Order queries
- `createProductQueries` - Product queries
- Table schemas and types

## When to Use

- Reading/writing data from database
- Defining new database tables
- Creating domain-specific query functions

## Commands

- `bun run db:generate` - Generate migration from schema changes

## Related

- [Architecture](../../docs/architecture.md)
- [ERD](../../docs/erd.md)
