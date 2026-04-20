import { z } from "zod";
import {
  isoDateStringSchema,
  orderIdSchema,
  orderStatusSchema,
  orderTypeSchema,
  paginationSchema,
  paymentMethodSchema,
  refundStatusSchema,
  snapshotVariantSchema,
  sortOrderSchema,
  ticketIdSchema,
  userIdSchema,
} from "./common";

// admin.order.list
export const listOrdersInputSchema = paginationSchema.extend({
  type: orderTypeSchema.optional(),
  status: orderStatusSchema.optional(),
  search: z.string().optional(),
  sortBy: z.enum(["createdAt", "totalPrice", "status"]).default("createdAt"),
  sortOrder: sortOrderSchema.default("desc"),
});

export const listOrdersOutputSchema = z.object({
  orders: z.array(
    z.object({
      id: orderIdSchema,
      type: orderTypeSchema,
      status: orderStatusSchema,
      buyer: z.object({
        name: z.string(),
        email: z.email(),
        phone: z
          .e164("Nomor telepon harus dalam format (+628123456789)")
          .min(10)
          .max(20),
        college: z.string(),
      }),
      totalPrice: z.number().int(),
      createdAt: isoDateStringSchema,
      paidAt: isoDateStringSchema.nullable(),
    })
  ),
  pagination: z.object({
    page: z.number().int(),
    limit: z.number().int(),
    total: z.number().int(),
    totalPages: z.number().int(),
  }),
});

// admin.order.getById
export const getOrderByIdInputSchema = z.object({
  orderId: orderIdSchema,
});

export const getOrderByIdOutputSchema = z.object({
  id: orderIdSchema,
  type: orderTypeSchema,
  status: orderStatusSchema,

  buyer: z.object({
    name: z.string(),
    email: z.email(),
    phone: z
      .e164("Nomor telepon harus dalam format (+628123456789)")
      .min(10)
      .max(20),
    college: z.string(),
  }),

  totalPrice: z.number().int(),
  idempotencyKey: z.string(),
  expiresAt: isoDateStringSchema.nullable(),
  paidAt: isoDateStringSchema.nullable(),
  createdAt: isoDateStringSchema,
  updatedAt: isoDateStringSchema,
  paymentMethod: paymentMethodSchema.nullable(),
  midtransOrderId: z.string().nullable(),
  proofImageUrl: z.string().url().nullable(),
  verifiedBy: userIdSchema.nullable(),
  verifiedByUser: z
    .object({
      id: userIdSchema,
      name: z.string(),
    })
    .nullable(),
  verifiedAt: isoDateStringSchema.nullable(),
  rejectionReason: z.string().nullable(),
  refundToken: z.string().nullable(),
  pickedUpAt: isoDateStringSchema.nullable(),
  pickedUpBy: userIdSchema.nullable(),
  pickedUpByUser: z
    .object({
      id: userIdSchema,
      name: z.string(),
    })
    .nullable(),
  items: z.array(
    z.object({
      id: z.string(),
      productId: z.string(),
      quantity: z.number().int(),
      snapshot: z.object({
        name: z.string(),
        price: z.number().int(),
        type: z.string(),
        variants: z.array(snapshotVariantSchema).nullable(),
        bundleProducts: z
          .array(
            z.object({
              name: z.string(),
              category: z.string().nullable(),
              selectedVariants: z.array(snapshotVariantSchema).nullable(),
            })
          )
          .nullable(),
      }),
    })
  ),
  tickets: z
    .array(
      z.object({
        id: ticketIdSchema,
        qrCode: z.string(),
        eventDay: z.string(),
        attendanceStatus: z.string(),
        checkedInAt: isoDateStringSchema.nullable(),
        checkedInBy: userIdSchema.nullable(),
      })
    )
    .nullable(),
  refund: z
    .object({
      id: z.string(),
      status: refundStatusSchema,
      reason: z.string().optional(),
      paymentMethod: z.string(),
      paymentProofUrl: z.nullable(z.url()),
      bankAccountNumber: z.string(),
      bankName: z.string(),
      bankAccountHolder: z.string(),
      processedBy: userIdSchema.nullable(),
      processedAt: isoDateStringSchema.nullable(),
      rejectionReason: z.string().nullable(),
      createdAt: isoDateStringSchema,
    })
    .nullable(),
});

// admin.order.verifyPayment
export const verifyPaymentInputSchema = z.object({
  orderId: orderIdSchema,
  action: z.enum(["approve", "reject"]),
  reason: z.string().min(1).max(1000).optional(),
});

export const verifyPaymentOutputSchema = z.void();

// admin.order.processRefund
export const processRefundInputSchema = z.object({
  orderId: orderIdSchema,
  action: z.enum(["approve", "reject"]),
  reason: z.string().min(1).max(1000).optional(),
});

export const processRefundOutputSchema = z.void();
