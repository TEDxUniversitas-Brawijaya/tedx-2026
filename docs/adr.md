# **Architecture Decision Records**

## **ADR-001: Monorepo Structure**

**Context:** We need multiple apps (marketing site, store, admin panel, API) with shared code. Clear separation of concerns is needed while sharing types, validators, and business logic.

**Decision:** Monorepo with pnpm workspaces.

```
apps/
  www/          — Astro, marketing site (existing). Has its own alchemy IaC.
  store/        — React SPA (TanStack Router), ticketing + merch storefront. Has its own alchemy IaC.
  admin/        — React SPA (TanStack Router), admin panel. Has its own alchemy IaC.
  api/          — Hono on CF Workers, tRPC server. Has its own alchemy IaC.

packages/
  api/          — tRPC router definitions, Zod schemas (DTOs)
  auth/         — better-auth config and helpers
  core/         — Business logic (services)
  db/           — Drizzle schema, migrations, queries (src/queries/)
  email/        — Email templates and SMTP sending
  kv/           — KV helpers (stock counter, cooldown, rate limit)
  logger/       — Structured logging utilities
  queue/        — CF Queue producers and consumers
  storage/      — R2 helpers (upload, signed URLs for both cdn and storage buckets)
  utils/        — Shared utilities
```
**Consequences:*** Clear ownership per package, easier code review

- `packages/core` depends on `packages/db`, `packages/kv`, `packages/email`, `packages/queue`, `packages/logger`; business logic lives here, apps only call core
- `apps/api` mounts the tRPC router on Hono, which delegates to `packages/core`
- `apps/store` and `apps/admin` are both React SPAs with TanStack Router, deployed as CF Workers
- End-to-end type safety via tRPC between frontend and backend
- Each app owns its own infrastructure definition via Alchemy (IaC), keeping deploy concerns co-located with the app
- No centralized `packages/infra` — infra is per-app

---

## **ADR-002: D1 Stock Decrement + KV Read Cache**

**Context:** Tickets are limited (<200 items), estimated traffic is 10-50k. We need a mechanism that handles concurrent purchases without overselling. D1 does not support `db.transaction()` (Drizzle throws `Cannot use BEGIN TRANSACTION`), but single SQL statements are atomic, and `db.batch()` provides atomic multi-statement writes.

**Decision:** D1 is the single source of truth for both stock and order data. KV is used only as a read cache for displaying stock on the storefront.

Flow:
1) Single Drizzle `UPDATE` on products table: `SET stock = stock - quantity WHERE id = ? AND stock >= quantity`
2) Check result's `rowsAffected` in JS: if 0, return "sold out"
3) If 1, proceed to `db.batch()` to insert order + order items + payment (atomic)
4) If step 3 fails, compensating `UPDATE stock = stock + quantity` to release (saga)
5) After successful write, update KV read cache with new stock value

KV read cache:
- `stock:{productId}` stores the latest known stock count
- Updated after every stock-changing operation (checkout, expiry, refund)
- Storefront reads from KV (fast, globally distributed) instead of hitting D1 on every page load
- Stale data is acceptable for display purposes (buyer gets real-time check at checkout via D1)

