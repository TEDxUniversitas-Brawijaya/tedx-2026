# **Entity Relationship Diagram**

## **Overview**

Database: Cloudflare D1 (SQLite) via Drizzle ORM. 6 tables total. Variants and bundle items are stored as JSON columns to reduce complexity. Payment and merch pickup fields are merged into the orders table (always 1:1).

## **ID Strategy**

See ADR-013 for the full decision. Summary:

- **Orders** use a human-readable format: `TDX-{YYMMDD}-{XXXXX}` (e.g. `TDX-260801-A1B2C`). This makes it easy to communicate over phone/chat for customer support and admin lookup.

- **All other entities** use prefixed nanoid (e.g. `tkt_abc123`, `prod_def456`). Prefixed IDs are debuggable in logs and shorter than UUIDs.

## **DBML Schema**

See [here](https://dbdiagram.io/d/TEDxUB-699dbb43bd82f5fce2acaf87).

## **Order Status Flow**

See [here](https://mermaid.live/edit#pako:eNqFVE2P2jAQ_Ssjn6BKECFAIIdK_Ti0qlDVrtRDm2pl4gm4JHY6tunuIv57TQKBpd3d5JIZ-7038zL2juVaIEuZsdzie8lXxKtwO8oU-OfHq58Qhq-hRiWkWt3W_L5CZVP4TAIJckIPEgEYq_MNEBqkLYpMtegrVMOEd7UkFCmMhmElFVhZoXYWejlp1X8ad8ptkWQhc26lViksuHK8hC9fP95ATVoX4OpSc3Go4UkmLr38QgpLXBn4g8u11hvoGbS2xMO2_nUDl6IXHG_EoQNee-UtmhcghL8wt9jB2vgl1Nmu8Rq4szpscZ1fR7yv56hSOCVuCX87NI3aW3fv_5Rxy0pac1yH3lZywIrLEkqpNgEssdCE8CGMO85rqgt-_Kd5b99xBErkBkX_GY5L8zoX2v3HdpttfvZOJK1z19m2ksfZnKscy_Iy3S4obRFIrtYW_JR0tt48qhqW3EdWw6dv_0Odm38GxgK2IilYaslhwCokb7MP2e5AmTG79jOWsdR_Ciy4K23GMrX3sJqr71pXJyRpt1qztOCl8ZGrxfl8dlnyc4P0TjtlWRpNGg6W7tidj4bJYJrMxvE0Gs-SUZSMA3bP0nA-GM2j2Xwe-XcaD-NoH7CHRnY4mMfJdDaOklk8GcWTacBQSKtp0d4QzUWx_wuND2Q9).

## **R2 Buckets**

|                   |                                        |                         |                                  |
| :---------------: | :------------------------------------: | :---------------------: | :------------------------------: |
|     **Bucket**    |               **Domain**               |        **Access**       |           **Contents**           |
|    Public (CDN)   |   `cdn.tedxuniversitasbrawijaya.com`   |          Public         | Product images, marketing assets |
| Private (Storage) | `storage.tedxuniversitasbrawijaya.com` | Signed URLs, admin only |   Payment proofs, refund proofs  |

## **KV Keys**

|                          |                  |                |                                                      |
| :----------------------: | :--------------: | :------------: | :--------------------------------------------------: |
|      **Key Pattern**     |     **Value**    |     **TTL**    |                      **Purpose**                     |
|    `stock:{productId}`   |      integer     |      none      | Read cache for stock display (source of truth is D1) |
|    `cooldown:{email}`    | expiry timestamp |  600s (10 min) |                   Purchase cooldown                  |
| `order_expiry:{orderId}` |        "1"       | 1200s (20 min) |                     Expiry marker                    |
|    `idempotency:{key}`   |   response JSON  | 3600s (1 hour) |             Duplicate request prevention             |

## **Config Examples**

|                               |                        |                                          |
| :---------------------------: | :--------------------: | :--------------------------------------: |
|            **Key**            |        **Value**       |              **Description**             |
|         `payment_mode`        | `midtrans` or `manual` |    Active payment method (system-wide)   |
|   `merch_preorder_deadline`   | `2026-07-01T23:59:59Z` |        When merch pre-order closes       |
| `refund_deadline_days_before` |           `3`          | How many days before event refunds close |
|   `payment_timeout_minutes`   |          `20`          |           Order expiry timeout           |
|       `cooldown_minutes`      |          `10`          |            Per-buyer cooldown            |
|    `event_date_propa3_day1`   |      `2026-08-10`      |            Propa 3 Day 1 date            |
|    `event_date_propa3_day2`   |      `2026-08-11`      |            Propa 3 Day 2 date            |
|       `event_date_main`       |      `2026-08-17`      |              Main Event date             |

## **Key Design Decisions**

 1. **Simple tables**: Variants and bundle items stored as JSON on `products`. Payment and merch pickup fields merged into `orders` (always 1:1). Variant snapshots stored as JSON on `order_items`. Trade-off: no relational queries on variants/bundle items, but at this scale and timeline it's not needed. D1 supports `json_extract()` if ever required.

2. **Human-readable order IDs**: Orders use `TDX-YYMMDD-XXXXX` format for easy communication in customer support. All other entities use prefixed nanoid.

3. **Snapshot pattern**: `order_items` stores `snapshot_name`, `snapshot_price`, `snapshot_type` to preserve data at purchase time. Product updates do not affect existing orders.

4. **Tickets table granularity**: 1 row per person per event day. Bundle "ME + 2 Day Pass Propa 3" with quantity 2 generates 6 ticket rows (2 persons x 3 event days). Each has its own QR code.

5. **Bundle modeling via JSON.** `products.bundle_items` JSON array with `isSelectable` flag handles both fixed bundles and choice bundles. The selected choice is stored as the `product_id` on `order_items`.

6. **D1 as stock source of truth.** Stock decrement via single atomic UPDATE with WHERE guard. KV only caches stock for display. See ADR-002.

7. **Indexes**: Designed for the most common query patterns — order listing by status/type, attendance lookup by event day, cron expiry queries, and admin search by buyer email.

8. **Two R2 buckets**: Public CDN for product images, private storage for sensitive uploads (payment/refund proofs) accessible only via signed URLs.

9. **Idempotency key on orders**: Stored in the orders table with a unique constraint to prevent duplicate order creation at the DB level.

10. **Payment mode as config**: `payment_mode` in config table determines whether the system uses Midtrans or manual QRIS. This is a system-wide setting, not a per-order buyer choice. Allows switching once Midtrans merchant approval is granted.
