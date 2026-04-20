# Test Scenarios - TEDxUniversitas Brawijaya 2026

**Last Updated**: 2026-04-20
**Payment Mode**: Manual (QRIS upload + admin verification)
**Purpose**: Comprehensive end-to-end testing of critical flows with all possible state transitions

---

## Table of Contents
1. [Pre-conditions](#pre-conditions)
2. [Merchandise Order Scenarios](#merchandise-order-scenarios)
3. [Ticket Order Scenarios](#ticket-order-scenarios)
4. [Payment Verification Flow](#payment-verification-flow)
5. [Refund Request Flow](#refund-request-flow)
6. [Email Verification](#email-verification)
7. [Database State Verification](#database-state-verification)
8. [Edge Cases & Validations](#edge-cases--validations)

---

## Pre-conditions

### System Configuration
```yaml
payment_mode: "manual"
payment_timeout_minutes: "20" # Not applicable for manual (used for Midtrans)
cooldown_minutes: "10" # Ticket orders only
merch_preorder_deadline: "2026-07-15T23:59:59Z"
refund_deadline_days_before: "3" # H-3 before event
event_date_propa3_day1: "2026-08-10"
event_date_propa3_day2: "2026-08-11"
event_date_main: "2026-08-17"
whatsapp_group_propa3_day1: "https://chat.whatsapp.com/xxx"
whatsapp_group_propa3_day2: "https://chat.whatsapp.com/xxx"
whatsapp_group_main: "https://chat.whatsapp.com/xxx"
```

### Test Users
- **Buyer**: John Doe, john.doe@example.com, 081234567890, Universitas Brawijaya
- **Admin**: Admin User (admin_001), admin@tedxub2026.com

### Available Products (from seed data)
**Regular Tickets:**
- Propaganda 3 Day 1: Rp135,000 (stock: 23)
- Propaganda 3 Day 2: Rp105,000 (stock: 25)
- Main Event: Rp0 (stock: 0, inactive)

**Ticket Bundles:**
- Bundling 1 (2 Day Pass): Rp235,000 - Propaganda 3 Day 1 + Day 2
- Bundling 2 (Main Event + Keychain v1): Rp0 (inactive)
- Bundling 3 (Main Event + Socks): Rp0 (inactive)
- Bundling 4 (Main Event + Stickers): Rp0 (inactive)

**Merch Regular:**
- T-shirt A/B/C: Rp75,000 (variants: S, M, L, XL, XXL)
- Work Shirt A/B/C/D: Rp180,000 (variants: S, M, L, XL, XXL)
- Topi A/B/C: Rp65,000 (no variants)
- Socks A/B/C: Rp18,000 (no variants)
- Keychain v1: Rp23,000 (no variants)
- Keychain v2 A-H: Rp15,000 (no variants)
- Stickers A/B: Rp10,000 (no variants)

**Merch Bundles:**
- Bundling A (T-Shirt + Topi): Rp135,000
- Bundling B (Workshirt + Topi): Rp240,000
- Bundling C (T-Shirt + Socks): Rp88,000
- Bundling D (Workshirt + Socks): Rp193,000
- Bundling E (Topi + Keychain): Rp88,000
- Bundling F (Topi + Stickers): Rp70,000
- Bundling G (Socks + Keychain v1 + Stickers): Rp45,000 *(note: Keychain v1 is fixed product)*

---

## Merchandise Order Scenarios

### M1: Simple Regular Items (No Variants)

#### M1.1: Single Item, Quantity 1
**Order Details:**
- 1x Stickers A

**Expected Behavior:**
- Order ID: `TDX-YYMMDD-XXXXX`
- Total Price: Rp10,000
- Status: `pending_verification`
- Order items: 1 item with snapshot (name: "Stickers A", price: 10000, type: "merch_regular", variants: null, bundleProducts: null)

**State Transitions to Test:**
- [✓] Admin approves → `paid` → Email: `merchOrder`
- [✓] Admin rejects (reason: "Bukti pembayaran tidak valid") → `rejected` → Email: `merchOrderRejected`
- [✓] System expires (24h) → `expired` → Email: `merchOrderExpired` *(TODO in code)*

---

#### M1.2: Single Item, Quantity 3
**Order Details:**
- 3x Stickers A

**Expected Behavior:**
- Total Price: Rp30,000
- Order items: 1 item with quantity=3

**State Transitions:**
- [✓] Admin approves → `paid`
- [✓] User requests refund (H-4) → `refund_requested`
- [✓] Admin approves refund → `refunded` *(no stock to release for merch)*

---

#### M1.3: Multiple Items, No Variants
**Order Details:**
- 2x Stickers A
- 1x Stickers B
- 1x Topi A

**Expected Behavior:**
- Total Price: Rp95,000 (20,000 + 10,000 + 65,000)
- Order items: 3 separate items in snapshot

**State Transitions:**
- [✓] Admin approves → `paid`
- [✓] Admin picks up merch → `pickedUpAt` updated, `pickedUpBy` = admin_001

---

### M2: Regular Items with Variants

#### M2.1: Single Item with Variant, Quantity 1
**Order Details:**
- 1x T-shirt A (size: M)

**Expected Behavior:**
- Total Price: Rp75,000
- Order items snapshot:
  ```json
  {
    "name": "T-shirt A",
    "price": 75000,
    "variants": [{"label": "M", "type": "size"}],
    "bundleProducts": null
  }
  ```

**State Transitions:**
- [✓] Admin approves → `paid`

---

#### M2.2: Single Item with Variant, Quantity 3
**Order Details:**
- 3x T-shirt A (size: L)

**Expected Behavior:**
- Total Price: Rp225,000
- Order items: 1 item with quantity=3, variants=[{label: "L", type: "size"}]

**State Transitions:**
- [✓] Admin rejects (reason: "Transfer dari bank yang berbeda") → `rejected`

---

#### M2.3: Multiple Items with Different Variants
**Order Details:**
- 2x T-shirt A (size: M)
- 1x Work Shirt B (size: XL)

**Expected Behavior:**
- Total Price: Rp330,000 (150,000 + 180,000)
- Order items: 2 separate items with different variants

**State Transitions:**
- [✓] Admin approves → `paid`
- [✓] User requests refund → `refund_requested`
- [✓] Admin rejects refund (reason: "Sudah melewati batas waktu") → back to `paid`

---

#### M2.4: Complex Cart (5+ items, mixed variants)
**Order Details:**
- 1x T-shirt A (size: S)
- 2x T-shirt B (size: L)
- 1x Work Shirt C (size: M)
- 3x Socks A (no variant)
- 1x Topi B (no variant)

**Expected Behavior:**
- Total Price: Rp499,000 (75k + 150k + 180k + 54k + 65k)
- Order items: 5 items with proper variant snapshots

**State Transitions:**
- [✓] Admin approves → `paid`
- [✓] Merch picked up on event day

---

### M3: Merch Bundles (Category Type - Buyer Selects Product)

#### M3.1: Bundle with Category Selection, Quantity 1
**Order Details:**
- 1x Bundling A (T-Shirt + Topi)
- Buyer selects:
  - T-shirt B (size: M)
  - Topi A

**Expected Behavior:**
- Total Price: Rp135,000
- Order items snapshot:
  ```json
  {
    "name": "Bundling A",
    "price": 135000,
    "type": "merch_bundle",
    "variants": null,
    "bundleProducts": [
      {
        "name": "T-shirt B",
        "category": "t-shirt",
        "selectedVariants": [{"label": "M", "type": "size"}]
      },
      {
        "name": "Topi A",
        "category": "hat",
        "selectedVariants": null
      }
    ]
  }
  ```

**State Transitions:**
- [✓] Admin approves → `paid` → Email includes bundle details

---

#### M3.2: Bundle with Category Selection, Quantity 2
**Order Details:**
- 2x Bundling C (T-Shirt + Socks)
- Buyer selects:
  - T-shirt A (size: L)
  - Socks B

**Expected Behavior:**
- Total Price: Rp176,000
- Quantity: 2 (buyer gets 2 sets of selected items)
- Bundle products snapshot shows selected variants

**State Transitions:**
- [✓] Admin rejects (reason: "Nominal tidak sesuai") → `rejected`

---

#### M3.3: Bundle with Mixed Selection
**Order Details:**
- 1x Bundling F (Topi + Stickers)
- Buyer selects:
  - Topi C
  - Stickers A

**Expected Behavior:**
- Total Price: Rp70,000
- Both items have no variants (category-based selection only)

**State Transitions:**
- [✓] Admin approves → `paid`
- [✓] User requests refund within deadline
- [✓] Admin approves refund → `refunded`

---

### M4: Merch Bundle (merchandise_product Type - Fixed Product)

#### M4.1: Bundle with Fixed Product, Quantity 1
**Order Details:**
- 1x Bundling G (Socks + Keychain v1 + Stickers)
- Buyer selects:
  - Socks B (category selection)
  - Keychain v1 (fixed, no selection)
  - Stickers A (category selection)

**Expected Behavior:**
- Total Price: Rp45,000
- Order items snapshot:
  ```json
  {
    "bundleProducts": [
      {
        "name": "Socks B",
        "category": "socks",
        "selectedVariants": null
      },
      {
        "name": "Keychain v1",
        "category": "keychain",
        "selectedVariants": null
      },
      {
        "name": "Stickers A",
        "category": "stickers",
        "selectedVariants": null
      }
    ]
  }
  ```

**State Transitions:**
- [✓] Admin approves → `paid`

---

#### M4.2: Bundle with Fixed Product, Quantity 2
**Order Details:**
- 2x Bundling G
- Buyer selects: Socks C, Keychain v1 (fixed), Stickers B

**Expected Behavior:**
- Total Price: Rp90,000
- Quantity 2 means buyer gets 2 sets

**State Transitions:**
- [✓] System expires → `expired` (if not verified in 24h)

---

### M5: Mixed Cart (Regular + Bundle)

#### M5.1: Multiple Regular Items + Bundle
**Order Details:**
- 2x T-shirt A (size: M)
- 1x Bundling A (buyer selects: T-shirt C size L, Topi B)
- 3x Stickers B

**Expected Behavior:**
- Total Price: Rp315,000 (150k + 135k + 30k)
- Order items: 3 separate items (regular, bundle, regular)
- Complex snapshot with bundle products nested

**State Transitions:**
- [✓] Admin approves → `paid`
- [✓] Full refund flow (request → approved)

---

#### M5.2: Workshirt + Multiple Bundles
**Order Details:**
- 1x Work Shirt D (size: XXL)
- 2x Bundling E (Topi + Keychain)
  - Buyer selects: Topi A + Keychain v2 B
- 1x Keychain v2 H

**Expected Behavior:**
- Total Price: Rp371,000 (180k + 176k + 15k)
- Mix of variant items, category bundles, and no-variant items

**State Transitions:**
- [✓] Admin rejects → `rejected`
- [✓] User re-orders (cooldown doesn't apply to merch)

---

## Ticket Order Scenarios

### T1: Regular Tickets (Quantity Variations)

#### T1.1: Single Ticket, Quantity 1
**Order Details:**
- 1x Propaganda 3 Day 1

**Expected Behavior:**
- Total Price: Rp135,000
- Status: `pending_verification`
- **Stock decrement**: Propaganda 3 Day 1 stock: 23 → 22 (atomic operation)
- Order items snapshot:
  ```json
  {
    "name": "Propaganda 3 Day 1",
    "price": 135000,
    "type": "ticket_regular",
    "quantity": 1,
    "bundleProducts": null
  }
  ```

**State Transitions:**

**✓ Admin Approves:**
- Order status: `pending_verification` → `paid`
- **Ticket creation**: 1 ticket record created
  - eventDay: `propa3_day1`
  - qrCode: unique nanoid
  - orderItemId: links to order item
- **QR code generation**: PNG generated from QR code string
- **Email sent**: `ticketOrder`
  - Subject: "Payment Approved"
  - Attachments: 1 PNG file (e.g., "10 Agu 2026-1.png")
  - Body includes:
    - Order ID
    - Ticket details
    - WhatsApp group link for Propaganda 3 Day 1
    - Refund URL: `https://store.tedxuniversitasbrawijaya.com/refund/{refundToken}`

**✓ Admin Rejects:**
- Order status: `pending_verification` → `rejected`
- **Stock restored**: Propaganda 3 Day 1 stock: 22 → 23 (batch increment)
- **No tickets created**
- **Email sent**: `ticketOrderRejected`
  - Subject: "Pesanan tiket Anda ditolak"
  - Body includes rejection reason: "Bukti pembayaran tidak valid"

**✓ System Expires (24h timeout):**
- Order status: `pending_verification` → `expired`
- **Stock restored**: 22 → 23
- **Email sent**: `ticketOrderExpired` *(TODO in code - line 1876)*

---

#### T1.2: Single Ticket, Quantity 3
**Order Details:**
- 3x Propaganda 3 Day 2

**Expected Behavior:**
- Total Price: Rp315,000
- **Stock decrement**: Day 2 stock: 25 → 22
- Order items: 1 item with quantity=3

**State Transitions:**

**✓ Admin Approves:**
- **3 tickets created** (same orderItemId, different QR codes)
- **Email attachments**: 3 PNG files
  - "11 Agu 2026-1.png"
  - "11 Agu 2026-2.png"
  - "11 Agu 2026-3.png"
- Each ticket has unique qrCode for check-in

**✓ User Requests Refund (H-4):**
- Order status: `paid` → `refund_requested`
- Refund record created with bank details
- Payment proof uploaded to R2 storage

**✓ Admin Approves Refund:**
- Order status: `refund_requested` → `refunded`
- **Stock restored**: Day 2 stock: 22 → 25
- Refund email sent *(TODO in code - line 1763)*

---

#### T1.3: Maximum Quantity (5 tickets)
**Order Details:**
- 5x Propaganda 3 Day 1

**Expected Behavior:**
- Total Price: Rp675,000
- **Stock decrement**: Day 1 stock: 23 → 18
- Order items: quantity=5

**Validation:**
- Max quantity check: API should reject orders > 5
- Stock availability: Atomic batch decrement with WHERE guard prevents overselling

**State Transitions:**
- [✓] Admin approves → 5 tickets created → 5 QR codes
- [✓] Cooldown enforced: Buyer cannot place another ticket order for 10 minutes

---

### T2: Ticket Bundle - Pure Tickets (ticket + ticket)

#### T2.1: Bundle with 2 Tickets, Quantity 1
**Order Details:**
- 1x Bundling 1 (2 Day Pass: Propaganda 3 Day 1 + Day 2)

**Expected Behavior:**
- Total Price: Rp235,000
- **Stock decrements** (both products):
  - Day 1: 23 → 22
  - Day 2: 25 → 24
- Order items snapshot:
  ```json
  {
    "name": "Bundling 1",
    "price": 235000,
    "type": "ticket_bundle",
    "quantity": 1,
    "bundleProducts": [
      {
        "name": "Propaganda 3 Day 1",
        "category": null,
        "selectedVariants": null
      },
      {
        "name": "Propaganda 3 Day 2",
        "category": null,
        "selectedVariants": null
      }
    ]
  }
  ```

**State Transitions:**

**✓ Admin Approves:**
- **2 tickets created**:
  - Ticket 1: eventDay=`propa3_day1`, orderItemId=same
  - Ticket 2: eventDay=`propa3_day2`, orderItemId=same
- **Email attachments**: 2 QR codes
  - "Propaganda 3 Day 1-1.png"
  - "Propaganda 3 Day 2-2.png"
- **Email body includes**:
  - 2 WhatsApp group buttons (Day 1 + Day 2)
  - Refund URL

**✓ Admin Rejects:**
- **Both stocks restored**:
  - Day 1: 22 → 23
  - Day 2: 24 → 25
- Batch increment prevents partial stock release

---

#### T2.2: Bundle with 2 Tickets, Quantity 2
**Order Details:**
- 2x Bundling 1

**Expected Behavior:**
- Total Price: Rp470,000
- **Stock decrements**:
  - Day 1: 23 → 21 (2 bundles × 1 Day1 per bundle)
  - Day 2: 25 → 23 (2 bundles × 1 Day2 per bundle)

**State Transitions:**

**✓ Admin Approves:**
- **4 tickets created total**:
  - 2x Day 1 tickets (qrCode1, qrCode2)
  - 2x Day 2 tickets (qrCode3, qrCode4)
- **Email attachments**: 4 PNG files
- Logic in `order.ts:513-560` handles bundle ticket creation with quantity multiplier

---

#### T2.3: Maximum Bundle Quantity (5x)
**Order Details:**
- 5x Bundling 1

**Expected Behavior:**
- Total Price: Rp1,175,000
- **Stock decrements**:
  - Day 1: 23 → 18 (5 bundles × 1)
  - Day 2: 25 → 20 (5 bundles × 1)
- **10 tickets created** (5 Day1 + 5 Day2)

**Edge Cases:**
- Tests atomic batch decrement for multiple products
- If Day 1 has only 3 stock left, entire order fails and no stock is decremented (saga rollback)

**State Transitions:**
- [✓] Admin approves → 10 QR codes sent
- [✓] User requests refund → Admin approves → Both stocks restored by +5

---

### T3: Ticket Bundle - Ticket + Merchandise (merchandise_product - Fixed Item)

**Note**: Bundling 2, 3, 4 are inactive in seed data (Main Event not on sale). These scenarios assume they're activated for testing.

#### T3.1: Ticket + Fixed Merch Product, Quantity 1
**Order Details:**
- 1x Bundling 2 (Main Event + Keychain v1)

**Expected Behavior:**
- Total Price: Rp0 (placeholder, would be e.g., Rp138,000)
- **Stock decrement**: Main Event only (merch has no stock)
- Order items snapshot:
  ```json
  {
    "bundleProducts": [
      {
        "name": "Main Event",
        "category": null,
        "selectedVariants": null
      },
      {
        "name": "Keychain v1",
        "category": "keychain",
        "selectedVariants": null
      }
    ]
  }
  ```

**State Transitions:**

**✓ Admin Approves:**
- **1 ticket created** for Main Event
  - eventDay: `main_event`
- **Email includes**:
  - 1 QR code attachment for Main Event
  - Order details show both ticket AND merch (Keychain v1)
  - WhatsApp group link for Main Event
  - Note about picking up Keychain at venue

**✓ Admin Rejects:**
- **Stock restored**: Main Event only
- Merch item doesn't need stock handling

---

#### T3.2: Ticket + Fixed Merch, Quantity 3
**Order Details:**
- 3x Bundling 2

**Expected Behavior:**
- **Stock decrement**: Main Event: -3
- **3 tickets created** for Main Event
- Buyer gets 3 Keychain v1 (for pickup)

**State Transitions:**
- [✓] Admin approves → 3 QR codes
- [✓] Buyer picks up 3 keychains at merch booth

---

### T4: Ticket Bundle - Ticket + Merchandise (Category - Buyer Selects)

#### T4.1: Ticket + Merch Category, Quantity 1
**Order Details:**
- 1x Bundling 3 (Main Event + Socks category)
- Buyer selects: Socks A

**Expected Behavior:**
- **Stock decrement**: Main Event: -1
- Order items snapshot:
  ```json
  {
    "bundleProducts": [
      {
        "name": "Main Event",
        "category": null
      },
      {
        "name": "Socks A",
        "category": "socks",
        "selectedVariants": null
      }
    ]
  }
  ```

**State Transitions:**

**✓ Admin Approves:**
- **1 ticket created**
- Email shows both ticket and selected merch
- Buyer picks up Socks A at venue

---

#### T4.2: Ticket + Merch Category, Quantity 2
**Order Details:**
- 2x Bundling 3 (Main Event + Socks)
- Buyer selects: Socks C

**Expected Behavior:**
- **Stock decrement**: Main Event: -2
- **2 tickets created**
- Buyer gets 2x Socks C for pickup

**State Transitions:**
- [✓] Admin approves
- [✓] User requests refund (H-5, within deadline)
- [✓] Admin approves refund → Main Event stock +2

---

#### T4.3: Different Bundle, Category Selection
**Order Details:**
- 1x Bundling 4 (Main Event + Stickers)
- Buyer selects: Stickers B

**Expected Behavior:**
- Similar to T4.1 but with different merch category

**State Transitions:**
- [✓] System expires (24h) → Stock restored

---

## Payment Verification Flow

### Process Overview

**Manual Payment Mode** means:
1. Buyer uploads payment proof (QRIS screenshot) during order creation
2. Order status: `pending_verification` (not `pending_payment`)
3. Payment proof stored in R2: `payment-proofs/merchandise/{orderId}-{filename}` or `payment-proofs/ticket/{orderId}-{filename}`
4. `paidAt` timestamp set immediately (represents when buyer claims to have paid)
5. Order expires in 24 hours if admin doesn't verify

### PV1: Admin Approves Payment

**Pre-condition:**
- Order exists with status `pending_verification`
- Payment proof uploaded and accessible

**Admin Action:**
- Opens order detail in dashboard
- Views payment proof image
- Clicks "Approve Payment"

**System Behavior:**

**For Merch Orders:**
```typescript
// packages/core/src/services/order.ts:309-314
await ctx.orderQueries.updateOrder(orderId, {
  status: "paid",
  verifiedBy: verifierId,
  verifiedAt: new Date().toISOString(),
});

// Line 588-598
ctx.waitUntil(
  ctx.emailServices.sendEmail(
    order.buyerEmail,
    "Payment Approved",
    "merchOrder",
    { orderId, items }
  )
);
```

**For Ticket Orders:**
```typescript
// Line 310-314: Update order status
// Line 411-422: Create tickets with QR codes
const tickets = await ctx.ticketServices.createTickets(
  Array.from({ length: item.quantity }, () => ({
    orderItemId: item.id,
    eventDay: event.day,
  }))
);

// Line 423-445: Send email with QR attachments
ctx.waitUntil(
  ctx.emailServices.sendEmailWithAttachment(
    order.buyerEmail,
    "Payment Approved",
    "ticketOrder",
    { orderId, item, refundUrl },
    tickets.map((t, idx) => ({
      name: `${t.eventDate}-${idx + 1}.png`,
      content: t.qr,
    }))
  )
);
```

**For Ticket Bundles:**
- Logic in `order.ts:449-584` handles bundle ticket creation
- Parses event days from bundle product names
- Creates multiple tickets (one per event day × quantity)
- Sends email with all QR codes attached

**Database Changes:**
- `orders.status`: `pending_verification` → `paid`
- `orders.verifiedBy`: null → admin_001
- `orders.verifiedAt`: null → current timestamp
- `tickets` table: New records inserted (tickets only)

**Email Sent:**
- See [Email Verification](#email-verification) section

---

### PV2: Admin Rejects Payment

**Pre-condition:**
- Order exists with status `pending_verification`

**Admin Action:**
- Opens order detail
- Reviews payment proof
- Clicks "Reject Payment"
- Enters rejection reason: "Bukti pembayaran tidak valid" | "Nominal tidak sesuai" | "Transfer dari bank yang berbeda"

**System Behavior:**

```typescript
// Line 612-617
await ctx.orderQueries.updateOrder(orderId, {
  status: "rejected",
  verifiedBy: verifierId,
  verifiedAt: new Date().toISOString(),
  rejectionReason: reason,
});

// Line 619-700: Release stock for ticket orders only
if (order.type === "ticket") {
  await ctx.productQueries.batchIncrementProductStock(stockReleases);
}

// Line 643-659 (regular ticket) or 701-717 (bundle): Send rejection email
ctx.waitUntil(
  ctx.emailServices.sendEmail(
    order.buyerEmail,
    "Payment Rejected",
    "ticketOrderRejected" | "merchOrderRejected",
    { orderId, item/items, reason }
  )
);
```

**Database Changes:**
- `orders.status`: `pending_verification` → `rejected`
- `orders.verifiedBy`: null → admin_001
- `orders.verifiedAt`: null → current timestamp
- `orders.rejectionReason`: null → admin's reason
- `products.stock`: Restored (tickets only, batch operation)

**Stock Release Logic (Tickets):**
- Regular ticket: +quantity to main product
- Ticket bundle: +quantity to EACH bundled ticket product
- Example: 2x Bundling 1 rejected → Day1 stock +2, Day2 stock +2

---

### PV3: System Expires Order (24h Timeout)

**Trigger:**
- Cron job runs periodically (e.g., every hour)
- Calls `orderServices.expirePendingVerificationOrders()`

**System Behavior:**

```typescript
// Line 1882-1915
const ordersToExpire = await ctx.orderQueries.getOrders({
  status: "pending_verification",
  sortBy: "createdAt",
  sortOrder: "asc",
});

const expiredOrdersData = ordersToExpire.orders.filter((order) => {
  const createdAt = new Date(order.createdAt);
  const expiryTime = new Date(createdAt.getTime() + 24 * 60 * 60 * 1000);
  return expiryTime < now;
});

await ctx.orderQueries.expirePendingVerificationOrders();

// Line 1926-1969: Release stock for ticket orders
if (ticketOrderItems.length > 0) {
  await ctx.productQueries.batchIncrementProductStock(stockReleases);
}

// Line 1971: TODO: Send email
```

**Database Changes:**
- `orders.status`: `pending_verification` → `expired`
- `products.stock`: Restored (tickets only)

**Expected Email (TODO):**
- Template: `ticketOrderExpired` or `merchOrderExpired`
- Currently not implemented (see line 1971)

---

## Refund Request Flow

### RF1: User Submits Refund Request

**Pre-condition:**
- Order status: `paid`
- Current date < Refund deadline (H-3 before event at 23:59:59 WIB)
- No existing refund request with status `requested`

**User Action:**
1. Clicks refund link from order confirmation email: `https://store.tedxuniversitasbrawijaya.com/refund/{refundToken}`
2. Views order details (auto-populated)
3. Fills refund form:
   - Reason: "Tidak bisa hadir" | "Berhalangan mendadak" | etc.
   - Payment method: "manual" (matches order.paymentMethod)
   - Bank account number: "1234567890"
   - Bank name: "BCA" | "Mandiri" | "BNI"
   - Account holder name: "John Doe"
   - Payment proof: Upload QRIS screenshot (required for manual mode)
4. Submits request

**System Validation:**

```typescript
// packages/core/src/services/refund.ts:301-359
const orderData = await assertRefundableOrder(ctx, refundToken);

// Checks:
// 1. Token exists and valid
// 2. Order status === "paid"
// 3. No pending refund request
// 4. Current date <= refundDeadline

const refundDeadline = await getRefundDeadline(ctx, orderData);
// Calculates earliest event date - 3 days, 23:59:59 WIB
```

**System Behavior:**

```typescript
// Line 425-440
await ctx.orderQueries.updateOrder(orderData.order.id, {
  status: "refund_requested",
});

await ctx.refundQueries.createRefundRequest({
  id: refundId,
  orderId: orderData.order.id,
  status: "requested",
  reason: input.reason,
  paymentMethod: input.paymentMethod,
  paymentProofUrl, // Uploaded to R2: refund-proofs/
  bankAccountNumber: input.bankAccountNumber,
  bankName: input.bankName,
  bankAccountHolder: input.bankAccountHolder,
});
```

**Database Changes:**
- `orders.status`: `paid` → `refund_requested`
- `refund_requests`: New record created

**Email (TODO):**
- Line 462: Refund confirmation email not implemented

---

### RF2: Admin Approves Refund

**Pre-condition:**
- Order status: `refund_requested`
- Refund request exists with status: `requested`

**Admin Action:**
1. Opens order detail in dashboard
2. Reviews refund request (reason, bank details, payment proof)
3. Clicks "Approve Refund"

**System Behavior:**

```typescript
// packages/core/src/services/order.ts:1701-1762
// Line 1702-1750: Release stock for ticket orders
if (order.type === "ticket") {
  // Collect stock releases for main products + bundle items
  const stockReleases = [...];

  await ctx.productQueries.batchIncrementProductStock(stockReleases);
}

// Line 1752-1757: Update refund request
await ctx.refundQueries.updateRefundRequest(refundRequest.id, {
  status: "approved",
  processedBy: processorId,
  processedAt: new Date().toISOString(),
  rejectionReason: null,
});

// Line 1759-1761: Update order
await ctx.orderQueries.updateOrder(orderId, {
  status: "refunded",
});
```

**Stock Release Logic (Tickets Only):**
- Regular ticket: Increment main product stock by quantity
- Ticket bundle: Increment ALL bundled ticket products by quantity
- Example: 2x Bundling 1 refunded → Day1 +2, Day2 +2

**Database Changes:**
- `orders.status`: `refund_requested` → `refunded`
- `refund_requests.status`: `requested` → `approved`
- `refund_requests.processedBy`: null → admin_001
- `refund_requests.processedAt`: null → current timestamp
- `products.stock`: Incremented (tickets only)

**Email (TODO):**
- Line 1763: Refund confirmation email not implemented

---

### RF3: Admin Rejects Refund

**Pre-condition:**
- Order status: `refund_requested`

**Admin Action:**
1. Reviews refund request
2. Clicks "Reject Refund"
3. Enters rejection reason: "Sudah melewati batas waktu" | "Data bank tidak valid"

**System Behavior:**

```typescript
// Line 1768-1777
await ctx.refundQueries.updateRefundRequest(refundRequest.id, {
  status: "rejected",
  processedBy: processorId,
  processedAt: new Date().toISOString(),
  rejectionReason: reason,
});

// Line 1779-1782: Revert order to paid
await ctx.orderQueries.updateOrder(orderId, {
  status: "paid",
});
```

**Database Changes:**
- `orders.status`: `refund_requested` → `paid` (reverted)
- `refund_requests.status`: `requested` → `rejected`
- `refund_requests.processedBy`: null → admin_001
- `refund_requests.rejectionReason`: null → admin's reason
- **No stock changes** (order returns to paid state)

**Email (TODO):**
- Line 1783: Rejection email not implemented

---

## Email Verification

### Email Template: merchOrder

**Trigger**: Admin approves merch order payment
**Code**: `order.ts:588-598`

**Email Details:**
```yaml
Subject: "Payment Approved"
To: order.buyerEmail
Template: merchOrder
```

**Email Body (Indonesian):**
```
Halo!

Terima kasih atas antusiasme kamu dalam pembelian official merchandise TEDxUniversitasBrawijaya 2026!

Pembayaran kamu telah berhasil diproses. Saat ini, pesanan kamu sedang masuk dalam tahap pemrosesan. Mohon kesediaannya menunggu beberapa waktu sampai merchandise-mu siap untuk diambil. Jika ada pertanyaan mengenai detail pesanan atau pengambilan, jangan ragu untuk menghubungi contact person yang tertera pada email ini.

Terima kasih!

[Detail Order Box]
NO. PESANAN {orderId}
---
Produk | Harga Satuan | Jumlah | Total Harga
{items[].name} | {items[].price} | {items[].quantity} | {total}
---
Total Harga: {totalPrice}

[Contact Person]
081251784430 - Akmal
087744408583 - Sekar

Salam hangat,
Tim TEDXUniversitas Brawijaya
```

**Item Details Format:**
- Regular item: "{name}"
- Item with variants: "{name}: {variant.label}: {variant.value}"
- Bundle item: "{name}: {bundleProduct.name} ({variant}), {bundleProduct.name} ({variant})"

**Example for M3.1** (Bundling A):
```
Produk: Bundling A: T-shirt B (Size: M), Topi A
Harga Satuan: Rp135.000
Jumlah: 1
Total Harga: Rp135.000
```

**Attachments**: None

---

### Email Template: merchOrderExpired

**Trigger**: Order expires after 24h without verification
**Code**: `order.ts:1971` (TODO - not implemented)

**Expected Email:**
```yaml
Subject: "Pesanan merchandise Anda telah kadaluarsa"
To: order.buyerEmail
Template: merchOrderExpired
```

**Email Body:**
```
Halo!

Terima kasih atas antusiasme kamu dalam pembelian official merchandise TEDxUniversitasBrawijaya 2026!

Kami ingin menginformasikan bahwa pesanan kamu tidak dapat diproses lebih lanjut karena pembayaran yang dilakukan tidak terverifikasi oleh sistem kami. Oleh karena itu, status pesanan kamu saat ini telah kadaluarsa (expired).

Kamu tetap memiliki kesempatan untuk melakukan pemesanan ulang dengan mengikuti prosedur pembayaran yang benar.

Apabila kamu merasa terjadi kesalahan atau memiliki kendala terkait proses pembayaran, silakan hubungi contact person yang tertera di bawah ini.

Terima kasih atas pengertianmu.

[Detail Order Box]
[Contact Person]
```

---

### Email Template: merchOrderRejected

**Trigger**: Admin rejects merch order payment
**Code**: `order.ts:722-733`

**Email Details:**
```yaml
Subject: "Pesanan merchandise Anda ditolak"
To: order.buyerEmail
Template: merchOrderRejected
```

**Email Body:**
```
Halo!

Terima kasih atas antusiasme kamu dalam pembelian official merchandise TEDxUniversitasBrawijaya 2026!

Kami ingin menginformasikan bahwa pesanan kamu tidak dapat diproses lebih lanjut karena pembayaran yang dilakukan tidak valid. Oleh karena itu, status pesanan kamu saat ini ditolak (rejected) karena **{reason}**.

Kamu tetap memiliki kesempatan untuk melakukan pemesanan ulang dengan mengikuti prosedur pembayaran yang benar.

Apabila kamu merasa terjadi kesalahan atau memiliki kendala terkait proses pembayaran, silakan hubungi contact person yang tertera di bawah ini.

Terima kasih atas pengertianmu.

[Detail Order Box]
[Contact Person]
```

**Rejection Reasons Examples:**
- "Bukti pembayaran tidak valid"
- "Nominal tidak sesuai"
- "Transfer dari bank yang berbeda"

---

### Email Template: ticketOrder

**Trigger**: Admin approves ticket order payment
**Code**: `order.ts:423-445` (regular), `562-583` (bundle)

**Email Details:**
```yaml
Subject: "Payment Approved"
To: order.buyerEmail
Template: ticketOrder
Attachments: QR code PNG files (1 per ticket)
```

**Email Body:**
```
Halo!

Terima kasih atas antusiasme kamu untuk menjadi bagian dari perjalanan bertumbuh bersama TEDxUniversitasBrawijaya 2026!

Pembayaran kamu telah berhasil diproses. Tiket ini adalah pintu masuk-mu menuju ruang tempat berbagai kisah dari perjalanan hidup dipertemukan. Pastikan kamu menyimpan tiket ini dengan aman dan membawanya saat hari penukaran tiket dan/atau Hari-H acara diselenggarakan.

Kami sangat menantikan kehadiran dan cerita yang akan kamu bawa. Siapkan dirimu untuk saling mendengar dan membangun makna baru di rumah kita nanti!

---

Gabung grup WhatsApp peserta untuk info terbaru, jadwal, dan pengumuman acara mengenai {eventName} ({eventDate})!

[WhatsApp Button: Gabung Grup WhatsApp {eventName} ({eventDate})]
{item.tickets.map(t => WhatsApp button for each event)}

---

Apabila kamu memiliki kendala dan ingin mengajukan pengembalian dana (refund) tiket, silakan kunjungi laman refund [disini]({refundUrl}).

Terima kasih!

[Detail Order Box]
NO. PESANAN {orderId}
---
Produk: {item.name}
Harga Satuan: {item.price}
Jumlah: {item.quantity}
Total Harga: {totalPrice}

[Contact Person]
```

**Attachments (QR Codes):**
- Filename format: `{eventDate}-{index}.png`
- Example for T1.2 (3x Day 2):
  - "11 Agu 2026-1.png"
  - "11 Agu 2026-2.png"
  - "11 Agu 2026-3.png"
- Example for T2.1 (Bundling 1):
  - "Propaganda 3 Day 1-1.png"
  - "Propaganda 3 Day 2-2.png"

**WhatsApp Group Links:**
- Day 1: `https://chat.whatsapp.com/xxx` (from config: whatsapp_group_propa3_day1)
- Day 2: `https://chat.whatsapp.com/xxx` (from config: whatsapp_group_propa3_day2)
- Main Event: `https://chat.whatsapp.com/xxx` (from config: whatsapp_group_main)

**Refund URL Format:**
```
https://store.tedxuniversitasbrawijaya.com/refund/{order.refundToken}
```
Note: Currently hardcoded (line 438, 576), should be environment-aware

---

### Email Template: ticketOrderExpired

**Trigger**: Order expires after 24h without verification
**Code**: `order.ts:1876` (TODO - not implemented)

**Expected Email:**
```yaml
Subject: "Pesanan tiket Anda telah kadaluarsa"
To: order.buyerEmail
Template: ticketOrderExpired
```

**Email Body:**
```
Halo!

Terima kasih atas antusiasme kamu untuk menjadi bagian dari perjalanan bertumbuh bersama TEDxUniversitasBrawijaya 2026!

Kami ingin menginformasikan bahwa pesanan kamu tidak dapat diproses lebih lanjut karena pembayaran yang dilakukan tidak terverifikasi oleh sistem kami. Oleh karena itu, status pesanan kamu saat ini telah kadaluarsa (expired).

Kamu tetap memiliki kesempatan untuk melakukan pemesanan ulang dengan mengikuti prosedur pembayaran yang benar.

Apabila kamu merasa terjadi kesalahan atau memiliki kendala terkait proses pembayaran, silakan hubungi contact person yang tertera di bawah ini.

Terima kasih atas pengertianmu.

[Detail Order Box]
[Contact Person]
```

---

### Email Template: ticketOrderRejected

**Trigger**: Admin rejects ticket order payment
**Code**: `order.ts:643-659` (regular), `701-717` (bundle)

**Email Details:**
```yaml
Subject: "Pesanan tiket Anda ditolak"
To: order.buyerEmail
Template: ticketOrderRejected
```

**Email Body:**
```
Halo!

Terima kasih atas antusiasme kamu untuk menjadi bagian dari perjalanan bertumbuh bersama TEDxUniversitasBrawijaya 2026!

Kami ingin menginformasikan bahwa pesanan kamu tidak dapat diproses lebih lanjut karena pembayaran yang dilakukan tidak valid. Oleh karena itu, status pesanan kamu saat ini ditolak (rejected) karena **{reason}**.

Kamu tetap memiliki kesempatan untuk melakukan pemesanan ulang dengan mengikuti prosedur pembayaran yang benar.

Apabila kamu merasa terjadi kesalahan atau memiliki kendala terkait proses pembayaran, silakan hubungi contact person yang tertera di bawah ini.

Terima kasih atas pengertianmu.

[Detail Order Box]
[Contact Person]
```

**Note**: Stock is restored for rejected ticket orders (both regular and bundle)

---

### Email Template: Refund Confirmation (TODO)

**Trigger**: Admin processes refund request
**Code**: `order.ts:1763` (approved), `refund.ts:462` (submitted)

**Expected Emails:**

**1. Refund Request Submitted:**
```yaml
Subject: "Permintaan Refund Diterima"
To: order.buyerEmail
```

**Body:**
```
Halo {buyerName}!

Permintaan refund untuk pesanan {orderId} telah kami terima.

Detail Refund:
- Alasan: {reason}
- Rekening: {bankName} - {bankAccountNumber} a.n. {bankAccountHolder}

Tim kami akan memproses permintaan kamu dalam 3-5 hari kerja. Kami akan mengirimkan email konfirmasi setelah proses refund selesai.

Terima kasih atas pengertianmu.
```

**2. Refund Approved:**
```yaml
Subject: "Refund Disetujui"
To: order.buyerEmail
```

**Body:**
```
Halo {buyerName}!

Permintaan refund untuk pesanan {orderId} telah disetujui.

Dana akan ditransfer ke rekening:
- Bank: {bankName}
- Nomor Rekening: {bankAccountNumber}
- Nama Pemilik: {bankAccountHolder}

Proses transfer akan dilakukan dalam 7-14 hari kerja.

Terima kasih!
```

**3. Refund Rejected:**
```yaml
Subject: "Refund Ditolak"
To: order.buyerEmail
```

**Body:**
```
Halo {buyerName}!

Kami mohon maaf, permintaan refund untuk pesanan {orderId} tidak dapat diproses karena: **{rejectionReason}**.

Pesanan kamu tetap valid dan dapat digunakan untuk menghadiri acara.

Jika ada pertanyaan, silakan hubungi contact person kami.
```

---

## Database State Verification

### Orders Table State Transitions

```
pending_verification → paid          (admin approves)
pending_verification → rejected      (admin rejects)
pending_verification → expired       (24h timeout)
paid → refund_requested              (user requests)
refund_requested → refunded          (admin approves refund)
refund_requested → paid              (admin rejects refund)
```

### Order Creation (Merch Example: M1.1)

**Query**: `orderQueries.createOrder(orderData, orderItems)`

**orders table:**
```sql
INSERT INTO orders (
  id,                     -- "TDX-260801-A1B2C"
  type,                   -- "merch"
  status,                 -- "pending_verification"
  buyerName,              -- "John Doe"
  buyerEmail,             -- "john.doe@example.com"
  buyerPhone,             -- "081234567890"
  buyerCollege,           -- "Universitas Brawijaya"
  totalPrice,             -- 10000
  paymentMethod,          -- "manual"
  proofImageUrl,          -- "https://storage.../payment-proofs/merchandise/TDX-..."
  idempotencyKey,         -- client-generated UUID
  expiresAt,              -- createdAt + 24h
  paidAt,                 -- NOW (for manual mode)
  refundToken,            -- UUID v7
  createdAt,              -- NOW
  updatedAt               -- NOW
) VALUES (...);
```

**order_items table:**
```sql
INSERT INTO order_items (
  id,                     -- "oi_..."
  orderId,                -- "TDX-260801-A1B2C"
  productId,              -- "prod_..."
  quantity,               -- 1
  snapshotName,           -- "Stickers A"
  snapshotPrice,          -- 10000
  snapshotType,           -- "merch_regular"
  snapshotVariants,       -- NULL
  snapshotBundleProducts  -- NULL
) VALUES (...);
```

---

### Stock Decrement (Ticket Example: T1.1)

**Query**: `productQueries.batchDecrementProductStock([{ productId, quantity }])`

**Implementation** (atomic):
```sql
UPDATE products
SET
  stock = stock - ?,
  updatedAt = strftime('%Y-%m-%dT%H:%M:%SZ', 'now')
WHERE
  id = ?
  AND stock >= ?       -- Guard: prevents overselling
  AND isActive = 1;

-- Check affected rows
-- If 0, rollback (insufficient stock or inactive)
```

**Before (Propaganda 3 Day 1):**
```
id: prod_xxx, stock: 23
```

**After (1x Day 1 ordered):**
```
id: prod_xxx, stock: 22
```

**For Bundles** (T2.1: Bundling 1):
```sql
-- Batch operation: 2 UPDATEs in transaction
UPDATE products SET stock = stock - 1 WHERE id = 'prod_day1' AND stock >= 1;
UPDATE products SET stock = stock - 1 WHERE id = 'prod_day2' AND stock >= 1;

-- If either fails, entire order fails (saga rollback)
```

---

### Payment Approval (Ticket Example: T1.2)

**Query 1**: `orderQueries.updateOrder(orderId, { status: "paid", verifiedBy, verifiedAt })`
```sql
UPDATE orders
SET
  status = 'paid',
  verifiedBy = 'admin_001',
  verifiedAt = '2026-08-01T10:30:00Z',
  updatedAt = strftime('%Y-%m-%dT%H:%M:%SZ', 'now')
WHERE id = ?;
```

**Query 2**: `ticketQueries.createTickets([{ id, orderItemId, eventDay, qrCode }])`
```sql
INSERT INTO tickets (id, orderItemId, eventDay, qrCode, createdAt, updatedAt)
VALUES
  ('ticket_1', 'oi_xxx', 'propa3_day2', 'nanoid1', NOW, NOW),
  ('ticket_2', 'oi_xxx', 'propa3_day2', 'nanoid2', NOW, NOW),
  ('ticket_3', 'oi_xxx', 'propa3_day2', 'nanoid3', NOW, NOW);
```

**tickets table result:**
```
id         | orderItemId | eventDay      | qrCode  | checkedIn | checkedInAt
-----------+-------------+---------------+---------+-----------+-------------
ticket_1   | oi_xxx      | propa3_day2   | nanoid1 | 0         | NULL
ticket_2   | oi_xxx      | propa3_day2   | nanoid2 | 0         | NULL
ticket_3   | oi_xxx      | propa3_day2   | nanoid3 | 0         | NULL
```

---

### Payment Rejection (Ticket Example: T1.1)

**Query 1**: `orderQueries.updateOrder(orderId, { status, verifiedBy, verifiedAt, rejectionReason })`
```sql
UPDATE orders
SET
  status = 'rejected',
  verifiedBy = 'admin_001',
  verifiedAt = '2026-08-01T11:00:00Z',
  rejectionReason = 'Bukti pembayaran tidak valid',
  updatedAt = NOW
WHERE id = ?;
```

**Query 2**: `productQueries.batchIncrementProductStock([{ productId, quantity }])`
```sql
UPDATE products
SET
  stock = stock + ?,
  updatedAt = NOW
WHERE id = ?;
```

**Before**: `stock: 22` (was decremented at order creation)
**After**: `stock: 23` (restored)

---

### Refund Request Submission

**Query 1**: `orderQueries.updateOrder(orderId, { status: "refund_requested" })`

**Query 2**: `refundQueries.createRefundRequest({ id, orderId, status, reason, ... })`
```sql
INSERT INTO refund_requests (
  id,                     -- "ref_..."
  orderId,                -- "TDX-..."
  status,                 -- "requested"
  reason,                 -- "Tidak bisa hadir"
  paymentMethod,          -- "manual"
  paymentProofUrl,        -- "https://storage.../refund-proofs/..."
  bankAccountNumber,      -- "1234567890"
  bankName,               -- "BCA"
  bankAccountHolder,      -- "John Doe"
  createdAt,              -- NOW
  updatedAt               -- NOW
) VALUES (...);
```

---

### Refund Approval (Ticket Example: T1.2)

**Query 1**: `productQueries.batchIncrementProductStock(stockReleases)`
```sql
-- Restore stock for 3x Propaganda 3 Day 2
UPDATE products
SET stock = stock + 3
WHERE id = 'prod_day2';
```

**Before**: `stock: 22`
**After**: `stock: 25` (restored)

**Query 2**: `refundQueries.updateRefundRequest(refundId, { status, processedBy, processedAt })`
```sql
UPDATE refund_requests
SET
  status = 'approved',
  processedBy = 'admin_001',
  processedAt = '2026-08-05T14:00:00Z',
  updatedAt = NOW
WHERE id = ?;
```

**Query 3**: `orderQueries.updateOrder(orderId, { status: "refunded" })`

**Final State:**
- orders.status: `refunded`
- refund_requests.status: `approved`
- products.stock: Restored to pre-order value

---

### Refund Rejection

**Query 1**: `refundQueries.updateRefundRequest(refundId, { status, processedBy, rejectionReason })`

**Query 2**: `orderQueries.updateOrder(orderId, { status: "paid" })`

**Result**: Order reverts to `paid`, no stock changes

---

## Edge Cases & Validations

### EC1: Max Quantity Validation (Tickets)

**Scenario**: User attempts to order 6x Propaganda 3 Day 1

**Validation** (API layer):
```typescript
// packages/api/src/schemas/order.ts
quantity: z.number().int().min(1).max(5)
```

**Expected Result**: API rejects with 400 Bad Request

---

### EC2: Insufficient Stock (Atomic Check)

**Scenario**:
- Propaganda 3 Day 1 has 2 tickets left
- User A orders 2x Day 1 (stock: 2 → 0)
- User B simultaneously orders 1x Day 1

**Stock Decrement Query:**
```sql
UPDATE products
SET stock = stock - 1
WHERE id = 'prod_day1' AND stock >= 1;  -- Guard fails (stock is 0)
```

**Result for User B**:
- `batchDecrementProductStock` returns `{ success: false, currentStock: 0 }`
- Order creation fails with 409 Conflict
- Error message: "Insufficient stock or product not available for purchase"

**Code Reference**: `order.ts:1412-1448`

---

### EC3: Cooldown Enforcement (Tickets Only)

**Scenario**:
- User orders 3x Propaganda 3 Day 1 at 10:00 AM
- User attempts another ticket order at 10:05 AM (5 min later)

**Validation**:
```typescript
// order.ts:1193-1200
const hasCooldown = await ctx.orderOperations.getBuyerCooldown(buyer.email);
if (hasCooldown) {
  throw new AppError(
    "BAD_REQUEST",
    `You are on cooldown. Please wait for ${cooldownMinutes} minutes before placing another order.`
  );
}
```

**KV Storage**:
```
Key: cooldown:{email}
Value: "1"
TTL: 600 seconds (10 min)
```

**Expected Result**: 429 Too Many Requests

**Note**: Cooldown does NOT apply to merch orders (line 792)

---

### EC4: Idempotency Key (Duplicate Order Prevention)

**Scenario**:
- User submits order with idempotencyKey: "uuid-123"
- Network glitch causes user to retry
- User submits same order again with same key

**Validation**:
```typescript
// order.ts:744-755
const existingOrderResponse = await ctx.orderOperations.getOrderResponse(idempotencyKey);
if (existingOrderResponse) {
  const parsed = JSON.parse(existingOrderResponse);
  return parsed; // Return cached response
}
```

**KV Storage**:
```
Key: order_response:{idempotencyKey}
Value: JSON.stringify({ orderId, status, totalPrice, expiresAt, qrisUrl })
TTL: 3600 seconds (1 hour)
```

**Expected Result**: Second request returns same orderId, no duplicate order created

---

### EC5: Bundle Item Variant Validation

**Scenario** (M3.1):
- Bundling A requires: T-Shirt (category) + Topi (category)
- User selects T-shirt B (size: M) + Topi A
- User submits invalid variant ID for T-shirt B

**Validation**:
```typescript
// order.ts:838-866
const validateVariants = (variantIds, productVariants, productId) => {
  const availableVariantIds = productVariants.map(v => v.id);
  const invalidVariantIds = variantIds.filter(
    variantId => !availableVariantIds.includes(variantId)
  );

  if (invalidVariantIds.length > 0) {
    throw new AppError("BAD_REQUEST", "Some variants are invalid for a product", {
      details: { productId, invalidVariantIds }
    });
  }
};
```

**Expected Result**: 400 Bad Request with invalid variant IDs

---

### EC6: Refund Deadline Enforcement

**Scenario**:
- Propaganda 3 Day 1 event date: 2026-08-10
- Refund deadline (H-3): 2026-08-07 23:59:59 WIB
- User attempts refund on 2026-08-08 (H-2)

**Validation**:
```typescript
// refund.ts:342-353
const refundDeadline = await getRefundDeadline(ctx, orderData);
const now = new Date();

if (now.getTime() > refundDeadline.getTime()) {
  throw new AppError("BAD_REQUEST", "REFUND_DEADLINE_PASSED", {
    details: {
      orderId: orderData.order.id,
      refundDeadline: refundDeadline.toISOString(),
      now: now.toISOString(),
    },
  });
}
```

**Deadline Calculation** (Jakarta timezone, UTC+7):
```typescript
// refund.ts:276-298
const earliestEventDate = new Date(Math.min(...candidateEventDates));
const refundDeadline = new Date(earliestEventDate);
refundDeadline.setUTCDate(refundDeadline.getUTCDate() - 3); // H-3
refundDeadline.setUTCHours(23 - 7, 59, 59, 999); // 23:59:59 WIB
```

**Expected Result**: 400 Bad Request - "REFUND_DEADLINE_PASSED"

---

### EC7: Payment Proof Required (Manual Mode)

**Scenario**: User attempts to create order without uploading payment proof

**Validation**:
```typescript
// order.ts:794-798 (merch), 1205-1210 (ticket)
if (paymentMode === "manual" && proofImage === null) {
  throw new AppError(
    "BAD_REQUEST",
    "Payment proof image is required for manual payment"
  );
}
```

**File Upload**:
```typescript
// order.ts:1038-1048
const uploadedProof = await ctx.fileServices.uploadFile(
  `${orderId}-${proofImage.name}`,
  await proofImage.arrayBuffer(),
  "payment-proofs/merchandise",
  { maxSizeMB: 5 }
);
```

**Expected Result**: 400 if missing, or file uploaded to R2 storage

---

### EC8: Event Date Parsing (Tickets)

**Scenario**: Order contains Bundling 1 (2 Day Pass)

**Logic**:
```typescript
// order.ts:318-385
const getEvent = async (productName: string) => {
  if (productName.toLowerCase().includes("propaganda 3 day 1")) {
    return { day: "propa3_day1", date, whatsappGroupUrl };
  }
  if (productName.toLowerCase().includes("propaganda 3 day 2")) {
    return { day: "propa3_day2", date, whatsappGroupUrl };
  }
  if (productName.toLowerCase().includes("main event")) {
    return { day: "main_event", date, whatsappGroupUrl };
  }
  return null;
};
```

**Purpose**: Parse event day from product name to:
1. Create tickets with correct `eventDay`
2. Attach correct WhatsApp group links
3. Check if event has passed (prevent ordering past events)

**Code Reference**: `order.ts:1344-1375` (event date check)

---

### EC9: Merch Pre-order Deadline

**Scenario**:
- Merch preorder deadline: 2026-07-15 23:59:59
- User attempts to order on 2026-07-16

**Validation**:
```typescript
// order.ts:780-787
const deadline = new Date(merchPreorderDeadline);
const now = new Date();
if (now > deadline) {
  throw new AppError("BAD_REQUEST", "Merch preorder deadline has passed", {
    details: { merchPreorderDeadline, now: now.toISOString() },
  });
}
```

**Expected Result**: 400 Bad Request

---

### EC10: Saga Rollback (Order Creation Failure)

**Scenario**:
- User orders 3x Propaganda 3 Day 1
- Stock decremented successfully (23 → 20)
- Database error during order creation (network issue, constraint violation, etc.)

**Rollback Logic**:
```typescript
// order.ts:1584-1611
if (createOrderError) {
  // Saga rollback: release all reserved stock in batch
  await ctx.productQueries.batchIncrementProductStock(stockOperations);

  if (uploadedProofImage) {
    // Rollback uploaded proof image if order creation failed
    await ctx.fileServices.deleteFile(uploadedProofImage.key);
  }

  ctx.logger.error("Order creation failed, stock released", {
    orderId,
    productId: item.productId,
    quantity: item.quantity,
    error: createOrderError,
  });

  throw new AppError(
    "INTERNAL_SERVER_ERROR",
    "Failed to create order, please try again later",
    { cause: createOrderError }
  );
}
```

**Result**:
- Stock restored (20 → 23)
- Payment proof deleted from R2
- User sees 500 error, can retry

---

### EC11: Bundle Stock Decrement (Ticket Bundle)

**Scenario**: 2x Bundling 1 (Day 1 + Day 2)

**Stock Operations**:
```typescript
// order.ts:1378-1406
const stockOperations = [
  { productId: 'prod_bundling1', quantity: 2 },  // Main bundle (stock is null, skipped)
  { productId: 'prod_day1', quantity: 2 },       // Bundled ticket 1
  { productId: 'prod_day2', quantity: 2 },       // Bundled ticket 2
];

const stockResults = await ctx.productQueries.batchDecrementProductStock(stockOperations);
```

**Atomic Batch Operation**:
- Both Day 1 and Day 2 must have >= 2 stock
- If either fails, BOTH are rolled back
- Prevents partial bundle fulfillment

**Before**:
- Day 1: 23, Day 2: 25

**After (success)**:
- Day 1: 21, Day 2: 23

**After (failure - Day 1 has only 1)**:
- Day 1: 23 (unchanged), Day 2: 25 (unchanged)
- Order fails with "Insufficient stock for bundle item"

---

### EC12: Payment Method Mismatch (Refund)

**Scenario**:
- Order paid via manual mode
- User submits refund with paymentMethod: "midtrans"

**Validation**:
```typescript
// refund.ts:390-398
if (input.paymentMethod !== orderData.order.paymentMethod) {
  throw new AppError("BAD_REQUEST", "PAYMENT_METHOD_MISMATCH", {
    details: {
      orderId: orderData.order.id,
      expected: orderData.order.paymentMethod,
      received: input.paymentMethod,
    },
  });
}
```

**Expected Result**: 400 Bad Request

---

## Testing Checklist

### Pre-Test Setup
- [ ] Seed database with test data
- [ ] Configure payment_mode = "manual"
- [ ] Set up Brevo API key for email testing
- [ ] Configure R2 storage for file uploads
- [ ] Set event dates to future dates

### Merchandise Orders
- [ ] M1.1: Single no-variant item (approve)
- [ ] M1.2: Single no-variant, quantity 3 (refund flow)
- [ ] M1.3: Multiple no-variant items (pickup)
- [ ] M2.1: Single variant item (approve)
- [ ] M2.2: Quantity 3 with variant (reject)
- [ ] M2.3: Multiple variants (refund rejected)
- [ ] M2.4: Complex cart 5+ items (approve + pickup)
- [ ] M3.1: Category bundle (approve + email check)
- [ ] M3.2: Category bundle quantity 2 (reject)
- [ ] M3.3: Different category bundle (refund approved)
- [ ] M4.1: Fixed product bundle (approve)
- [ ] M4.2: Fixed product bundle quantity 2 (expire)
- [ ] M5.1: Mixed cart (full refund flow)
- [ ] M5.2: Workshirt + multiple bundles (reject)

### Ticket Orders
- [ ] T1.1: Single ticket quantity 1 (all states)
- [ ] T1.2: Single ticket quantity 3 (refund flow)
- [ ] T1.3: Maximum quantity 5 (cooldown test)
- [ ] T2.1: Ticket bundle quantity 1 (approve + QR check)
- [ ] T2.2: Ticket bundle quantity 2 (stock decrement check)
- [ ] T2.3: Maximum bundle quantity (stock rollback test)
- [ ] T3.1: Ticket + fixed merch (approve + email)
- [ ] T3.2: Ticket + fixed merch quantity 3 (pickup)
- [ ] T4.1: Ticket + category merch (approve)
- [ ] T4.2: Ticket + category quantity 2 (refund)
- [ ] T4.3: Different category bundle (expire)

### State Transitions
- [ ] pending_verification → paid (verify email sent)
- [ ] pending_verification → rejected (verify stock restored)
- [ ] pending_verification → expired (verify email TODO)
- [ ] paid → refund_requested (verify refund record)
- [ ] refund_requested → refunded (verify stock restored)
- [ ] refund_requested → paid (verify revert)

### Email Verification
- [ ] merchOrder: Check order details, contact info
- [ ] merchOrderRejected: Check rejection reason
- [ ] merchOrderExpired: Check TODO status
- [ ] ticketOrder: Check QR attachments, WhatsApp links, refund URL
- [ ] ticketOrderRejected: Check stock restoration
- [ ] ticketOrderExpired: Check TODO status
- [ ] Refund emails: Check TODO status

### Edge Cases
- [ ] EC1: Max quantity validation (> 5)
- [ ] EC2: Insufficient stock (concurrent orders)
- [ ] EC3: Cooldown enforcement (10 min)
- [ ] EC4: Idempotency key (duplicate prevention)
- [ ] EC5: Invalid variant ID
- [ ] EC6: Refund after deadline
- [ ] EC7: Missing payment proof
- [ ] EC8: Event date parsing
- [ ] EC9: Merch deadline passed
- [ ] EC10: Saga rollback on failure
- [ ] EC11: Bundle partial stock failure
- [ ] EC12: Payment method mismatch

### Database Verification
- [ ] Verify order snapshots (variants, bundle products)
- [ ] Verify stock operations (atomic, batch)
- [ ] Verify ticket creation (QR codes unique)
- [ ] Verify refund records (bank details)
- [ ] Verify admin associations (verifiedBy, pickedUpBy)

---

## Notes for Testers

1. **Manual Payment Mode**: All tests assume `payment_mode = "manual"`. For Midtrans mode, order flow would be different (QR code generation, webhook handling).

2. **Email Sending**: Currently uses `ctx.waitUntil()` which is fire-and-forget. Consider implementing:
   - Email queue with retry mechanism
   - Email delivery status tracking
   - Fallback notification system

3. **TODO Items in Code**:
   - Line `order.ts:1876`: Expired order emails not sent
   - Line `order.ts:1763`: Refund approval emails not sent
   - Line `refund.ts:462`: Refund request emails not sent
   - Line `order.ts:438, 576`: Hardcoded refund URL

4. **Event Date Parsing**: Current implementation parses event days from product names (line `order.ts:318-385`). Consider storing `eventDay` directly in product schema for robustness.

5. **Stock Management**: Only applies to tickets (`ticket_regular` and bundled tickets). Merch has `stock: null` (pre-order model).

6. **Refund Deadline**: Calculated as H-3 before earliest event day, 23:59:59 WIB. For bundles with multiple event days, uses earliest date.

7. **QR Code Format**: Generated using `etiket/png` library, encoded as PNG ArrayBuffer, attached to emails as base64.

8. **Idempotency**: Order responses cached in KV for 1 hour. Use unique keys per test to avoid conflicts.

9. **CAPTCHA**: All tests require valid Turnstile token. Use test keys for development.

10. **Cooldown**: Only applies to ticket orders, not merch. Set to 10 minutes by default. Test by attempting 2 ticket orders within window.

---

**End of Test Scenarios Document**

For questions or issues, contact the development team or refer to:
- `docs/api-design.md` - API specifications
- `docs/prd.md` - Product requirements
- `packages/core/src/services/` - Service implementations