**Consequences:**
- Single SQL UPDATE is atomic by itself. D1's single-writer model serializes all writes, so no two checkouts can race on the same stock
- No overselling is possible: the WHERE guard guarantees stock never goes below 0
- Stock decrement and order creation are NOT in the same atomic batch (Drizzle limitation: can't interleave JS between batch statements). The saga pattern (ADR-005) handles the gap.
- KV cache may briefly show stale stock counts, but this only affects the display. The actual purchase path always goes through D1.
- Admin stock updates write to D1 first, then update KV cache
- A periodic cron job can reconcile KV cache with D1 to fix any drift

---

## **ADR-003: Payment Mode (System-Determined)**

**Context:** We are applying for Midtrans merchant approval, but it may not be granted in time. We need the system to support two payment modes: Midtrans QRIS (instant, webhook-confirmed) and manual QRIS upload (buyer uploads proof, admin verifies). The buyer does not choose — the system operates in one mode at a time.

**Decision:** A `payment_mode` config value in the DB determines the active payment method system-wide. All orders use whichever mode is active at the time of checkout.

- **Midtrans mode**: Order created -> Midtrans QRIS generated -> buyer pays -> Midtrans webhook confirms -> order status becomes `paid`
- **Manual mode**: Order created -> buyer uploads QRIS proof -> order status becomes `pending_verification` -> admin approves/rejects

Switching mode: update the `payment_mode` config value. No code change needed.

**Consequences:**
- Clean separation: the system never mixes payment flows within a single order
- Easy to switch once Midtrans is approved — just flip the config
- Both flows share the same order status state machine; `pending_verification` is only reachable in manual mode
- Manual mode requires admin capacity for verification within 24 hours

---

## **ADR-004: Payment State Machine**

**Context:** Orders have a 20-minute payment timeout. In manual mode, unverified payments auto-reject after 24 hours. A clear state machine is needed to keep the order lifecycle predictable.

**Decision:** See the mermaid diagram in ERD.md for the full visual.

Key transitions:
- `pending_payment` -> `paid` (Midtrans webhook, in Midtrans mode)
- `pending_payment` -> `pending_verification` (proof uploaded, in manual mode)
- `pending_payment` -> `expired` (20-min cron)
- `pending_verification` -> `paid` (admin approve)
- `pending_verification` -> `rejected` (admin reject)
- `pending_verification` -> `expired` (24h cron)
- `paid` -> `refund_requested` (buyer via email link)
- `refund_requested` -> `refunded` (admin approve; stock released)
- `refund_requested` -> `paid` (admin reject; stays paid)

**Consequences:**
- Every status transition must be validated in `packages/core`
- Expired orders: CF Cron Trigger runs every minute, checks `status = 'pending_payment' AND expires_at < now()`
- Manual 24h auto-reject: same cron checks `pending_verification` orders where `created_at + 24h < now()`
- Race condition: buyer pays at 19:59, cron runs at 20:00. Midtrans webhook must check order status before updating.

---

## **ADR-005: Saga Pattern for Order Creation**

**Context:** Creating an order involves multiple steps across different systems: reserve stock in KV, create the order in D1, create payment record, set cooldown in KV, set expiry in KV. If any step fails mid-way, the system can end up in an inconsistent state (e.g. stock reserved but order not created).

**Decision:** Implement a saga pattern with compensating actions in `packages/core`.

Steps (in order):
1) Validate inputs (idempotency check, cooldown check, product existence, CAPTCHA)
2) Reserve stock in D1 (single UPDATE with WHERE guard, check rowsAffected)
3) Create order + order items in D1 (single transaction)
4) Create Midtrans transaction (if Midtrans mode) or pending payment record in D1 (if manual mode)
5) Set cooldown in KV
6) Set order expiry marker in KV
7) Update KV stock read cache

Compensation (on failure at any step):
- If step 3 fails: release stock in D1 via compensating UPDATE (reverse step 2)
- If step 4 fails: delete order from D1 (reverse step 3), release stock in D1 (reverse step 2)
- Steps 5, 6, and 7 are non-critical; failure is logged but does not roll back the order

**Consequences:**
- No distributed transaction manager needed; saga is implemented as sequential steps with try/catch in the service layer
- Each step has a clearly defined compensating action
- Non-critical steps (cooldown, expiry marker) are fire-and-forget; worst case, a buyer can order again without cooldown or an expired order lingers until the next cron run
- The pattern is reusable for refund processing (release stock, update order, queue email)

---

## **ADR-006: Order Expiry and Stock Release**

**Context:** Pending payment orders must expire after 20 minutes and stock must be released. Cloudflare offers several options: Cron Triggers, Durable Objects, KV TTL.

**Decision:** Combination of KV TTL as a marker + Cron Trigger for execution.

