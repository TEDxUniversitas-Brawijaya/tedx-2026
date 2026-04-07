# **API Design**

## **Overview**

API built with Hono on Cloudflare Workers, with tRPC mounted for type-safe RPC between the frontend SPAs and backend. Zod schemas defined in `packages/api` serve as both tRPC input validators and frontend form validators.

Base URL: `https://api.tedxuniversitasbrawijaya.com`
tRPC endpoint: `https://api.tedxuniversitasbrawijaya.com/trpc`
Non-tRPC routes (plain Hono) are used for: Midtrans webhook, file uploads (multipart), and health checks.

## **Authentication**

- **Public procedures**: No auth. Protected by rate limiting + CAPTCHA.
- **Admin procedures**: Cookie-based session via better-auth. tRPC middleware checks role.

## **Payment Mode**

The active payment method is system-determined via the `payment_mode` config value (either `midtrans` or `manual`). The buyer does not choose. All procedures that create orders read this config to determine the payment flow.***

## **Public — Ticketing**

### `ticket.listProducts` **(query)**

List available ticket products with current stock.

Returns an array of products, each containing: id, type, name, price, stock, isActive, description, imageUrl, and for bundles, a `bundleItems` array with productId, name, and isSelectable flag.

### `ticket.createOrder` **(mutation)**

Create a ticket order. Reserves stock via KV. Saga pattern handles rollback on failure.

Input:
- `productId` — which ticket product to buy
- `quantity` — number of tickets (1-5)
- `buyerName`, `buyerEmail`, `buyerPhone`, `buyerInstansi` — buyer info
- `selectedBundleItemId` — required if the product has selectable bundle items (e.g. pick topi/sticker/socks)
- `captchaToken` — Turnstile token
- `idempotencyKey` — client-generated unique key to prevent duplicate orders
- `paymentProof` — required if `payment_mode` is `manual`, a file upload for QRIS payment proof

Validations:
- Quantity in range 1-5
- Product exists and is active
- Cooldown check by email (KV)
- CAPTCHA verification
- Idempotency check (reject if key already used)
- Stock available (KV atomic decrement)
- `selectedBundleItemId` required if product has selectable bundle items
- Payment proof required if `payment_mode` is `manual`
- Payment proof file must be an image and below 5 MB

Returns:
- `orderId` — human-readable order ID (e.g. "TDX-260801-A1B2C")
- `status` — "pending\_payment"
- `totalPrice` — in IDR
- `expiresAt` — ISO 8601 timestamp (20 min from now)
- `payment` — if Midtrans mode: `qrisUrl` and `midtransOrderId`; if manual mode: `uploadUrl`

Errors:
- 409: Insufficient stock
- 429: Cooldown active (includes `retryAfterSeconds`)
- 409: Duplicate idempotency key

### `ticket.getOrderStatus` **(query)**

Get order status by order ID. Public, no auth. Used for status polling after payment.

Returns: orderId, status, type, totalPrice, items (with snapshot name/quantity/unitPrice), createdAt, paidAt.

---

## **Public — Merchandise**

### `merch.listProducts` **(query)**

List available merch products with variants.

Returns an array of products, each containing: id, type, name, price, imageUrl, and a `variants` array (id, type, label). For bundles, includes `bundleItems` array.

### `merch.createOrder` **(mutation)**

Create a merch order from cart.

Input:
- `buyerName`, `buyerEmail`, `buyerPhone`, `buyerInstansi` — buyer info
- `items` — array of { productId, quantity, variantIds }
- `captchaToken` — Turnstile token
- `idempotencyKey` — client-generated unique key
- `paymentProof` — required if `payment_mode` is `manual`, a file upload for QRIS payment proof

Validations:
- All products exist and are active
- Pre-order deadline not passed (from config)
- Variant IDs are valid for each product
- CAPTCHA verification
- Idempotency check
- No stock check (pre-order)
- Payment proof required if `payment_mode` is `manual`
- Payment proof file must be an image and below 5 MB

Returns: same structure as ticket.createOrder.

---

## **Public — Refund**

### `refund.getOrderInfo` **(query)**

Get order info for refund form pre-fill by refund token.

Validations:
- Token exists
- Order status = "paid"
- Within refund deadline (H-3)
- No existing pending refund request

Returns: orderId, buyerName, buyerEmail, items (name/quantity/unitPrice), totalPrice, refundDeadline.

Error 403: Refund deadline passed or already refunded.

