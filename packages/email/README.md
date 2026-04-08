# @tedx-2026/email

Email service for sending transactional emails via Brevo API.

## Purpose

Handles all email sending for the application (confirmations, refunds, notifications).

## Key Responsibilities

- Send transactional emails
- Manage email templates
- Integrate with Brevo API (direct HTTP calls, no SDK)

## Main Exports

- `createEmailService` - Email sending service
- Email templates
- Email types

## When to Use

- Sending order confirmation emails
- Sending refund confirmations
- Sending admin notifications

## Related

- [Architecture](../../docs/architecture.md)
