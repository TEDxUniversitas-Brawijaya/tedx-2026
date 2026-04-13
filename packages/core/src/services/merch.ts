import type { ConfigQueries, MerchQueries } from "@tedx-2026/db";
import type { OrderKVOperations } from "@tedx-2026/kv";
import { assertOrderItemsPresent } from "../lib/assertion";
import { buildResponseFromExistingOrder } from "../lib/builder";
import { generateOrderId } from "../lib/generator";
import { isUniqueConstraintError } from "../lib/checker";
import { parseISODate } from "../lib/parser";
import { createNanoId } from "@tedx-2026/utils";
import {
  createInvalidVariantsError,
  createOrderNotFoundError,
  createPreorderDeadlinePassedError,
  createProductInactiveError,
  createProductNotFoundError,
} from "../errors";
import type { PaymentService } from "./payment";
import type { CreateOrderInput } from "@tedx-2026/types/order";

type CreateMerchServiceOptions = {
  configQueries: ConfigQueries;
  merchQueries: MerchQueries;
  orderKVOperations?: OrderKVOperations;
  paymentService: PaymentService;
  apiBaseUrl: string;
};

export type MerchService = {
  listProducts: () => Promise<
    {
      id: string;
      type: "merch_regular" | "merch_bundle";
      name: string;
      price: number;
      imageUrl: string | null;
      category?:
        | "t-shirt"
        | "workshirt"
        | "stickers"
        | "socks"
        | "keychain"
        | "hat";
      variants?: {
        id: string;
        type: string;
        label: string;
      }[];
      bundleItems?: unknown;
    }[]
  >;
  createOrder: (input: CreateOrderInput) => Promise<{
    orderId: string;
    status: "pending_payment" | "pending_verification";
    totalPrice: number;
    expiresAt: string;
    payment:
      | {
          qrisUrl: string;
          midtransOrderId: string;
        }
      | {
          uploadUrl: string;
        };
  }>;
  getOrderStatus: (orderId: string) => Promise<{
    orderId: string;
    status:
      | "pending_payment"
      | "pending_verification"
      | "paid"
      | "expired"
      | "refund_requested"
      | "refunded"
      | "rejected";
    type: "merch";
    totalPrice: number;
    items: {
      snapshotName: string;
      quantity: number;
      unitPrice: number;
      snapshotVariants?: { label: string; type: string }[];
    }[];
    createdAt: string;
    paidAt: string | null;
  }>;
};

