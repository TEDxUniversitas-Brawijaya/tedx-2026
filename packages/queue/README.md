# @tedx-2026/queue

Background job processing using Cloudflare Queues.

## Purpose

Handles asynchronous task processing (emails, webhooks, long-running operations).

## Key Responsibilities

- Queue background tasks
- Define queue producers and consumers
- Handle job retries and failures

## Main Exports

- `createQueueProducer` - Enqueue jobs
- `createQueueConsumer` - Process jobs
- Queue message types

## When to Use

- Sending emails asynchronously
- Processing webhooks in background
- Handling long-running tasks

## Related

- [Architecture](../../docs/architecture.md)
