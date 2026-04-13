import type { MerchQueries } from "@tedx-2026/db";
import { AppError, createOrderNotFoundError } from "../errors";
import type { PaymentService } from "../services/payment";
import { isOrderCreationStatus } from "./checker";

type BuildResponseFromExistingOrderOptions = {
  merchQueries: MerchQueries;
  paymentService: PaymentService;
  apiBaseUrl: string;
  idempotencyKey: string;
  orderId: string;
};

export const buildResponseFromExistingOrder = async ({
  merchQueries,
  paymentService,
  apiBaseUrl,
  idempotencyKey,
  orderId,
}: BuildResponseFromExistingOrderOptions) => {
  const existingOrder =
    await merchQueries.getOrderByIdempotencyKey(idempotencyKey);

  if (!existingOrder || existingOrder.type !== "merch") {
    throw createOrderNotFoundError(orderId);
  }

  if (!isOrderCreationStatus(existingOrder.status)) {
    throw new AppError(
      "CONFLICT",
      "Idempotency key was already used for a finalized order",
      {
        details: {
          orderId: existingOrder.id,
          status: existingOrder.status,
        },
      }
    );
  }

  const orderExpiresAt = existingOrder.expiresAt;
  if (!orderExpiresAt) {
    throw new AppError(
      "INTERNAL_SERVER_ERROR",
      "Existing order is missing expiry timestamp",
      {
        details: {
          orderId: existingOrder.id,
        },
      }
    );
  }

  const paymentMethod =
    existingOrder.paymentMethod ??
    (existingOrder.midtransOrderId ? "midtrans" : "manual");

  if (paymentMethod === "midtrans") {
    const expiresAtDate = new Date(orderExpiresAt);
    const remainingMinutes = Math.ceil(
      (expiresAtDate.getTime() - Date.now()) / 60_000
    );
    const expiryMinutes = Math.max(1, remainingMinutes);

    const payment = await paymentService.createMidtransTransaction({
      orderId: existingOrder.id,
      totalPrice: existingOrder.totalPrice,
      buyerName: existingOrder.buyerName,
      buyerEmail: existingOrder.buyerEmail,
      buyerPhone: existingOrder.buyerPhone,
      expiryMinutes,
    });

    if (existingOrder.midtransOrderId !== payment.midtransOrderId) {
      await merchQueries.updateOrder(existingOrder.id, {
        midtransOrderId: payment.midtransOrderId,
      });
    }

    return {
      orderId: existingOrder.id,
      status: existingOrder.status,
      totalPrice: existingOrder.totalPrice,
      expiresAt: orderExpiresAt,
      payment,
    };
  }

  return {
    orderId: existingOrder.id,
    status: existingOrder.status,
    totalPrice: existingOrder.totalPrice,
    expiresAt: orderExpiresAt,
    payment: {
      uploadUrl: `${apiBaseUrl}/api/orders/${existingOrder.id}/payment-proof`,
    },
  };
};
