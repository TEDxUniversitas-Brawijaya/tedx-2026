import { z } from "zod";

// Pagination
export const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
});

// Sorting
export const sortOrderSchema = z.enum(["asc", "desc"]);

// Product types
export const productTypeSchema = z.enum([
  "ticket_regular",
  "ticket_bundle",
  "merch_regular",
  "merch_bundle",
]);

export const orderTypeSchema = z.enum(["ticket", "merch"]);

// Order status
export const orderStatusSchema = z.enum([
  "pending_payment",
  "pending_verification",
  "paid",
  "expired",
  "refund_requested",
  "refunded",
]);

// Event days
export const eventDaySchema = z.enum([
  "propa3_day1",
  "propa3_day2",
  "main_event",
]);

// Attendance status
export const attendanceStatusSchema = z.enum(["not_checked_in", "checked_in"]);

// Payment methods
export const paymentMethodSchema = z.enum(["midtrans", "manual"]);

// Refund status
export const refundStatusSchema = z.enum(["requested", "approved", "rejected"]);

// User roles
export const userRoleSchema = z.enum(["admin", "superadmin"]);

// Buyer info (shared across orders)
export const buyerInfoSchema = z.object({
  buyerName: z.string().min(1).max(255),
  buyerEmail: z.string().email(),
  buyerPhone: z.string().min(10).max(20),
  buyerInstansi: z.string().min(1).max(255),
});

// Product variant
export const productVariantSchema = z.object({
  id: z.string(),
  type: z.string(),
  label: z.string(),
});

// Bundle item
export const bundleItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().positive(),
  isSelectable: z.boolean(),
});

// Snapshot variant (for order items)
export const snapshotVariantSchema = z.object({
  label: z.string(),
  type: z.string(),
});

// Common ID schemas with validation
export const orderIdSchema = z.string().regex(/^TDX-\d{6}-[A-Z0-9]{5}$/);
export const productIdSchema = z.string().startsWith("prod_");
export const orderItemIdSchema = z.string().startsWith("oi_");
export const ticketIdSchema = z.string().startsWith("tkt_");
export const refundIdSchema = z.string().startsWith("ref_");
export const userIdSchema = z.string();

// File upload
export const imageFileSchema = z
  .instanceof(File)
  .refine((file) => file.size <= 5 * 1024 * 1024, {
    message: "File size must be less than 5MB",
  })
  .refine((file) => file.type.startsWith("image/"), {
    message: "File must be an image",
  });

// ISO 8601 date string
export const isoDateStringSchema = z.iso.datetime();

// Idempotency key
export const idempotencyKeySchema = z.string().min(1).max(255);

// CAPTCHA token
export const captchaTokenSchema = z.string().min(1);