1) When an order is created, set KV key `order_expiry:{orderId}` with TTL 1200s (20 min)
2) CF Cron Trigger runs every minute
3) Cron queries D1 for orders where `status = 'pending_payment' AND expires_at < now()`
4) For each expired order: release stock in KV, update order status to `expired` in D1

Why not Durable Objects:
- Durable Objects can get expensive outside the free tier
- Cron Triggers are sufficient at 1-minute granularity
- Worst case: an order expires 1 minute late, which is acceptable

**Consequences:**
- Stock is "locked" for a maximum of 21 minutes (20 min TTL + 1 min cron interval)
- Cron handler in `apps/api` calls `packages/core` expiry service
- Must handle the race condition where a buyer pays at 19:59 and the cron runs at 20:00

---

## **ADR-007: QR Code Strategy**

**Context:** Buyers receive a QR code per event day. Bundles can span 1-3 event days. QR codes must be secure (prevent forgery) and valid only on the correct day.

**Decision:** Random nanoid stored in DB, 1 QR per ticket per event day.* `tickets.qr_code` = nanoid (21 chars by default; shorter and URL-safe compared to UUID)

- QR content = just the nanoid (simple, short, fast to scan)
- Lookup on scan: admin inputs code / scans QR -> API looks up `tickets` by `qr_code` -> verifies `event_day` matches today -> updates `attendance_status`
- Forgery prevention: nanoid uses a cryptographically strong random generator; 21-char nanoid has \~126 bits of entropy

Why not HMAC-signed payload:
- Still requires a server round trip for attendance tracking
- UUID lookup is simpler and directly enables DB-side attendance tracking
- Signed payloads make the QR content longer and harder to scan

Why not JWT:
- Overkill for this use case
- Short expiry would require refresh logic

**Consequences:**
- Each scan = 1 DB read. Acceptable since scan rate is low (hundreds per hour)
- QR validation: the API checks that `tickets.event_day` matches the current event day (from the config table). Wrong day = reject.
- Duplicate scan prevention: check `attendance_status`; if already `checked_in`, return a warning

---

## **ADR-008: Refund Token Security**

**Context:** The refund link is sent via email and is not reachable from website navigation. It must be secure enough to prevent abuse.

**Decision:** Nanoid token stored in `orders.refund_token`, generated when the order is confirmed.

URL format: `https://store.tedxuniversitasbrawijaya.com/refund/{refundToken}`

Validation:
1) Token exists in DB
2) Order status = `paid`
3) Current date <= event date - 3 days (H-3 deadline)
4) No existing pending refund request for this order

**Consequences:**
- Token is unguessable (nanoid, \~126 bits of entropy)
- If the link is shared, someone else could submit a refund. Mitigation: the refund form requires bank details, and an admin manually reviews every request.
- One-time use: after a refund request is submitted, subsequent requests are rejected
- No expiry on the token itself; expiry logic is based on the event date config

---

## **ADR-009: Cooldown Enforcement**

**Context:** 10-minute cooldown per buyer before they can place another order. No user auth, so enforcement is by email.

**Decision:** KV TTL-based cooldown keyed by email. On order creation, store the cooldown expiry timestamp in KV with a 600-second TTL. On the next checkout attempt, check for an existing cooldown key; if present, reject with the remaining wait time.

**Consequences:**
- Enforced by email only. A different phone number with the same email is still blocked.
- Emails can be faked, but combined with CAPTCHA this makes abuse harder
- KV TTL handles auto-cleanup; no manual expiry needed
- Cooldown is set after the order is created (not after form submission), so failed orders do not trigger cooldown

---

## **ADR-010: better-auth for Admin Authentication**

**Context:** The admin panel needs auth. Small team, 10-day timeline, so a solution that's fast to set up but production-ready is needed.

**Decision:** Use better-auth with the D1 adapter.

- Email/password login (simplest option)
- Superadmin adds admins by creating their account directly (no invite flow, no email verification for admins)
- Role stored as a custom field in the better-auth user schema
- Session management by better-auth (cookie-based)

