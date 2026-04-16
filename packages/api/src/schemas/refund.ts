import { z } from "zod";
import {
  imageFileSchema,
  isoDateStringSchema,
  orderIdSchema,
  paymentMethodSchema,
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
  paymentMethod: paymentMethodSchema,
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
  paymentMethod: paymentMethodSchema,
  bankAccountNumber: z.string().min(1).max(255),
  bankName: z.string().min(1).max(255),
  bankAccountHolder: z.string().min(1).max(255),
  paymentProof: imageFileSchema.optional(),
});

export const submitRefundRequestOutputSchema = z.object({
  refundId: refundIdSchema,
  status: z.literal("requested"),
  message: z.string(),
});
