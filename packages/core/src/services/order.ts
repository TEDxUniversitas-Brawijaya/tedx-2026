import type { OrderQueries, ProductQueries, UserQueries } from "@tedx-2026/db";
import type { OrderOperations } from "@tedx-2026/kv";
import type { Order, OrderItem, User } from "@tedx-2026/types";
import {
  createNanoIdWithPrefix,
  createUUIDv7,
  tryCatch,
} from "@tedx-2026/utils";
import { AppError } from "../errors";
import { generateOrderId } from "../lib/generator";
import type { BaseContext } from "../types";
import type { ConfigServices } from "./config";
import type { EmailServices } from "./email";
import type { FileServices } from "./file";
import type { PaymentServices } from "./payment";

export type OrderServices = {
  getOrders: (opts?: {
    page: number;
    limit: number;
    type?: Order["type"];
    status?: Order["status"];
    search?: string;
    sortBy: "createdAt" | "totalPrice" | "status";
    sortOrder: "asc" | "desc";
  }) => Promise<{
    orders: Order[];
    meta: {
      total: number;
    };
  }>;

  getOrderById: (
    orderId: Order["id"]
  ) => Promise<Order & { items: OrderItem[] }>;

  getOrderStatus: (orderId: Order["id"]) => Promise<Order["status"]>;

  verifyPayment: (
    orderId: Order["id"],
    action: "approve" | "reject",
    reason: NonNullable<Order["rejectionReason"]>,
    verifierId: Order["verifiedBy"]
  ) => Promise<void>;

  // Seperate merch and ticket order
  createMerchOrder(
    order: Pick<Order, "buyer"> & {
      paymentProof: File | null;
      idempotencyKey: string;
      captchaToken: string;
    },
    items: (Pick<OrderItem, "productId" | "quantity"> & {
      variantIds?: string[]; // for regular items, the selected variant IDs (if applicable)
      bundleItemProducts?: {
        // for bundle items, the selected product IDs (if applicable)
        productId: string;
        variantIds?: string[];
      }[];
    })[]
  ): Promise<{
    orderId: Order["id"];
    status: Order["status"];
    totalPrice: Order["totalPrice"];
    expiresAt: Order["expiresAt"];
    qrisUrl: string | null;
  }>;

  processRefund: (
    orderId: Order["id"],
    action: "approve" | "reject",
    reason: NonNullable<Order["rejectionReason"]>,
    processorId: Order["verifiedBy"]
  ) => Promise<void>;

  expirePendingPaymentOrders: () => Promise<void>;
  expirePendingVerificationOrders: () => Promise<void>;
};

type CreateOrderServicesCtx = {
  configServices: ConfigServices;
  fileServices: FileServices;
  paymentServices: PaymentServices;
  emailServices: EmailServices;

  orderQueries: OrderQueries;
  userQueries: UserQueries;
  productQueries: ProductQueries;

  orderOperations: OrderOperations;
} & BaseContext;