**Consequences:**
- Fast setup, well-documented, TypeScript-first
- Handles password hashing, session rotation, CSRF protection out of the box
- Custom role field requires extension via better-auth plugin/config
- Admin creation flow: superadmin calls a tRPC procedure that creates a user via better-auth's admin API
- Hono middleware needed to verify sessions and check roles on protected tRPC procedures***

## **ADR-011: Email via SMTP (Brevo)**

**Context:** Emails must be reliable (confirmation, QR codes, refund link). Sending email synchronously in the request path is slow and fragile. Brevo offers both an HTTP API and SMTP relay.

**Decision:** Async email via Cloudflare Queues, sent through Brevo's SMTP relay using nodemailer (not the Brevo SDK).

Flow:
1) After payment is confirmed, `packages/core` produces a message to the Queue
2) The Queue consumer in `apps/api` calls `packages/email` to send via SMTP
3) `packages/email` handles template rendering, QR code image generation, and SMTP sending

Why SMTP over Brevo SDK:
- SMTP is provider-agnostic; if we switch from Brevo to another provider, only SMTP credentials change
- nodemailer is well-established and handles attachments easily
- No vendor-specific SDK to learn or maintain

Retry:
- CF Queues has built-in retry with backoff
- Dead letter queue for failed emails after max retries
- Admin can manually trigger a resend from the admin panel

**Consequences:**
- Email sending is decoupled from the request path
- Brevo free tier: 300 emails/day. Usage must be monitored. For launch day spikes, consider batching or upgrading.
- QR generation happens in the queue consumer, not in the request path
- Email failure does not block order confirmation

---

## **ADR-012: Client-Side Cart (Merch Only)**

**Context:** The merch store needs a cart so buyers can purchase multiple items. Merch is pre-order (no stock), so there are no inventory concerns in the cart.

**Decision:** sessionStorage-based cart. Cart items store product ID, variant ID, quantity, and display-only fields (name, price, variant label) that are re-validated at checkout.

- Cart stored in sessionStorage (cleared when the tab is closed)
- Minimal TTL: no explicit TTL; uses the session lifetime
- At checkout: the API re-validates all items (price, availability, active status)
- If a product has changed since it was added to the cart, the buyer is notified and the cart is updated

**Consequences:**
- No server-side cart = no DB overhead
- Cross-tab sync: not needed (each tab has its own session). Two tabs means two separate carts.
- Checkout validation is critical: never trust client-side data; always re-fetch product data from the API

---

## **ADR-013: Product Data Snapshot Pattern**

**Context:** Admins can update products after orders exist.

**Decision:** Denormalized snapshot in `order_items`: `snapshot_name`, `snapshot_price`, `snapshot_type`, `snapshot_variants` (JSON). Immutable after creation.

Why not versioning table: overkill at <200 orders.

**Consequences:**
-  CSV export uses snapshots directly. No historical price reconstruction needed.

---

## **ADR-014: Simplified Schema — 6 Tables**

**Context:** 10-day timeline, 4 developers. The original 11-table design (separate tables for product\_variants, bundle\_items, order\_item\_variants, payments, merch\_pickups) adds complexity without proportional benefit at this scale.

**Decision:** Reduce to 6 tables by:
- Merging `payments` into `orders` (always 1:1)
- Merging `merch_pickups` into `orders` (always 1:1)
- Moving `product_variants` to JSON column on `products`
- Moving `bundle_items` to JSON column on `products`
- Moving `order_item_variants` to JSON column on `order_items` (as `snapshot_variants`)

Remaining tables: `config`, `products`, `orders`, `order_items`, `tickets`, `refund_requests`.

**Consequences:**
- Fewer migrations, fewer joins, faster development
- Cannot do relational queries on variants or bundle items. At <200 orders this is fine. D1 supports `json_extract()` if needed.
- `orders` table is wider but still well under D1's 1MB row limit
- Merch pickup fields are null for ticket orders (acceptable)

