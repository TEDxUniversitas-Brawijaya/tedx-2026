import type {
  OrderQueries,
  ProductQueries,
  RefundQueries,
} from "@tedx-2026/db";
import type { Order } from "@tedx-2026/types";
import { createNanoIdWithPrefix } from "@tedx-2026/utils";
import { AppError } from "../errors";
import type { BaseContext } from "../types";
import type { ConfigServices } from "./config";
import type { FileServices } from "./file";

type RefundOrderData = NonNullable<
  Awaited<ReturnType<OrderQueries["getOrderWithItemsByRefundToken"]>>
>;

export type RefundServices = {
  // TODO: Refactor to only validate refund token and order existence, not return full order info
  getOrderInfo: (refundToken: string) => Promise<{
    orderId: string;
    buyerName: string;
    buyerEmail: string;
    paymentMethod: "midtrans" | "manual";
    items: {
      name: string;
      quantity: number;
      unitPrice: number;
      snapshotVariants?: { label: string; type: string }[];
    }[];
    totalPrice: number;
    refundDeadline: Date;
  }>;
  submitRequest: (input: {
    refundToken: string;
    reason: string;
    // TODO: Payment method shouldnt be provided by client, should be determined from order data
    paymentMethod: "midtrans" | "manual";
    bankAccountNumber: string;
    bankName: string;
    bankAccountHolder: string;
    // TODO: We dont need to require payment proof since we already have proof of payment from the order
    paymentProof?: File | null;
  }) => Promise<{
    // TODO: We dont need to return these since the client doesnt need them
    refundId: string;
    status: "requested";
    message: string;
  }>;
  getRefundByOrderId: (
    orderId: Order["id"]
    // TODO: We should return domain Refund type instead of raw DB refund request data, and we should also include related order and user info in the response
  ) => Promise<Awaited<ReturnType<RefundQueries["getRefundByOrderId"]>>>;
};

type CreateRefundServicesCtx = {
  configServices: ConfigServices;
  fileServices: FileServices;

  orderQueries: OrderQueries;
  refundQueries: RefundQueries;
  productQueries: ProductQueries;
} & BaseContext;

type EventDateConfigKey =
  | "event_date_propa3_day1"
  | "event_date_propa3_day2"
  | "event_date_main";

const EVENT_DATE_CONFIG_KEYS: EventDateConfigKey[] = [
  "event_date_propa3_day1",
  "event_date_propa3_day2",
  "event_date_main",
];

const JAKARTA_UTC_OFFSET_HOURS = 7;

const getEventKeyFromText = (value: string): EventDateConfigKey | null => {
  const normalized = value.toLowerCase();

  if (
    normalized.includes("day 1") ||
    normalized.includes("day1") ||
    normalized.includes("p3d1")
  ) {
    return "event_date_propa3_day1";
  }

  if (
    normalized.includes("day 2") ||
    normalized.includes("day2") ||
    normalized.includes("p3d2")
  ) {
    return "event_date_propa3_day2";
  }

  if (normalized.includes("main")) {
    return "event_date_main";
  }

  return null;
};

const parseConfigDate = (raw: string): Date => {
  const value = raw.length === 10 ? `${raw}T00:00:00Z` : raw;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    throw new AppError("INTERNAL_SERVER_ERROR", "Invalid event date config", {
      details: {
        value: raw,
      },
    });
  }

  return parsed;
};

const getRequiredConfig = async (
  ctx: CreateRefundServicesCtx,
  key: string
): Promise<string> => {
  const value = await ctx.configServices.getConfig(key);
  if (!value) {
    throw new AppError(
      "INTERNAL_SERVER_ERROR",
      "Missing required refund configuration",
      {
        details: { key },
      }
    );
  }

  return value;
};

const getRefundDeadlineDaysBefore = async (
  ctx: CreateRefundServicesCtx
): Promise<number> => {
  const refundDeadlineDaysBeforeRaw = await getRequiredConfig(
    ctx,
    "refund_deadline_days_before"
  );
  const refundDeadlineDaysBefore = Number.parseInt(
    refundDeadlineDaysBeforeRaw,
    10
  );

  if (Number.isNaN(refundDeadlineDaysBefore) || refundDeadlineDaysBefore < 0) {
    throw new AppError(
      "INTERNAL_SERVER_ERROR",
      "Invalid refund deadline configuration"
    );
  }

  return refundDeadlineDaysBefore;
};

