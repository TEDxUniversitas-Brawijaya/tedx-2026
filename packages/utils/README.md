# @tedx-2026/utils

Utility functions used across packages.

## Purpose

Provides common utility functions for packages (not directly used in apps).

## Key Responsibilities

- Generate unique identifiers (nanoid, UUIDv4, UUIDv7)
- Date formatting and manipulation
- String utilities
- Other helper functions

## Main Exports

- `generateNanoid` - Short unique IDs
- `generateUUIDv4` - UUID v4
- `generateUUIDv7` - UUID v7 (time-ordered)
- Date/string utilities

## When to Use

- Generating unique IDs for orders, tickets
- Formatting dates and times
- Common string manipulation

## Important

Only used within packages, not directly in apps. This avoids tight coupling between apps and utils.

## Related

- [Architecture](../../docs/architecture.md)
- [ERD](../../docs/erd.md) - See ID Strategy section