export const createMerchService = ({
  configQueries,
  merchQueries,
  orderKVOperations,
  paymentService,
  apiBaseUrl,
}: CreateMerchServiceOptions): MerchService => ({
  listProducts: async () => {
    const deadline = parseISODate(
      await configQueries.getMerchPreorderDeadline()
    );
    const now = new Date();
    if (deadline && now > deadline) {
      return [];
    }

    const products = await merchQueries.listActiveProducts();

    return products.map((product) => ({
      id: product.id,
      type: product.type as "merch_regular" | "merch_bundle",
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl ?? null,
      category: product.category ?? undefined,
      variants: product.variants ?? undefined,
      bundleItems: product.bundleItems ?? undefined,
    }));
  },

  createOrder: async ({
    buyerName,
    buyerEmail,
    buyerPhone,
    buyerInstansi,
    idempotencyKey,
    items,
  }) => {
    const existingOrderByIdempotencyKey =
      await merchQueries.getOrderByIdempotencyKey(idempotencyKey);

    if (existingOrderByIdempotencyKey) {
      return await buildResponseFromExistingOrder({
        merchQueries,
        paymentService,
        apiBaseUrl,
        idempotencyKey,
        orderId: existingOrderByIdempotencyKey.id,
      });
    }

    assertOrderItemsPresent(items);

    const preorderDeadline = parseISODate(
      await configQueries.getMerchPreorderDeadline()
    );
    const now = new Date();

    if (preorderDeadline && now > preorderDeadline) {
      throw createPreorderDeadlinePassedError(preorderDeadline.toISOString());
    }

    const paymentMode = await configQueries.getPaymentMode();
    const timeoutMinutes = await configQueries.getPaymentTimeoutMinutes();
    const expiresAt = new Date(
      now.getTime() + timeoutMinutes * 60_000
    ).toISOString();

    const productIds = items.map((item) => item.productId);
    const products = await merchQueries.getProductsByIds(productIds);
    const productsById = new Map(
      products.map((product) => [product.id, product])
    );

    const normalizedItems = items.map((item) => {
      const product = productsById.get(item.productId);
      if (!product) {
        throw createProductNotFoundError(item.productId);
      }

      if (!product.isActive) {
        throw createProductInactiveError(item.productId);
      }

      const variants = product.variants ?? [];
      const variantsById = new Set(variants.map((variant) => variant.id));
      const invalidVariantIds = item.variantIds.filter(
        (variantId) => !variantsById.has(variantId)
      );

      if (invalidVariantIds.length > 0) {
        throw createInvalidVariantsError(item.productId, invalidVariantIds);
      }

      const snapshotVariants = variants
        .filter((variant) => item.variantIds.includes(variant.id))
        .map((variant) => ({
          label: variant.label,
          type: variant.type,
        }));

      return {
        item,
        product,
        snapshotVariants,
      };
    });

    const totalPrice = normalizedItems.reduce(
      (total, normalizedItem) =>
        total + normalizedItem.product.price * normalizedItem.item.quantity,
      0
    );

    const orderId = generateOrderId(now);
    const orderItems = normalizedItems.map((normalizedItem) => ({
      id: `oi_${createNanoId(16)}`,
      orderId,
      productId: normalizedItem.product.id,
      quantity: normalizedItem.item.quantity,
      snapshotName: normalizedItem.product.name,
      snapshotPrice: normalizedItem.product.price,
      snapshotType: normalizedItem.product.type,
      snapshotVariants: normalizedItem.snapshotVariants,
    }));

    try {
      await merchQueries.createOrderWithItems(
        {
          id: orderId,
          type: "merch",
          status: "pending_payment",
          buyerName,
          buyerEmail,
          buyerPhone,
          buyerCollege: buyerInstansi,
          totalPrice,
          idempotencyKey,
          expiresAt,
          paymentMethod: paymentMode,
          refundToken: createNanoId(24),
        },
        orderItems
      );
    } catch (error) {
      if (!isUniqueConstraintError(error)) {
        throw error;
      }

      return await buildResponseFromExistingOrder({
        merchQueries,
        paymentService,
        apiBaseUrl,
        idempotencyKey,
        orderId,
      });
    }

    if (orderKVOperations) {
      const cooldownConfig = await configQueries.getByKey("cooldown_minutes");
      const cooldownMinutes = Number(cooldownConfig?.value ?? "0");
      const tasks: Promise<void>[] = [
        orderKVOperations.setOrderExpiry(orderId, timeoutMinutes * 60),
      ];

      if (Number.isFinite(cooldownMinutes) && cooldownMinutes > 0) {
        tasks.push(
          orderKVOperations.setBuyerCooldown(buyerEmail, cooldownMinutes * 60)
        );
      }

      await Promise.allSettled(tasks);
    }

    if (paymentMode === "midtrans") {
      const payment = await paymentService.createMidtransTransaction({
        orderId,
        totalPrice,
        buyerName,
        buyerEmail,
        buyerPhone,
        expiryMinutes: timeoutMinutes,
      });

      await merchQueries.updateOrder(orderId, {
        midtransOrderId: payment.midtransOrderId,
      });

      return {
        orderId,
        status: "pending_payment",
        totalPrice,
        expiresAt,
        payment,
      };
    }

    return {
      orderId,
      status: "pending_payment",
      totalPrice,
      expiresAt,
      payment: {
        uploadUrl: `${apiBaseUrl}/api/orders/${orderId}/payment-proof`,
      },
    };
  },

  getOrderStatus: async (orderId) => {
    const orderWithItems = await merchQueries.getOrderWithItemsById(orderId);
    if (!orderWithItems || orderWithItems.order.type !== "merch") {
      throw createOrderNotFoundError(orderId);
    }

    return {
      orderId: orderWithItems.order.id,
      status: orderWithItems.order.status,
      type: "merch",
      totalPrice: orderWithItems.order.totalPrice,
      items: orderWithItems.items.map((item) => ({
        snapshotName: item.snapshotName,
        quantity: item.quantity,
        unitPrice: item.snapshotPrice,
        snapshotVariants: item.snapshotVariants ?? undefined,
      })),
      createdAt: orderWithItems.order.createdAt,
      paidAt: orderWithItems.order.paidAt,
    };
  },
});