---

## **ADR-015: ID Strategy — Prefixed Nanoid + Human-Readable Order ID**

**Context:** Every entity needs a primary key. Options considered: UUID v4, UUID v7, ULID, nanoid, prefixed nanoid.

**Decision:**
- **Orders**: Human-readable format `TDX-{YYMMDD}-{XXXXX}` (e.g. `TDX-260801-A1B2C`). Easy to communicate verbally for customer support.
- **All other entities**: Prefixed nanoid `{prefix}_{nanoid}` (e.g. `tkt_V1StGXR8Z`).

|                    |                    |                    |
| :----------------: | :----------------: | :----------------: |
|     **Entity**     |    **ID Format**   |     **Example**    |
|        Order       | `TDX-YYMMDD-XXXXX` | `TDX-260801-A1B2C` |
|       Product      |   `prod_{nanoid}`  |  `prod_V1StGXR8Z`  |
|   Product Variant  |   `var_{nanoid}`   |   `var_1a2B3c4D5`  |
|     Bundle Item    |    `bi_{nanoid}`   |   `bi_xYz123AbC`   |
|     Order Item     |    `oi_{nanoid}`   |   `oi_qWeRtYuIo`   |
| Order Item Variant |   `oiv_{nanoid}`   |   `oiv_aSdFgHjK`   |
|       Ticket       |   `tkt_{nanoid}`   |   `tkt_zXcVbNmL`   |
|       Payment      |   `pay_{nanoid}`   |   `pay_pOiUyTrE`   |
|   Refund Request   |   `ref_{nanoid}`   |   `ref_wQeRtYuI`   |
|    Merch Pickup    |   `mpu_{nanoid}`   |   `mpu_lKjHgFdS`   |

Why not UUID v4: 36 chars, no prefix, hard to visually identify entity type in logs. Why not UUID v7 / ULID: Time-ordered (unnecessary at our scale), still 26-36 chars with no semantic prefix. Why nanoid: Shorter (21 chars), URL-safe, higher entropy per character, `crypto.getRandomValues()` backed.

**Consequences:**
- Human-readable order IDs are great for customer support and admin lookup
- Prefixed IDs are instantly identifiable in logs
- Shared generation utility lives in `packages/utils`

---

## **ADR-016: tRPC for API Layer**

**Context:** We have two React SPA frontends (store and admin) that need to communicate with the Hono API. Traditional REST means manually keeping request/response types in sync. We want end-to-end type safety.

**Decision:** Use tRPC mounted on Hono via `@trpc/server` adapter.
- tRPC router definitions live in `packages/api`
- `apps/api` mounts the tRPC router on Hono (e.g. `/trpc/*`)
- `apps/store` and `apps/admin` use `@trpc/react-query` with TanStack Query
- Zod schemas in `packages/api` serve as both tRPC input validators and frontend form validators
- Hono still handles non-tRPC routes (Midtrans webhook, file uploads, health checks)

Why not pure REST:
- Manual type sync between frontend and backend is error-prone on a 10-day timeline
- tRPC eliminates an entire class of bugs (mismatched types, missing fields, wrong URLs)
- The team is already using TanStack Router + TanStack Query, so tRPC integrates naturally

**Consequences:**
- End-to-end type safety from DB schema (Drizzle) -> business logic (core) -> API (tRPC) -> frontend (React)
- Zod schemas are shared, not duplicated
- Midtrans webhook must remain a plain Hono route (external system, not our tRPC client)
- File uploads (payment proof, product images) go through regular Hono routes since tRPC is not ideal for multipart

---

## **ADR-017: Infrastructure as Code — Alchemy Per App**

**Context:** Multiple Cloudflare resources (Workers, D1, KV, R2, Pages, Queues, Cron Triggers) need to be provisioned and maintained. Each app has its own infra requirements.

**Decision:** Use Alchemy (`github.com/alchemy-run/alchemy`) within each app directory, not as a shared package. Each app defines and owns its own Cloudflare resources.

