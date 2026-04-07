import { z } from "zod";
import {
  isoDateStringSchema,
  orderIdSchema,
  refundIdSchema,
  snapshotVariantSchema,
} from "./common";

// refund.getOrderInfo
export const getRefundOrderInfoInputSchema = z.object({
  refundToken: z.string(),
});

export const getRefundOrderInfoOutputSchema = z.object({
  orderId: orderIdSchema,
  buyerName: z.string(),
  buyerEmail: z.string().email(),
  items: z.array(
    z.object({
      name: z.string(),
      quantity: z.number().int(),
      unitPrice: z.number().int(),
      snapshotVariants: z.array(snapshotVariantSchema).optional(),
    })
  ),
  totalPrice: z.number().int(),
  refundDeadline: isoDateStringSchema,
});

// refund.submitRequest
export const submitRefundRequestInputSchema = z.object({
  refundToken: z.string(),
  reason: z.string().min(1).max(1000),
  paymentMethod: z.string().min(1).max(255),
  bankAccountNumber: z.string().min(1).max(255),
  bankName: z.string().min(1).max(255),
  bankAccountHolder: z.string().min(1).max(255),
});

export const submitRefundRequestOutputSchema = z.object({
  refundId: refundIdSchema,
  status: z.literal("requested"),
  message: z.string(),
});
