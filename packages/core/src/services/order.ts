import type {
  OrderQueries,
  ProductQueries,
  RefundQueries,
  UserQueries,
} from "@tedx-2026/db";
import type { OrderOperations } from "@tedx-2026/kv";
import type {
  File as CustomFile,
  Order,
  OrderItem,
  User,
} from "@tedx-2026/types";
import {
  createNanoIdWithPrefix,
  createUUIDv7,
  tryCatch,
} from "@tedx-2026/utils";
import { AppError } from "../errors";
import { generateOrderId } from "../lib/generator";
import type { BaseContext } from "../types";
import type { CaptchaServices } from "./captcha";
import type { ConfigServices } from "./config";
import type { EmailServices } from "./email";
import type { FileServices } from "./file";
import type { PaymentServices } from "./payment";
import type { TicketServices } from "./ticket";

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
    reason: Order["rejectionReason"],
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

  createTicketOrder(
    order: Pick<Order, "buyer"> & {
      paymentProof: File | null;
      idempotencyKey: string;
      captchaToken: string;
    },
    item: Pick<OrderItem, "productId" | "quantity"> & {
      bundleItemProducts?: {
        // for bundle items, the selected product IDs (if applicable)
        productId: string;
        variantIds?: string[];
      }[];
    }
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
  captchaServices: CaptchaServices;
  configServices: ConfigServices;
  fileServices: FileServices;
  paymentServices: PaymentServices;
  emailServices: EmailServices;
  ticketServices: TicketServices;

  orderQueries: OrderQueries;
  refundQueries: RefundQueries;
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

  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: TODO refactor to reduce complexity
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

    const orderItems = await ctx.orderQueries.getOrderItemsByOrderId(orderId);

    const items = orderItems.map((item) => ({
      name: item.snapshotName,
      price: item.snapshotPrice,
      quantity: item.quantity,
      variants: item.snapshotVariants
        ? item.snapshotVariants.map((v) => ({
            label: v.label,
            value: v.type,
          }))
        : [],
      bundleProducts: item.snapshotBundleProducts
        ? item.snapshotBundleProducts.map((bp) => ({
            name: bp.name,
            variants: bp.selectedVariants
              ? bp.selectedVariants.map((v) => ({
                  label: v.label,
                  value: v.type,
                }))
              : [],
          }))
        : [],
    }));

    if (action === "approve") {
      await ctx.orderQueries.updateOrder(orderId, {
        status: "paid",
        verifiedBy: verifierId,
        verifiedAt: new Date().toISOString(),
      });

      if (order.type === "ticket") {
        // TODO: hacky way to get event day, we should have a better way to store this information in the order item snapshot, but for now we can just parse it from the product name
        // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: TODO refactor to reduce complexity, maybe by storing event day in the order item snapshot
        const getEvent = async (productName: string) => {
          const [
            eventDatePropa3Day1,
            eventDatePropa3Day2,
            eventDateMain,
            whatsappGroupPropa3Day1,
            whatsappGroupPropa3Day2,
            whatsappGroupMain,
          ] = await Promise.all([
            ctx.configServices.getConfig("event_date_propa3_day1"),
            ctx.configServices.getConfig("event_date_propa3_day2"),
            ctx.configServices.getConfig("event_date_main"),
            ctx.configServices.getConfig("whatsapp_group_propa3_day1"),
            ctx.configServices.getConfig("whatsapp_group_propa3_day2"),
            ctx.configServices.getConfig("whatsapp_group_main"),
          ]);
          if (
            eventDatePropa3Day1 === null ||
            eventDatePropa3Day2 === null ||
            eventDateMain === null ||
            whatsappGroupPropa3Day1 === null ||
            whatsappGroupPropa3Day2 === null ||
            whatsappGroupMain === null
          ) {
            throw new AppError(
              "INTERNAL_SERVER_ERROR",
              "Missing required configuration values"
            );
          }

          if (productName.toLowerCase().includes("propaganda 3 day 1")) {
            return {
              day: "propa3_day1" as const,
              date: new Date(eventDatePropa3Day1).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
                year: "numeric",
              }),
              whatsappGroupUrl: whatsappGroupPropa3Day1,
            };
          }

          if (productName.toLowerCase().includes("propaganda 3 day 2")) {
            return {
              day: "propa3_day2" as const,
              date: new Date(eventDatePropa3Day2).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
                year: "numeric",
              }),
              whatsappGroupUrl: whatsappGroupPropa3Day2,
            };
          }

          if (productName.toLowerCase().includes("main event")) {
            return {
              day: "main_event" as const,
              date: new Date(eventDateMain).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
                year: "numeric",
              }),
              whatsappGroupUrl: whatsappGroupMain,
            };
          }
          return null;
        };

        const item = orderItems[0]; // For ticket order, there should only be 1 item, so we can just take the first one, so we can just take the first one
        if (!item) {
          throw new AppError(
            "INTERNAL_SERVER_ERROR",
            "Order item not found for approved order",
            {
              details: { orderId },
            }
          );
        }

        // ticker regular
        if (!item.snapshotBundleProducts) {
          const event = await getEvent(item.snapshotName);
          if (!event) {
            throw new AppError(
              "INTERNAL_SERVER_ERROR",
              "Failed to determine event day for ticket order",
              {
                details: { orderId, productName: item.snapshotName },
              }
            );
          }
          const tickets = (
            await ctx.ticketServices.createTickets(
              Array.from({ length: item.quantity }, () => ({
                orderItemId: item.id,
                eventDay: event.day,
              }))
            )
          ).map((t) => ({
            ...t,
            eventName: item.snapshotName,
            eventDate: event.date,
            whatsappGroupUrl: event.whatsappGroupUrl,
          }));

          ctx.waitUntil(
            ctx.emailServices.sendEmailWithAttachment(
              order.buyerEmail,
              "Payment Approved",
              "ticketOrder",
              {
                orderId: order.id,
                item: {
                  name: item.snapshotName,
                  price: item.snapshotPrice,
                  quantity: item.quantity,
                  tickets,
                },
                // TODO: set dynamic refund URL based on enviroment
                refundUrl: `https://store.tedxuniversitasbrawijaya.com/refund/${order.refundToken}`,
              },
              tickets.map((t, idx) => ({
                name: `${t.eventDate}-${idx + 1}.png`,
                content: t.qr,
              }))
            )
          );
          return;
        }

        // ticket bundle
        const product = await ctx.productQueries.getProductById(item.productId);
        if (!product) {
          throw new AppError(
            "INTERNAL_SERVER_ERROR",
            "Product not found for order item",
            {
              details: { productId: item.productId, orderId },
            }
          );
        }

        if (!product.bundleItems) {
          throw new AppError(
            "INTERNAL_SERVER_ERROR",
            "Bundle products not found for ticket bundle order item",
            {
              details: { productId: item.productId, orderId },
            }
          );
        }

        const tickets: {
          eventName: string;
          eventDate: string;
          eventDay: "propa3_day1" | "propa3_day2" | "main_event";
          whatsappGroupUrl: string;
        }[] = [];

        for (const snapshotBundleProduct of item.snapshotBundleProducts) {
          for (let i = 0; i < item.quantity; i++) {
            const event = await getEvent(snapshotBundleProduct.name);
            if (!event) {
              throw new AppError(
                "INTERNAL_SERVER_ERROR",
                "Failed to determine event day for ticket order",
                {
                  details: { orderId, productName: snapshotBundleProduct.name },
                }
              );
            }

            tickets.push({
              eventName: snapshotBundleProduct.name,
              eventDate: event.date,
              eventDay: event.day,
              whatsappGroupUrl: event.whatsappGroupUrl,
            });
          }
        }

        const createdTickets = await ctx.ticketServices.createTickets(
          tickets.map((t) => ({
            orderItemId: item.id,
            eventDay: t.eventDay,
          }))
        );

        const ticketsWithQr = createdTickets.map((t, idx) => {
          const ticketInfo = tickets[idx];
          if (!ticketInfo) {
            throw new AppError(
              "INTERNAL_SERVER_ERROR",
              "Ticket info not found for created ticket",
              {
                details: { orderId, ticketId: t.id },
              }
            );
          }

          return {
            ...t,
            eventName: ticketInfo.eventName,
            eventDate: ticketInfo.eventDate,
            whatsappGroupUrl: ticketInfo.whatsappGroupUrl,
          };
        });

        ctx.waitUntil(
          ctx.emailServices.sendEmailWithAttachment(
            order.buyerEmail,
            "Payment Approved",
            "ticketOrder",
            {
              orderId: order.id,
              item: {
                name: item.snapshotName,
                price: item.snapshotPrice,
                quantity: item.quantity,
                tickets,
                bundleProducts: item.snapshotBundleProducts.map((bp) => ({
                  name: bp.name,
                  variants: bp.selectedVariants
                    ? bp.selectedVariants.map((v) => ({
                        label: v.label,
                        value: v.type,
                      }))
                    : [],
                })),
              },
              // TODO: set dynamic refund URL based on enviroment
              refundUrl: `https://store.tedxuniversitasbrawijaya.com/refund/${order.refundToken}`,
            },
            ticketsWithQr.map((t, idx) => ({
              name: `${t.eventName}-${idx + 1}.png`,
              content: t.qr,
            }))
          )
        );
        return;
      }

      // order.type === "merch"
      ctx.waitUntil(
        ctx.emailServices.sendEmail(
          order.buyerEmail,
          "Payment Approved",
          "merchOrder",
          {
            orderId: order.id,
            items,
          }
        )
      );
      return;
    }

    // action === "reject"
    if (reason === null) {
      throw new AppError(
        "BAD_REQUEST",
        "Rejection reason is required when rejecting a payment",
        {
          details: { orderId },
        }
      );
    }
    await ctx.orderQueries.updateOrder(orderId, {
      status: "rejected",
      verifiedBy: verifierId,
      verifiedAt: new Date().toISOString(),
      rejectionReason: reason,
    });

    // Release stock for rejected ticket orders
    if (order.type === "ticket") {
      // Collect all product IDs (main products + bundle item products)
      const item = orderItems[0];
      if (!item) {
        // For ticket order, there should only be 1 item, so we can just take the first one, so we can just take the first one
        throw new AppError(
          "INTERNAL_SERVER_ERROR",
          "Order item not found for approved order",
          {
            details: { orderId },
          }
        );
      }

      // ticket regular
      if (!item.snapshotBundleProducts) {
        await ctx.productQueries.batchIncrementProductStock([
          {
            productId: item.productId,
            quantity: item.quantity,
          },
        ]);

        ctx.waitUntil(
          ctx.emailServices.sendEmail(
            order.buyerEmail,
            "Payment Rejected",
            "ticketOrderRejected",
            {
              orderId: order.id,
              item: {
                name: item.snapshotName,
                price: item.snapshotPrice,
                quantity: item.quantity,
              },
              reason,
            }
          )
        );
        return;
      }

      // ticket bundle
      const product = await ctx.productQueries.getProductById(item.productId);
      if (!product) {
        throw new AppError(
          "INTERNAL_SERVER_ERROR",
          "Product not found for order item",
          {
            details: { productId: item.productId, orderId },
          }
        );
      }

      // Collect stock release operations
      const stockReleases: { productId: string; quantity: number }[] = [];

      // DO NOT release stock for main product of ticket orders, because it is null and the stock is calculated based on the bundle items, so we only need to release stock for the bundle items
      if (!product.bundleItems) {
        throw new AppError(
          "INTERNAL_SERVER_ERROR",
          "Bundle products not found for ticket bundle order item",
          {
            details: { productId: item.productId, orderId },
          }
        );
      }
      for (const bundleItem of product.bundleItems) {
        if (bundleItem.type !== "ticket") {
          continue; // Only release stock for ticket bundle items, not merchandise bundle items
        }

        stockReleases.push({
          productId: bundleItem.productId,
          quantity: item.quantity,
        });
      }

      await ctx.productQueries.batchIncrementProductStock(stockReleases);

      ctx.waitUntil(
        ctx.emailServices.sendEmail(
          order.buyerEmail,
          "Payment Rejected",
          "ticketOrderRejected",
          {
            orderId: order.id,
            item: {
              name: item.snapshotName,
              price: item.snapshotPrice,
              quantity: item.quantity,
              bundleProducts: item.snapshotBundleProducts.map((bp) => ({
                name: bp.name,
                variants: bp.selectedVariants
                  ? bp.selectedVariants.map((v) => ({
                      label: v.label,
                      value: v.type,
                    }))
                  : [],
              })),
            },
            reason,
          }
        )
      );
      return;
    }

    // merch order
    ctx.waitUntil(
      ctx.emailServices.sendEmail(
        order.buyerEmail,
        "Payment Rejected",
        "merchOrderRejected",
        {
          orderId: order.id,
          items,
          reason,
        }
      )
    );
  },

  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: TODO refactor this function to reduce complexity
  createMerchOrder: async (order, items) => {
    const {
      buyer,
      idempotencyKey,
      paymentProof: proofImage,
      captchaToken,
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

    // CAPTCHA verification
    await ctx.captchaServices.verifyTurnstile(captchaToken);

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
        status: "all",
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

      if (!product.isActive) {
        throw new AppError("BAD_REQUEST", "Some products are not active", {
          details: {
            productId: item.productId,
            buyer,
          },
        });
      }

      if (product.price <= 0) {
        throw new AppError(
          "BAD_REQUEST",
          "Some products are not available for purchase",
          {
            details: {
              productId: item.productId,
              buyer,
            },
          }
        );
      }

      totalPrice += product.price * item.quantity;

      if (item.variantIds && !product.variants) {
        throw new AppError(
          "BAD_REQUEST",
          "Product does not have variants but variantIds were provided",
          {
            details: {
              productId: item.productId,
              variantIds: item.variantIds,
            },
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

    let uploadedProofImage: CustomFile | null = null;
    if (paymentMode === "manual" && proofImage) {
      const uploadedProof = await ctx.fileServices.uploadFile(
        `${orderId}-${proofImage.name}`,
        await proofImage.arrayBuffer(),
        "payment-proofs/merchandise",
        {
          maxSizeMB: 5,
        }
      );
      uploadedProofImage = uploadedProof;
    }

    const expiresAt = new Date(
      Date.now() + paymentMode === "manual"
        ? // For manual payments, the expiration is for verification, which can take longer, so we set a longer timeout (e.g. 24 hours) to accommodate that
          24 * 60 * 60 * 1000
        : Number.parseInt(paymentTimeoutMinutes, 10) * 60 * 1000
    );

    const orderStatus =
      paymentMode === "manual" ? "pending_verification" : "pending_payment";

    const paidAt = paymentMode === "manual" ? new Date().toISOString() : null;

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
          proofImageUrl: uploadedProofImage ? uploadedProofImage.url : null,
          status: orderStatus,
          type: "merch",
          idempotencyKey,
          expiresAt: expiresAt.toISOString(),
          paidAt,
          refundToken,
        },
        orderItems
      )
    );

    if (createOrderError) {
      if (uploadedProofImage) {
        // Rollback uploaded proof image if order creation failed
        await ctx.fileServices.deleteFile(uploadedProofImage.key);
      }
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

  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: TODO refactor this function to reduce complexity
  createTicketOrder: async (order, item) => {
    const {
      buyer,
      idempotencyKey,
      paymentProof: proofImage,
      captchaToken,
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
      paymentMode,
      paymentTimeoutMinutes,
      cooldownMinutes,
      eventDatePropa3Day1,
      eventDatePropa3Day2,
      eventDateMain,
    ] = await Promise.all([
      ctx.configServices.getConfig("payment_mode"),
      ctx.configServices.getConfig("payment_timeout_minutes"),
      ctx.configServices.getConfig("cooldown_minutes"),
      ctx.configServices.getConfig("event_date_propa3_day1"),
      ctx.configServices.getConfig("event_date_propa3_day2"),
      ctx.configServices.getConfig("event_date_main"),
    ]);
    if (
      cooldownMinutes === null ||
      paymentMode === null ||
      paymentTimeoutMinutes === null ||
      cooldownMinutes === null ||
      eventDatePropa3Day1 === null ||
      eventDatePropa3Day2 === null ||
      eventDateMain === null
    ) {
      throw new AppError(
        "INTERNAL_SERVER_ERROR",
        "Missing required configuration values"
      );
    }

    // Cooldown check
    const hasCooldown = await ctx.orderOperations.getBuyerCooldown(buyer.email);
    if (hasCooldown) {
      throw new AppError(
        "BAD_REQUEST",
        `You are on cooldown. Please wait for ${cooldownMinutes} minutes before placing another order.`
      );
    }

    // CAPTCHA verification
    await ctx.captchaServices.verifyTurnstile(captchaToken);

    if (paymentMode === "manual" && proofImage === null) {
      throw new AppError(
        "BAD_REQUEST",
        "Payment proof image is required for manual payment"
      );
    }

    // Check all products exist and active
    const productIds = new Set<string>();
    productIds.add(item.productId);

    // If bundle, also check the bundle products
    if (item.bundleItemProducts) {
      for (const bundleItemProduct of item.bundleItemProducts) {
        productIds.add(bundleItemProduct.productId);
      }
    }
    const products = await ctx.productQueries.getProductsByIds(
      Array.from(productIds),
      {
        status: "all",
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
      snapshotBundleProducts:
        | {
            name: string;
            category: string | null;
            selectedVariants: { label: string; type: string }[] | null;
          }[]
        | null;
    }[] = [];

    // Validate and build order items in single pass
    const product = productMap.get(item.productId);
    if (!product) {
      throw new AppError(
        "BAD_REQUEST",
        "Some products are not found or not active",
        {
          details: {
            productId: item.productId,
            buyer,
          },
        }
      );
    }

    if (!product.isActive) {
      throw new AppError("BAD_REQUEST", "Some products are not active", {
        details: {
          productId: item.productId,
          buyer,
        },
      });
    }

    // TODO: hacky way to get event date based on product name, we should have a better way to model this in the future
    const getEventDate = (productName: string) => {
      if (productName.toLowerCase().includes("propaganda 3 day 1")) {
        return new Date(eventDatePropa3Day1);
      }

      if (productName.toLowerCase().includes("propaganda 3 day 2")) {
        return new Date(eventDatePropa3Day2);
      }

      if (productName.toLowerCase().includes("main event")) {
        return new Date(eventDateMain);
      }
      return null;
    };

    const eventDate = getEventDate(product.name);

    const eventHasPassed = eventDate ? new Date() > eventDate : false;
    if (eventHasPassed) {
      throw new AppError(
        "BAD_REQUEST",
        "The event date for this ticket has passed, you cannot purchase this ticket",
        {
          details: {
            productId: item.productId,
            buyer,
            eventDate: eventDate ? eventDate.toISOString() : null,
          },
        }
      );
    }

    // Atomic stock decrement - Step 1 of Saga pattern
    // Collect all stock operations for batch execution
    const stockOperations: { productId: string; quantity: number }[] = [];

    if (!product.bundleItems) {
      // Regular ticket, decrement stock for the main product only
      stockOperations.push({
        productId: item.productId,
        quantity: item.quantity,
      });
    }

    // Validate bundle products exist and collect their stock operations
    if (product.bundleItems) {
      for (const bundleItem of product.bundleItems) {
        // Only decrement stock for ticket bundle items (merch has no stock)
        if (bundleItem.type !== "ticket") {
          continue;
        }

        const bundleProduct = productMap.get(bundleItem.productId);
        if (!bundleProduct) {
          throw new AppError("BAD_REQUEST", "Bundle item product not found", {
            details: {
              bundleItemProductId: bundleItem.productId,
              parentProductId: item.productId,
            },
          });
        }

        stockOperations.push({
          productId: bundleItem.productId,
          quantity: item.quantity,
        });
      }
    }

    // Execute all stock decrements in a single batch (prevents overselling atomically)
    const stockResults =
      await ctx.productQueries.batchDecrementProductStock(stockOperations);

    // Check if any operations failed
    const failedOperations = stockResults.filter((result) => !result.success);
    if (failedOperations.length > 0) {
      // Some operations failed, rollback successful ones
      const successfulOperations = stockResults
        .filter((result) => result.success)
        .map(({ productId }, index) => ({
          productId,
          quantity: stockOperations[index]?.quantity ?? 0,
        }));

      if (successfulOperations.length > 0) {
        await ctx.productQueries.batchIncrementProductStock(
          successfulOperations
        );
      }

      // Report the first failure
      const firstFailure = failedOperations[0];
      const isMainProduct = firstFailure?.productId === item.productId;

      throw new AppError(
        "BAD_REQUEST",
        isMainProduct
          ? "Insufficient stock or product not available for purchase"
          : "Insufficient stock for bundle item",
        {
          details: {
            productId: firstFailure?.productId,
            parentProductId: isMainProduct ? undefined : item.productId,
            buyer,
            requestedQuantity: item.quantity,
            currentStock: firstFailure?.currentStock,
          },
        }
      );
    }

    // Bundle stock decrements are tracked for error logging
    const bundleStockDecrements = stockOperations.slice(1);

    if (product.price <= 0) {
      throw new AppError(
        "BAD_REQUEST",
        "Some products are not available for purchase",
        {
          details: {
            productId: item.productId,
            buyer,
          },
        }
      );
    }

    totalPrice += product.price * item.quantity;

    // Validate and map bundle products
    const snapshotBundleProducts = item.bundleItemProducts
      ? item.bundleItemProducts.map((bundleItemProduct) => {
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
      snapshotBundleProducts,
    });
    const refundToken = createUUIDv7();

    let uploadedProofImage: CustomFile | null = null;
    if (paymentMode === "manual" && proofImage) {
      const uploadedProof = await ctx.fileServices.uploadFile(
        `${orderId}-${proofImage.name}`,
        await proofImage.arrayBuffer(),
        "payment-proofs/merchandise",
        {
          maxSizeMB: 5,
        }
      );
      uploadedProofImage = uploadedProof;
    }

    const expiresAt = new Date(
      Date.now() + paymentMode === "manual"
        ? // For manual payments, the expiration is for verification, which can take longer, so we set a longer timeout (e.g. 24 hours) to accommodate that
          24 * 60 * 60 * 1000
        : Number.parseInt(paymentTimeoutMinutes, 10) * 60 * 1000
    );

    const orderStatus =
      paymentMode === "manual" ? "pending_verification" : "pending_payment";

    const paidAt = paymentMode === "manual" ? new Date().toISOString() : null;

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
          proofImageUrl: uploadedProofImage ? uploadedProofImage.url : null,
          status: orderStatus,
          type: "ticket",
          idempotencyKey,
          expiresAt: expiresAt.toISOString(),
          paidAt,
          refundToken,
        },
        orderItems
      )
    );

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
        bundleStockDecrements,
        error: createOrderError,
      });

      throw new AppError(
        "INTERNAL_SERVER_ERROR",
        "Failed to create order, please try again later",
        {
          cause: createOrderError,
          details: {
            buyer,
            item,
          },
        }
      );
    }

    let qrisUrl: string | null = null;
    if (paymentMode === "midtrans") {
      const { data: chargeTransactionResponse, error: chargeTransactionError } =
        await tryCatch(ctx.paymentServices.chargeTransaction());
      if (chargeTransactionError) {
        // Saga rollback: delete order and release stock in batch
        await ctx.orderQueries.deleteOrderById(orderId);

        await ctx.productQueries.batchIncrementProductStock(stockOperations);

        ctx.logger.error(
          "Payment creation failed, order deleted and stock released",
          {
            orderId,
            productId: item.productId,
            quantity: item.quantity,
            bundleStockDecrements,
            error: chargeTransactionError,
          }
        );

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

    // Set cooldown for buyer
    await ctx.orderOperations.setBuyerCooldown(
      buyer.email,
      Number.parseInt(cooldownMinutes, 10) * 60
    );

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

  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: TODO refactor to reduce complexity
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

    const refundRequest =
      await ctx.refundQueries.getRefundRequestByOrderId(orderId);

    if (!refundRequest || refundRequest.status !== "requested") {
      throw new AppError("BAD_REQUEST", "Refund request not found", {
        details: {
          orderId,
          refundStatus: refundRequest?.status,
        },
      });
    }

    const processedAt = new Date().toISOString();

    if (action === "approve") {
      // Release stock for refunded ticket orders
      if (order.type === "ticket") {
        const orderItems =
          await ctx.orderQueries.getOrderItemsByOrderId(orderId);

        if (orderItems.length > 0) {
          // Collect all product IDs (main products + bundle item products)
          const allProductIds = new Set<string>();
          for (const item of orderItems) {
            allProductIds.add(item.productId);
          }

          // Fetch all products in batch
          const products = await ctx.productQueries.getProductsByIds(
            Array.from(allProductIds),
            { status: "all" }
          );
          const productMap = new Map(products.map((p) => [p.id, p]));

          // Collect stock release operations
          const stockReleases: { productId: string; quantity: number }[] = [];

          for (const item of orderItems) {
            // Release main product stock
            stockReleases.push({
              productId: item.productId,
              quantity: item.quantity,
            });

            // Release bundle item stocks (only for tickets)
            if (item.snapshotBundleProducts) {
              const product = productMap.get(item.productId);
              if (product?.bundleItems) {
                for (const bundleItem of product.bundleItems) {
                  if (bundleItem.type === "ticket") {
                    stockReleases.push({
                      productId: bundleItem.productId,
                      quantity: item.quantity,
                    });
                  }
                }
              }
            }
          }

          // Execute all stock increments in a single batch
          await ctx.productQueries.batchIncrementProductStock(stockReleases);
        }
      }

      await ctx.refundQueries.updateRefundRequest(refundRequest.id, {
        status: "approved",
        processedBy: processorId,
        processedAt,
        rejectionReason: null,
      });

      await ctx.orderQueries.updateOrder(orderId, {
        status: "refunded",
      });

      // TODO: Queue refund confirmation email

      return;
    }

    if (!reason) {
      throw new AppError("BAD_REQUEST", "Rejection reason is required");
    }

    await ctx.refundQueries.updateRefundRequest(refundRequest.id, {
      status: "rejected",
      processedBy: processorId,
      processedAt,
      rejectionReason: reason,
    });

    // See ADR-004
    await ctx.orderQueries.updateOrder(orderId, {
      status: "paid",
    });
    // TODO: Queue refund confirmation email

    return;
  },

  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: TODO refactor to reduce complexity
  expirePendingPaymentOrders: async () => {
    // First, get all orders that will be expired (before they are updated)
    const ordersToExpire = await ctx.orderQueries.getOrders({
      page: 1,
      limit: 1000, // Should be sufficient for cron runs every minute
      status: "pending_payment",
      sortBy: "createdAt",
      sortOrder: "asc",
    });

    // Filter orders that have actually expired
    const now = new Date();
    const expiredOrdersData = ordersToExpire.orders.filter(
      (order) => new Date(order.expiresAt) < now
    );

    // Get order items for each expired order (for stock release)
    const expiredOrderIds = expiredOrdersData.map((order) => order.id);
    const orderItems =
      await ctx.orderQueries.getOrderItemsByOrderIds(expiredOrderIds);

    // Group order items by order ID
    const orderItemsMap = new Map<string, typeof orderItems>();
    for (const item of orderItems) {
      if (!orderItemsMap.has(item.orderId)) {
        orderItemsMap.set(item.orderId, []);
      }
      orderItemsMap.get(item.orderId)?.push(item);
    }

    // Now expire the orders in the database
    await ctx.orderQueries.expirePendingPaymentOrders();

    // Collect all ticket order items for batch stock release
    const ticketOrderItems: typeof orderItems = [];
    for (const expiredOrderData of expiredOrdersData) {
      if (expiredOrderData.type === "ticket") {
        const items = orderItemsMap.get(expiredOrderData.id) ?? [];
        ticketOrderItems.push(...items);
      }
    }

    // Release stock for all expired ticket orders in batch
    if (ticketOrderItems.length > 0) {
      // Collect all product IDs (main products + bundle item products)
      const allProductIds = new Set<string>();
      for (const item of ticketOrderItems) {
        allProductIds.add(item.productId);
      }

      // Fetch all products in batch
      const products = await ctx.productQueries.getProductsByIds(
        Array.from(allProductIds),
        { status: "all" }
      );
      const productMap = new Map(products.map((p) => [p.id, p]));

      // Collect stock release operations
      const stockReleases: { productId: string; quantity: number }[] = [];

      for (const item of ticketOrderItems) {
        // Release main product stock
        stockReleases.push({
          productId: item.productId,
          quantity: item.quantity,
        });

        // Release bundle item stocks (only for tickets)
        if (item.snapshotBundleProducts) {
          const product = productMap.get(item.productId);
          if (product?.bundleItems) {
            for (const bundleItem of product.bundleItems) {
              if (bundleItem.type === "ticket") {
                stockReleases.push({
                  productId: bundleItem.productId,
                  quantity: item.quantity,
                });
              }
            }
          }
        }
      }

      // Execute all stock increments in a single batch
      await ctx.productQueries.batchIncrementProductStock(stockReleases);
    }

    // TODO: Send email

    return;
  },

  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: TODO refactor to reduce complexity
  expirePendingVerificationOrders: async () => {
    // First, get all orders that will be expired (before they are updated)
    const ordersToExpire = await ctx.orderQueries.getOrders({
      page: 1,
      limit: 1000, // Should be sufficient for cron runs
      status: "pending_verification",
      sortBy: "createdAt",
      sortOrder: "asc",
    });

    // Filter orders that have actually expired (24 hours after creation)
    const now = new Date();
    const expiredOrdersData = ordersToExpire.orders.filter((order) => {
      const createdAt = new Date(order.createdAt);
      const expiryTime = new Date(createdAt.getTime() + 24 * 60 * 60 * 1000);
      return expiryTime < now;
    });

    // Get order items for each expired order (for stock release)
    const expiredOrderIds = expiredOrdersData.map((order) => order.id);
    const orderItems =
      await ctx.orderQueries.getOrderItemsByOrderIds(expiredOrderIds);

    // Group order items by order ID
    const orderItemsMap = new Map<string, typeof orderItems>();
    for (const item of orderItems) {
      if (!orderItemsMap.has(item.orderId)) {
        orderItemsMap.set(item.orderId, []);
      }
      orderItemsMap.get(item.orderId)?.push(item);
    }

    // Now expire the orders in the database
    await ctx.orderQueries.expirePendingVerificationOrders();

    // Collect all ticket order items for batch stock release
    const ticketOrderItems: typeof orderItems = [];
    for (const expiredOrderData of expiredOrdersData) {
      if (expiredOrderData.type === "ticket") {
        const items = orderItemsMap.get(expiredOrderData.id) ?? [];
        ticketOrderItems.push(...items);
      }
    }

    // Release stock for all expired ticket orders in batch
    if (ticketOrderItems.length > 0) {
      // Collect all product IDs (main products + bundle item products)
      const allProductIds = new Set<string>();
      for (const item of ticketOrderItems) {
        allProductIds.add(item.productId);
      }

      // Fetch all products in batch
      const products = await ctx.productQueries.getProductsByIds(
        Array.from(allProductIds),
        { status: "all" }
      );
      const productMap = new Map(products.map((p) => [p.id, p]));

      // Collect stock release operations
      const stockReleases: { productId: string; quantity: number }[] = [];

      for (const item of ticketOrderItems) {
        // Release main product stock
        stockReleases.push({
          productId: item.productId,
          quantity: item.quantity,
        });

        // Release bundle item stocks (only for tickets)
        if (item.snapshotBundleProducts) {
          const product = productMap.get(item.productId);
          if (product?.bundleItems) {
            for (const bundleItem of product.bundleItems) {
              if (bundleItem.type === "ticket") {
                stockReleases.push({
                  productId: bundleItem.productId,
                  quantity: item.quantity,
                });
              }
            }
          }
        }
      }

      // Execute all stock increments in a single batch
      await ctx.productQueries.batchIncrementProductStock(stockReleases);
    }

    // TODO: Send email

    return;
  },
});
