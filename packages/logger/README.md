# @tedx-2026/logger

Structured logging utilities for debugging and monitoring.

## Purpose

Provides wide event logging for better debugging and monitoring in production.

## Key Responsibilities

- Structured logging interface
- Wide events (canonical log lines)
- Child loggers with additional context
- Built on Cloudflare Workers console logging

## Main Exports

- `createLogger` - Logger instance
- `Logger` type
- Log level types

## When to Use

- Logging important events (order creation, payment success)
- Debugging production issues
- Tracking request flow

## Related

- [Architecture](../../docs/architecture.md)
- [loggingsucks.com](https://loggingsucks.com) - Wide event pattern

## Note

Currently handled by CF Workers built-in logging, but provides structure for future enhancements.
