# @tedx-2026/storage

R2 file storage service for Cloudflare R2.

## Purpose

Handles file uploads, downloads, and storage management using Cloudflare R2.

## Key Responsibilities

- Upload/download files to/from R2
- Generate signed URLs for private access
- Manage folder organization
- File validation (size, type)

## Main Exports

- `createR2Service` - R2 storage operations
- `R2Folder` - Folder type definitions
- File upload/download helpers

## When to Use

- Uploading payment proofs
- Storing ticket QR codes
- Handling user-uploaded files
- Serving static assets

## Related

- [Architecture](../../docs/architecture.md)
- [ERD](../../docs/erd.md) - See R2 Buckets section
