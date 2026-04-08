# @tedx-2026/kv

Cloudflare KV operations for caching and rate limiting.

## Purpose

Provides higher-level KV operations for caching, cooldowns, and rate limiting.

## Key Responsibilities

- Stock caching (read cache, D1 is source of truth)
- Email cooldown management
- Rate limiting
- Centralized KV key management

## Main Exports

- `createCooldownOperations` - Cooldown checking
- `createRateLimitOperations` - Rate limiting
- `createStockCacheOperations` - Stock caching
- `KV_KEYS` - Key definitions

## When to Use

- Implementing cooldowns (prevent spam)
- Caching frequently accessed data
- Rate limiting API endpoints
- Temporary data storage with TTL

## Related

- [Architecture](../../docs/architecture.md)
- [ADR](../../docs/adr.md) - See ADR-002 for stock caching strategy