export const createOrderServices = (
  ctx: CreateOrderServicesCtx
): OrderServices => ({
  getOrders: async (opts) => {
    const { orders, meta } = await ctx.orderQueries.getOrders(opts);

    const orderIds: string[] = [];
    const verifierIds: string[] = [];
    const pickupIds: string[] = [];

    for (const order of orders) {
      orderIds.push(order.id);
      if (order.verifiedBy) {
        verifierIds.push(order.verifiedBy);
      }
      if (order.pickedUpBy) {
        pickupIds.push(order.pickedUpBy);
      }
    }

    const adminIds = Array.from(new Set([...verifierIds, ...pickupIds]));

    const admins = await ctx.userQueries.getUsersByIds(adminIds);

    const adminMap: Record<string, User> = {};
    for (const admin of admins) {
      adminMap[admin.id] = admin;
    }

    const ordersWithDetails: Order[] = orders.map((order) => {
      return {
        buyer: {
          name: order.buyerName,
          email: order.buyerEmail,
          phone: order.buyerPhone,
          college: order.buyerCollege,
        },
        verifiedByUser: order.verifiedBy
          ? adminMap[order.verifiedBy] || null
          : null,
        pickedUpByUser: order.pickedUpBy
          ? adminMap[order.pickedUpBy] || null
          : null,
        ...order,
        expiresAt: new Date(order.expiresAt),
        paidAt: order.paidAt ? new Date(order.paidAt) : null,
        createdAt: new Date(order.createdAt),
        updatedAt: new Date(order.updatedAt),
        verifiedAt: order.verifiedAt ? new Date(order.verifiedAt) : null,
        pickedUpAt: order.pickedUpAt ? new Date(order.pickedUpAt) : null,
      };
    });

    // TODO: optimize with better queries if needed, cache results, etc

    return {
      orders: ordersWithDetails,
      meta,
    };
  },

  getOrderById: async (orderId) => {
    const order = await ctx.orderQueries.getOrderById(orderId);
    if (!order) {
      throw new AppError("NOT_FOUND", "Order not found", {
        details: { orderId },
      });
    }

    const adminIdsSet = new Set<string>();
    if (order.verifiedBy) {
      adminIdsSet.add(order.verifiedBy);
    }
    if (order.pickedUpBy) {
      adminIdsSet.add(order.pickedUpBy);
    }
    const adminIds = Array.from(adminIdsSet);

    const [orderItems, admins] = await Promise.all([
      ctx.orderQueries.getOrderItemsByOrderId(orderId),
      ctx.userQueries.getUsersByIds(adminIds),
    ]);

    const adminMap: Record<string, User> = {};
    for (const admin of admins) {
      adminMap[admin.id] = admin;
    }

    const orderWithDetails: Order & { items: OrderItem[] } = {
      buyer: {
        name: order.buyerName,
        email: order.buyerEmail,
        phone: order.buyerPhone,
        college: order.buyerCollege,
      },
      items: orderItems.map((item) => ({
        ...item,
        snapshot: {
          name: item.snapshotName,
          price: item.snapshotPrice,
          type: item.snapshotType,
          variants: item.snapshotVariants,
          bundleProducts: item.snapshotBundleProducts,
        },
      })),
      verifiedByUser: order.verifiedBy
        ? adminMap[order.verifiedBy] || null
        : null,
      pickedUpByUser: order.pickedUpBy
        ? adminMap[order.pickedUpBy] || null
        : null,
      ...order,
      expiresAt: new Date(order.expiresAt),
      paidAt: order.paidAt ? new Date(order.paidAt) : null,
      createdAt: new Date(order.createdAt),
      updatedAt: new Date(order.updatedAt),
      verifiedAt: order.verifiedAt ? new Date(order.verifiedAt) : null,
      pickedUpAt: order.pickedUpAt ? new Date(order.pickedUpAt) : null,
    };

    // TODO: optimize with better queries if needed, cache results, etc

    return orderWithDetails;
  },

  getOrderStatus: async (orderId) => {
    const status = await ctx.orderQueries.getOrderStatusById(orderId);
    if (status === null) {
      throw new AppError("NOT_FOUND", "Order not found", {
        details: { orderId },
      });
    }

    return status;
  },

  verifyPayment: async (orderId, action, reason, verifierId) => {
    const order = await ctx.orderQueries.getOrderById(orderId);
    if (!order) {
      throw new AppError("BAD_REQUEST", "Order not found", {
        details: { orderId },
      });
    }

    if (order.status !== "pending_verification") {
      throw new AppError(
        "BAD_REQUEST",
        "Only orders with pending_verification status can be verified",
        {
          details: { orderId },
        }
      );
    }

    if (action === "approve") {
      await ctx.orderQueries.updateOrder(orderId, {
        status: "paid",
        verifiedBy: verifierId,
        verifiedAt: new Date().toISOString(),
      });
    } else {
      await ctx.orderQueries.updateOrder(orderId, {
        status: "rejected",
        verifiedBy: verifierId,
        verifiedAt: new Date().toISOString(),
        rejectionReason: reason,
      });
    }

    // TODO: Invalidate cache if any, send confirmation email based on action
  },

  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: TODO refactor this function to reduce complexity
  createMerchOrder: async (order, items) => {
    const {
      buyer,
      idempotencyKey,
      paymentProof: proofImage,
      // captchaToken,
    } = order;
    const existingOrderResponse =
      await ctx.orderOperations.getOrderResponse(idempotencyKey);
    if (existingOrderResponse) {
      const parsed = JSON.parse(existingOrderResponse);
      return {
        orderId: parsed.orderId,
        status: parsed.status,
        totalPrice: parsed.totalPrice,
        expiresAt: new Date(parsed.expiresAt),
        qrisUrl: parsed.qrisUrl,
      };
    }

    const [
      merchPreorderDeadline,
      paymentMode,
      paymentTimeoutMinutes,
      cooldownMinutes,
    ] = await Promise.all([
      ctx.configServices.getConfig("merch_preorder_deadline"),
      ctx.configServices.getConfig("payment_mode"),
      ctx.configServices.getConfig("payment_timeout_minutes"),
      ctx.configServices.getConfig("cooldown_minutes"),
    ]);
    if (
      merchPreorderDeadline === null ||
      paymentMode === null ||
      paymentTimeoutMinutes === null ||
      cooldownMinutes === null
    ) {
      throw new AppError(
        "INTERNAL_SERVER_ERROR",
        "Missing required configuration values"
      );
    }

    // Deadline check
    const deadline = new Date(merchPreorderDeadline);
    const now = new Date();
    if (now > deadline) {
      throw new AppError("BAD_REQUEST", "Merch preorder deadline has passed", {
        details: { merchPreorderDeadline, now: now.toISOString() },
      });
    }

    // TODO: Captcha verification

    // No cooldown on merch orders for now, but we can enable it in the future if needed

    if (paymentMode === "manual" && proofImage === null) {
      throw new AppError(
        "BAD_REQUEST",
        "Payment proof image is required for manual payment"
      );
    }

    // Check all products exist and active
    const productIds = new Set<string>();
    for (const item of items) {
      productIds.add(item.productId);

      // If bundle, also check the bundle products
      if (item.bundleItemProducts) {
        for (const bundleItemProduct of item.bundleItemProducts) {
          productIds.add(bundleItemProduct.productId);
        }
      }
    }
    const products = await ctx.productQueries.getProductsByIds(
      Array.from(productIds),

      {
        isActive: true,
      }
    );
    if (products.length !== productIds.size) {
      const foundProductIds = products.map((p) => p.id);
      const missingProductIds = Array.from(productIds).filter(
        (id) => !foundProductIds.includes(id)
      );
      throw new AppError(
        "BAD_REQUEST",
        "Some products are not found or not active",
        {
          details: {
            missingProductIds,
            // Passing buyer here because why can buyer order inactive product?
            buyer,
          },
        }
      );
    }

    // Validate variants against product variants
    const validateVariants = (
      variantIds: string[],
      productVariants: {
        id: string;
        label: string;
        type: string;
      }[],
      productId: string,
      parentProductId?: string
    ) => {
      const availableVariantIds = productVariants.map((v) => v.id);
      const invalidVariantIds = variantIds.filter(
        (variantId) => !availableVariantIds.includes(variantId)
      );

      if (invalidVariantIds.length > 0) {
        const errorMessage = parentProductId
          ? "Some variants are invalid for a bundle product"
          : "Some variants are invalid for a product";

        throw new AppError("BAD_REQUEST", errorMessage, {
          details: {
            productId,
            ...(parentProductId && { parentProductId }),
            invalidVariantIds,
          },
        });
      }
    };

    // Map selected variants to snapshot format
    const mapSnapshotVariants = (
      variantIds: string[] | undefined,
      productVariants: {
        id: string;
        label: string;
        type: string;
      }[]
    ) => {
      if (!variantIds) {
        return null;
      }

      return productVariants
        ?.filter((v) => variantIds.includes(v.id))
        .map((v) => ({
          label: v.label,
          type: v.type,
        }));
    };

    // Create product map for O(1) lookups
    const productMap = new Map(products.map((p) => [p.id, p]));

    const orderId = generateOrderId();
    let totalPrice = 0;
    const orderItems: {
      orderId: string;
      productId: string;
      id: string;
      quantity: number;
      snapshotName: string;
      snapshotPrice: number;
      snapshotType: string;
      snapshotVariants: { label: string; type: string }[] | null;
      snapshotBundleProducts:
        | {
            name: string;
            category: string | null;
            selectedVariants: { label: string; type: string }[] | null;
          }[]
        | null;
    }[] = [];

    // Validate and build order items in single pass
    for (const item of items) {
      const product = productMap.get(item.productId);
      if (!product) {
        continue;
      }

      totalPrice += product.price * item.quantity;

      if (item.variantIds && !product.variants) {
        throw new AppError(
          "BAD_REQUEST",
          "Product does not have variants but variantIds were provided",
          {
            details: { productId: item.productId, variantIds: item.variantIds },
          }
        );
      }

      // Validate variants if present
      if (item.variantIds && product.variants) {
        validateVariants(item.variantIds, product.variants, item.productId);
      }

      const snapshotVariants = product.variants
        ? mapSnapshotVariants(item.variantIds, product.variants)
        : null;

      // Validate and map bundle products
      const snapshotBundleProducts = item.bundleItemProducts
        ? // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: TODO refactor this part to reduce complexity
          item.bundleItemProducts.map((bundleItemProduct) => {
            const bundleProduct = productMap.get(bundleItemProduct.productId);

            if (!bundleProduct) {
              throw new AppError(
                "BAD_REQUEST",
                "Some bundle products are not found or not active",
                {
                  details: {
                    productId: bundleItemProduct.productId,
                    parentProductId: item.productId,
                  },
                }
              );
            }

            if (bundleItemProduct.variantIds && !bundleProduct.variants) {
              throw new AppError(
                "BAD_REQUEST",
                "Bundle product does not have variants but variantIds were provided",
                {
                  details: {
                    productId: bundleItemProduct.productId,
                    parentProductId: item.productId,
                    variantIds: bundleItemProduct.variantIds,
                  },
                }
              );
            }

            if (bundleItemProduct.variantIds && bundleProduct.variants) {
              validateVariants(
                bundleItemProduct.variantIds,
                bundleProduct.variants,
                bundleItemProduct.productId,
                item.productId
              );
            }

            const selectedVariants = bundleProduct.variants
              ? mapSnapshotVariants(
                  bundleItemProduct.variantIds,
                  bundleProduct.variants
                )
              : null;

            return {
              name: bundleProduct.name,
              category: bundleProduct.category,
              selectedVariants,
            };
          })
        : null;

      // Build order item
      orderItems.push({
        orderId,
        productId: item.productId,
        id: createNanoIdWithPrefix("oi"),
        quantity: item.quantity,
        snapshotName: product.name,
        snapshotPrice: product.price,
        snapshotType: product.type,
        snapshotVariants,
        snapshotBundleProducts,
      });
    }
    const refundToken = createUUIDv7();

    let proofImageUrl: string | null = null;
    if (paymentMode === "manual" && proofImage) {
      const uploadedProof = await ctx.fileServices.uploadFile(
        `${orderId}-${proofImage.name}`,
        await proofImage.arrayBuffer(),
        "payment-proofs/merchandise",
        {
          maxSizeMB: 5,
        }
      );
      proofImageUrl = uploadedProof.url;
    }

    const expiresAt = new Date(
      Date.now() + Number.parseInt(paymentTimeoutMinutes, 10) * 60 * 1000
    );

    const orderStatus =
      paymentMode === "manual" ? "pending_verification" : "pending_payment";

    const { error: createOrderError } = await tryCatch(
      ctx.orderQueries.createOrder(
        {
          id: orderId,
          buyerName: buyer.name,
          buyerEmail: buyer.email,
          buyerPhone: buyer.phone,
          buyerCollege: buyer.college,
          totalPrice,
          paymentMethod: paymentMode as Order["paymentMethod"],
          proofImageUrl,
          status: orderStatus,
          type: "merch",
          idempotencyKey,
          expiresAt: expiresAt.toISOString(),
          refundToken,
        },
        orderItems
      )
    );

    if (createOrderError) {
      throw new AppError(
        "INTERNAL_SERVER_ERROR",
        "Failed to create order, please try again later",
        {
          cause: createOrderError,
          details: {
            buyer,
            items,
          },
        }
      );
    }

    let qrisUrl: string | null = null;
    if (paymentMode === "midtrans") {
      const { data: chargeTransactionResponse, error: chargeTransactionError } =
        await tryCatch(ctx.paymentServices.chargeTransaction());
      if (chargeTransactionError) {
        // Rollback
        await ctx.orderQueries.deleteOrderById(orderId);

        throw new AppError(
          "INTERNAL_SERVER_ERROR",
          "Failed to create QRIS payment, please try again later",
          {
            cause: chargeTransactionError,
          }
        );
      }
      qrisUrl = chargeTransactionResponse.qrisUrl;
    }

    // Set cooldown for buyer if needed

    const response = {
      orderId,
      status: orderStatus,
      totalPrice,
      expiresAt,
      qrisUrl,
    };
    ctx.waitUntil(
      // Cache the response for 1 hour
      ctx.orderOperations.setOrderResponse(
        idempotencyKey,
        JSON.stringify(response),
        60 * 60
      )
    );

    return response;
  },

  processRefund: async (orderId, action, reason, processorId) => {
    const order = await ctx.orderQueries.getOrderById(orderId);
    if (!order) {
      throw new AppError("BAD_REQUEST", "Order not found", {
        details: { orderId },
      });
    }

    if (order.status !== "refund_requested") {
      throw new AppError(
        "BAD_REQUEST",
        "Only orders with refund_requested status can be processed for refund"
      );
    }

    if (action === "approve") {
      await ctx.orderQueries.updateOrder(orderId, {
        status: "refunded",
        verifiedBy: processorId,
        verifiedAt: new Date().toISOString(),
      });
      // TODO: Invalidate cache if any, send confirmation email based on action
      return;
    }

    ctx.logger.info("Refund rejected", {
      orderId,
      reason,
      processorId,
    });

    // See ADR-004
    await ctx.orderQueries.updateOrder(orderId, {
      status: "paid",
    });
    // TODO: Invalidate cache if any, send rejection email based on action

    return;
  },

  expirePendingPaymentOrders: async () => {
    const expiredOrders = await ctx.orderQueries.expirePendingPaymentOrders();

    ctx.logger.info(`Expired ${expiredOrders.length} pending_payment orders`);

    // TODO: Send email

    return;
  },

  expirePendingVerificationOrders: async () => {
    const expiredOrders =
      await ctx.orderQueries.expirePendingVerificationOrders();

    ctx.logger.info(
      `Expired ${expiredOrders.length} pending_verification orders`
    );

    // TODO: Send email

    return;
  },
});