### `refund.submitRequest` **(mutation)**

Submit a refund request.

Input:
- `refundToken` — from the email link
- `reason` — cancellation reason
- `paymentMethod` — how the buyer originally paid
- `bankAccountNumber`, `bankName`, `bankAccountHolder` — refund destination

For manual payment: payment proof uploaded separately via Hono file upload route.

Returns: refundId, status ("requested"), confirmation message.

---

## **Public — Webhook (Hono route, not tRPC)**

`POST /webhooks/midtrans`

Midtrans payment notification callback. Only relevant when `payment_mode` is `midtrans`.

Validations:
- Verify SHA512 signature (Midtrans server key)
- Idempotency: check if order already processed

Behavior:
- `transaction_status: "settlement"` -> update order to "paid", generate tickets + QR, queue confirmation email
- `transaction_status: "expire"` -> update order to "expired", release stock
- Other statuses are logged but not acted upon

Always returns 200 OK (per Midtrans spec).

---

## **Admin — Auth**

### `admin.auth.login` **(mutation)**

Login via better-auth. Sets session cookie.

### `admin.auth.logout` **(mutation)**

Logout. Invalidates session.

### `admin.auth.me` **(query)**

Get current admin user info + role.***

## **Admin — Orders**

### `admin.order.list` **(query)**

List orders with filtering, search, sort, and pagination.

Filters: type (ticket/merch), status, search (name/email/order ID), sortBy (createdAt/totalPrice/status), sortOrder (asc/desc), page, limit.

### `admin.order.getById` **(query)**

Full order detail including items, tickets, payment, and refund info.

### `admin.order.verifyPayment` **(mutation)**

Verify manual QRIS payment. Input: orderId, action ("approve" or "reject"), reason (required if reject).

### `admin.order.processRefund` **(mutation)**

Process refund request. Input: orderId, action ("approve" or "reject"), reason (required if reject).

On approve: release stock (KV), update order status, queue refund confirmation email.

## **Admin — Products**

### `admin.product.list` **(query)**

List all products with filtering by type.

### `admin.product.create` **(mutation)**

Create a product.

### `admin.product.update` **(mutation)**

Update a product (name, price, description, stock, isActive).

### `admin.product.delete` **(mutation)**

Soft delete (sets isActive = false).

### `admin.product.createVariant` **(mutation)**

Add a variant to a product.

### `admin.product.updateVariant` **(mutation)**

Update a variant.***

## **Admin — Attendance**

### `admin.attendance.list` **(query)**

List tickets with attendance info.

Filters: eventDay, status (checked\_in/not\_checked\_in), search (buyer name/email/QR code), sortBy, page, limit.

### `admin.attendance.checkIn` **(mutation)**

Check in by QR code. Input: qrCode.

Validations: QR exists, event day matches today (from config), not already checked in.

Returns: ticketId, buyerName, eventDay, status ("checked\_in"), checkedInAt.

Errors: 409 (already checked in), 403 (wrong event day).

### `admin.attendance.updateStatus` **(mutation)**

Manually update attendance status (admin override).

Input: ticketId, status ("checked\_in" or "not\_checked\_in").

---

## **Admin — Merch Pickup**

### `admin.merchPickup.list` **(query)**

List merch orders with pickup status.

Filters: status (picked\_up/not\_picked\_up), search (buyer name/email/order ID), page, limit.

### `admin.merchPickup.markPickedUp` **(mutation)**

Mark a merch order as picked up.

Input: orderId.Returns: orderId, status ("picked\_up"), pickedUpAt.

---

## **Admin — Users (Superadmin only)**

### `admin.user.list` **(query)**

List admin users.

### `admin.user.create` **(mutation)**

Add an admin user.

Input: email, name, password, role.

### `admin.user.updateRole` **(mutation)**

Update an admin user's role.

Input: userId, role.

### `admin.user.delete` **(mutation)**

Remove an admin user.

Input: userId.

---

## **Admin — Analytics & Export**

### `admin.analytics.dashboard` **(query)**

Returns: totalRevenue, totalOrders, ticketsSold, ticketsByType (propa3\_day1/day2/main\_event/bundles), merchOrders, refundRate, checkInRate (per event day), revenueByDay.

### `admin.export.csv` **(query)**

Export data as CSV.

Input: entity ("orders" | "tickets" | "merch-orders" | "refunds" | "attendance" | "merch-pickups").

Note: CSV export may use a plain Hono route instead of tRPC for streaming the response as a file download.