const getEventDateByKey = async (
  ctx: CreateRefundServicesCtx
): Promise<Record<EventDateConfigKey, Date>> => {
  const configValues = await Promise.all(
    EVENT_DATE_CONFIG_KEYS.map(async (configKey) => {
      const value = await getRequiredConfig(ctx, configKey);
      return {
        configKey,
        date: parseConfigDate(value),
      };
    })
  );

  return Object.fromEntries(
    configValues.map((item) => [item.configKey, item.date])
  ) as Record<EventDateConfigKey, Date>;
};

const getEventKeysFromOrderItems = (orderData: RefundOrderData) => {
  const candidateEventKeys = new Set<EventDateConfigKey>();
  const referencedProductIds = new Set<string>();

  for (const item of orderData.items) {
    referencedProductIds.add(item.productId);

    const itemEventKey = getEventKeyFromText(item.snapshotName);
    if (itemEventKey) {
      candidateEventKeys.add(itemEventKey);
    }

    for (const bundleProduct of item.snapshotBundleProducts ?? []) {
      const bundleEventKey = getEventKeyFromText(bundleProduct.name);
      if (bundleEventKey) {
        candidateEventKeys.add(bundleEventKey);
      }
    }
  }

  return {
    candidateEventKeys,
    referencedProductIds,
  };
};

const getBundledTicketProductIds = (
  products: Awaited<ReturnType<ProductQueries["getProductsByIds"]>>
): string[] => {
  const bundledTicketProductIds = new Set<string>();

  for (const product of products) {
    if (!product.bundleItems) {
      continue;
    }

    for (const bundleItem of product.bundleItems) {
      if (bundleItem.type === "ticket") {
        bundledTicketProductIds.add(bundleItem.productId);
      }
    }
  }

  return Array.from(bundledTicketProductIds);
};

const getEventKeysFromBundledTickets = async (
  ctx: CreateRefundServicesCtx,
  productIds: string[]
): Promise<Set<EventDateConfigKey>> => {
  const bundledTicketEventKeys = new Set<EventDateConfigKey>();

  if (productIds.length === 0) {
    return bundledTicketEventKeys;
  }

  const products = await ctx.productQueries.getProductsByIds(productIds);

  const bundledTicketProductIds = getBundledTicketProductIds(products);

  if (bundledTicketProductIds.length === 0) {
    return bundledTicketEventKeys;
  }

  const bundledTicketProducts = await ctx.productQueries.getProductsByIds(
    bundledTicketProductIds
  );

  for (const ticketProduct of bundledTicketProducts) {
    const eventKey = getEventKeyFromText(ticketProduct.name);
    if (eventKey) {
      bundledTicketEventKeys.add(eventKey);
    }
  }

  return bundledTicketEventKeys;
};

const getTicketCandidateEventDates = async (
  ctx: CreateRefundServicesCtx,
  orderData: RefundOrderData,
  eventDateByKey: Record<EventDateConfigKey, Date>
): Promise<Date[]> => {
  const { candidateEventKeys, referencedProductIds } =
    getEventKeysFromOrderItems(orderData);

  const bundledTicketEventKeys = await getEventKeysFromBundledTickets(
    ctx,
    Array.from(referencedProductIds)
  );

  for (const eventKey of bundledTicketEventKeys) {
    candidateEventKeys.add(eventKey);
  }

  if (candidateEventKeys.size === 0) {
    return Object.values(eventDateByKey);
  }

  return Array.from(candidateEventKeys).map(
    (eventKey) => eventDateByKey[eventKey]
  );
};

const getRefundDeadline = async (
  ctx: CreateRefundServicesCtx,
  orderData: RefundOrderData
): Promise<Date> => {
  const refundDeadlineDaysBefore = await getRefundDeadlineDaysBefore(ctx);
  const eventDateByKey = await getEventDateByKey(ctx);

  const candidateEventDates =
    orderData.order.type === "ticket"
      ? await getTicketCandidateEventDates(ctx, orderData, eventDateByKey)
      : [eventDateByKey.event_date_main];

  const earliestEventDate = new Date(
    Math.min(...candidateEventDates.map((date) => date.getTime()))
  );

  const refundDeadline = new Date(earliestEventDate);
  refundDeadline.setUTCDate(
    refundDeadline.getUTCDate() - refundDeadlineDaysBefore
  );
  refundDeadline.setUTCHours(23 - JAKARTA_UTC_OFFSET_HOURS, 59, 59, 999);

  return refundDeadline;
};