- `apps/api/` — Worker, D1 binding, KV binding, R2 bindings (cdn + storage), Queue binding, Cron Triggers
- `apps/store/` — CF Workers deployment
- `apps/admin/` — CF Workers deployment
- `apps/www/` — CF Workers deployment (existing)

Why not a centralized `packages/infra`:
- Each app has different infra needs; centralizing creates coupling
- Co-locating infra with the app makes it easier to reason about what each app needs
- Deploys are per-app, so infra definitions should be too

**Consequences:**
- Reproducible, version-controlled infrastructure per app
- No shared infra package to coordinate
- Each team member can own their app's infra definition
- Environment variables and secrets are defined per-app alongside their alchemy config

---

## **ADR-018: Structured Logging**

**Context:** We need observability across all packages and apps. CF Workers logs are basic (`console.log`). We need structured, consistent logging for debugging production issues.

**Decision:** `packages/logger` provides a shared structured logging utility used across all packages and apps.

Features:
- Structured JSON output (timestamp, level, message, context)
- Log levels (debug, info, warn, error)
- Request-scoped context (request ID, order ID, user ID) via Hono middleware
- Consistent format across all packages

**Consequences:**
- All logs are machine-parseable (JSON), useful for CF Workers logs and any future log aggregation
- Request tracing via request ID across the entire order lifecycle
- `packages/core` and all other packages import from `packages/logger`
- Minimal overhead; logger is thin by design

---

## **ADR-019: Error Handling — AppError + tRPC Mapper**

**Context:** Errors originate from `packages/db` (Drizzle/D1 errors) and `packages/core` (business logic). They need to surface as proper tRPC errors in `packages/api`. But core is also called by cron jobs and queue consumers, which have no tRPC context.

**Decision:** Define a transport-agnostic `AppError` type in `packages/core` with a `code` string enum and optional details. Core throws AppError. A single tRPC middleware in `packages/api` catches AppError and maps code to TRPCError.

`packages/db` throws raw Drizzle/D1 errors. `packages/core` catches and wraps meaningful ones (e.g. unique constraint on idempotency\_key -> DUPLICATE\_ORDER). Unexpected errors bubble up and the tRPC middleware catches them as 500, logging the full error via `packages/logger` but returning a generic message to the client.Cron jobs and queue consumers catch AppError directly and log accordingly. No tRPC dependency.

**Consequences:**
- Core stays transport-agnostic
- Single place to maintain error code mapping (tRPC middleware)
- Frontend can switch on error codes for user-facing messages
- Error codes defined alongside Zod schemas in `packages/api` for frontend consumption

---

## **ADR-020: Logging — Context Propagation via Explicit Pass**

**Context:** We need request-scoped logging (requestId, orderId, userId in every log line) across packages. Options: AsyncLocalStorage (implicit, magic) or explicit context passing (boring, works everywhere).

**Decision:** Explicit pass. Every `packages/core` service function takes a `ctx` object as its first argument. This ctx includes a logger instance with request-scoped fields already bound.

Flow:
- Hono middleware generates a requestId, creates a child logger with requestId baked in, attaches it to tRPC context
- tRPC procedures pass `ctx.logger` into core service calls
- Core calls `ctx.logger.info("stock reserved", { productId, quantity })` — requestId is automatically included
- Core can create further child loggers with additional context: `ctx.logger.child({ orderId })` for order-specific logs
- Cron jobs and queue consumers create their own logger with jobId or messageId, pass it into core the same way

Why not AsyncLocalStorage: potential edge cases in CF Workers runtime, implicit magic is harder to debug, and for a 10-day timeline explicit is safer.

**Consequences:**
- Every core service function signature starts with ctx (consistent, greppable)
- No magic; log context is always traceable in the code
- Works identically in tRPC, cron, and queue consumer contexts
- Small verbosity cost (passing ctx everywhere) but pays for itself in debuggability
