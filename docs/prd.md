# **Product Requirement Document**

## **Overview**

Ticketing system, merchandise store, and admin panel for TEDxUniversitasBrawijaya 2026. Built as a TypeScript monorepo on Cloudflare free tier.


## **Scope**

**In scope:**
- Ticket purchasing (regular + bundling) with limited inventory
- Merchandise pre-order (regular + bundling) with no inventory limit
- Payment via Midtrans QRIS (instant) or manual QRIS upload (system-determined, not buyer choice — depends on whether Midtrans merchant approval is granted in time)
- QR code generation per event day, delivered via email
- Refund flow via tokenized email link
- Admin panel for order management, attendance, merch pickup, analytics
- CSV data export post-event

**Out of scope:**
- User authentication for buyers
- Voucher / promo code system
- Shipping (merch is pickup on-site only)
- Seat selection
- Waiting list
- On-the-spot order entry (day-of purchases go through the web)

---

## **User Stories**

### **Buyer — Ticketing**

**US-T01: Browse ticket products**

As a buyer, I want to see available tickets with pricing and remaining stock so I can choose what to buy.

Acceptance criteria:
- Display all ticket products (regular + bundle) with price, description, and remaining stock
- Sold out products are visible but not purchasable
- Products not yet on sale are hidden or labeled "coming soon"

**US-T02: Purchase ticket**

As a buyer, I want to purchase a ticket by filling out a form and paying so I can attend the event.

Acceptance criteria:
- Only 1 ticket type per order
- Maximum 5 tickets per purchase
- Form fields: Full Name, Email, Phone Number, Institution, Ticket Quantity
- After submission, buyer is directed to the active payment flow (Midtrans QRIS or manual QRIS upload, depending on system configuration)
- Stock is reserved at order creation, not at payment confirmation
- Order expires in 20 minutes if unpaid; stock is released; buyer gets an rejection email
- 10-minute cooldown per buyer (by email) before placing another order
- Idempotency key sent with the request to prevent duplicate orders from retries or double-clicks

**US-T03: Receive confirmation email**

As a buyer who has paid, I want to receive a confirmation email containing QR codes so I can check in at the event.

Acceptance criteria:
- Email sent after payment is confirmed
- Email contains: order details, QR code attachments (1 per event day), refund link
- Attachment filenames match the event day (e.g. "propa3-day1.png", "main-event.png")
- Each QR is only valid on its corresponding event day

**US-T04: Request refund**

As a buyer, I want to request a refund via the link in my email so I can get my money back if I can no longer attend.

Acceptance criteria:
- Refund link is only accessible from the email (no website navigation)
- Link uses a unique, secure token per order
- Refund can only be requested up to 3 days before the event (H-3)
- Form fields: Cancellation reason, Payment method + proof (if manual), Bank account number, Bank name, Account holder name
- Refund is always full (entire order; no partial refunds)
- Ticket stock is restored after admin approves the refund


### **Buyer — Merchandise**

**US-M01: Browse merch products**

As a buyer, I want to see available merchandise so I can choose what to buy.

Acceptance criteria:
- Display all merch products (regular + bundle) with price, variants, and images
- Merch is pre-order with no stock limit
- Pre-order has a configurable deadline

**US-M02: Add to cart**

As a buyer, I want to add merch to a cart so I can buy multiple items at once.

Acceptance criteria:
- Cart stored in sessionStorage (client-side)
- Can add multiple items with different variants
- Cart persists for the browser session (cleared when tab is closed)
- Prices and product availability are re-validated at checkout

**US-M03: Checkout merch**

As a buyer, I want to check out my cart and pay so my merch order is processed.

Acceptance criteria:
- Form fields: Full Name, Email, Phone Number, Institution
- Order contains: Product, Quantity, Variant per item
- Payment flow determined by system configuration (Midtrans QRIS or manual QRIS upload)
- Confirmation email contains order details and order ID for pickup
- Rejection email contains information
- Idempotency key sent with the request to prevent duplicate orders

**US-M04: Pick up merch on-site**

As a buyer, I want to pick up my pre-ordered merch at the event by providing my name or order ID.

Acceptance criteria:
- Admin searches by name / order ID in the admin panel
- Admin marks order as "picked up"

### **Admin**

**US-A01: Log in to admin panel**

As an admin, I want to log in with credentials registered by a superadmin.

Acceptance criteria:
- Auth via better-auth
- Superadmin adds admin emails directly (no invite flow)
- Minimum 2 roles: Superadmin, Admin
- Session management handled by better-auth

**US-A02: Manage orders**

As an admin, I want to view and manage all orders (tickets + merch).

Acceptance criteria:
- Order list with filter (status, type, date), search (name, email, order ID), and sort
- Order detail displays snapshot of product data at time of purchase
- Can verify manual QRIS payments (approve/reject) — only applicable if system is in manual payment mode
- Can process refund requests (approve/reject)

**US-A03: Manage products**

As an admin, I want to CRUD ticket and merch products.

Acceptance criteria:
- Can update price, name, date, status (active/inactive). Only available at certain times (e.g., 1-2am) to prevent displaying outdated data while shoppers are making purchases.
- Changes do not affect existing orders (snapshot pattern)
- Can set stock for tickets
- Merch has no stock

**US-A04: Manage attendance**

As an admin, I want to manage event attendance on the day of the event.

Acceptance criteria:
- Search by name / email, filter by event day, sort
- Update attendance status (checked in / not checked in) per ticket per event day
- QR code input as an alternative to name/email search
- Must be responsive and fast (handles hundreds of people queuing)

**US-A05: Manage merch pickup**

As an admin, I want to manage merch pickups at the event.

Acceptance criteria:
- Search by name / order ID / email
- Mark order as "picked up"
- Filter: picked up / not picked up

**US-A06: View analytics and export data**

As an admin, I want to view a dashboard and export all data.

Acceptance criteria:
- Dashboard: total revenue, total orders, ticket sales by type, merch orders by product, refund rate, check-in rate
- Export all data as CSV
- Data includes: orders, order items, tickets, refunds, attendance, merch pickups

**US-A07: Manage admin users** (Superadmin only)

As a superadmin, I want to add and remove admin users.

Acceptance criteria:
- Superadmin can add admin by email
- Superadmin can remove admin
- Superadmin can change roles