const assertRefundableOrder = async (
  ctx: CreateRefundServicesCtx,
  refundToken: string
): Promise<RefundOrderData & { refundDeadline: Date }> => {
  const orderData =
    await ctx.orderQueries.getOrderWithItemsByRefundToken(refundToken);

  if (!orderData) {
    throw new AppError("BAD_REQUEST", "INVALID_REFUND_TOKEN", {
      details: { refundToken },
    });
  }

  if (orderData.order.status === "refund_requested") {
    throw new AppError("BAD_REQUEST", "REFUND_ALREADY_REQUESTED", {
      details: { orderId: orderData.order.id },
    });
  }

  if (orderData.order.type === "merch") {
    throw new AppError("BAD_REQUEST", "ORDER_NOT_REFUNDABLE", {
      details: {
        orderId: orderData.order.id,
        type: orderData.order.type,
      },
    });
  }

  if (orderData.order.status !== "paid") {
    throw new AppError("BAD_REQUEST", "ORDER_NOT_REFUNDABLE", {
      details: {
        orderId: orderData.order.id,
        status: orderData.order.status,
      },
    });
  }

  const refundRequest = await ctx.refundQueries.getRefundByOrderId(
    orderData.order.id
  );

  if (refundRequest?.status === "requested") {
    throw new AppError("BAD_REQUEST", "REFUND_ALREADY_REQUESTED", {
      details: {
        orderId: orderData.order.id,
        refundId: refundRequest.id,
      },
    });
  }

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

  return {
    ...orderData,
    refundDeadline,
  };
};

export const createRefundServices = (
  ctx: CreateRefundServicesCtx
): RefundServices => ({
  getOrderInfo: async (refundToken) => {
    const orderData = await assertRefundableOrder(ctx, refundToken);

    return {
      orderId: orderData.order.id,
      buyerName: orderData.order.buyerName,
      buyerEmail: orderData.order.buyerEmail,
      paymentMethod: orderData.order.paymentMethod,
      items: orderData.items.map((item) => ({
        name: item.snapshotName,
        quantity: item.quantity,
        unitPrice: item.snapshotPrice,
        snapshotVariants: item.snapshotVariants ?? undefined,
      })),
      totalPrice: orderData.order.totalPrice,
      refundDeadline: orderData.refundDeadline,
    };
  },
  getRefundByOrderId: async (orderId) => {
    const refund = await ctx.refundQueries.getRefundByOrderId(orderId);
    return refund;
  },

  submitRequest: async (input) => {
    const orderData = await assertRefundableOrder(ctx, input.refundToken);

    if (input.paymentMethod !== orderData.order.paymentMethod) {
      throw new AppError("BAD_REQUEST", "PAYMENT_METHOD_MISMATCH", {
        details: {
          orderId: orderData.order.id,
          expected: orderData.order.paymentMethod,
          received: input.paymentMethod,
        },
      });
    }

    let paymentProofUrl: string | null = null;

    if (orderData.order.paymentMethod === "manual") {
      if (!input.paymentProof) {
        throw new AppError("BAD_REQUEST", "PAYMENT_PROOF_REQUIRED", {
          details: {
            orderId: orderData.order.id,
          },
        });
      }

      const uploadedProof = await ctx.fileServices.uploadFile(
        `${orderData.order.id}-${Date.now()}-${input.paymentProof.name}`,
        await input.paymentProof.arrayBuffer(),
        "refund-proofs",
        {
          maxSizeMB: 5,
        }
      );
      paymentProofUrl = uploadedProof.url;
    }

    const refundId = createNanoIdWithPrefix("ref");
    const previousOrderStatus = orderData.order.status;

    await ctx.orderQueries.updateOrder(orderData.order.id, {
      status: "refund_requested",
    });

    try {
      await ctx.refundQueries.createRefundRequest({
        id: refundId,
        orderId: orderData.order.id,
        status: "requested",
        reason: input.reason,
        paymentMethod: input.paymentMethod,
        paymentProofUrl,
        bankAccountNumber: input.bankAccountNumber,
        bankName: input.bankName,
        bankAccountHolder: input.bankAccountHolder,
      });
    } catch (error: unknown) {
      try {
        await ctx.orderQueries.updateOrder(orderData.order.id, {
          status: previousOrderStatus,
        });
      } catch {
        throw new AppError(
          "INTERNAL_SERVER_ERROR",
          "REFUND_REQUEST_STATE_ROLLBACK_FAILED",
          {
            details: {
              orderId: orderData.order.id,
              refundId,
              previousOrderStatus,
            },
          }
        );
      }

      throw error;
    }
    // TODO: Queue refund confirmation email

    return {
      refundId,
      status: "requested",
      message: "Refund request submitted",
    };
  },
});
