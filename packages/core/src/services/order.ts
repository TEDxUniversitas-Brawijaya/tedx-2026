import type { ConfigQueries, MerchQueries } from "@tedx-2026/db";
import {
  createOrderNotFoundError,
  createPaymentModeMismatchError,
} from "../errors";

type CreateOrderServiceOptions = {
  merchQueries: MerchQueries;
  configQueries: ConfigQueries;
  signProofUrl?: (key: string) => Promise<string>;
};

type OrderWithItems = NonNullable<
  Awaited<ReturnType<MerchQueries["getOrderWithItemsById"]>>
>;

type ListOrdersResult = Awaited<ReturnType<MerchQueries["listOrders"]>>;

export type OrderService = {
  uploadManualPaymentProof: (input: {
    orderId: string;
    proofObjectKey: string;
  }) => Promise<{ orderId: string; status: "pending_verification" }>;
  handleMidtransStatus: (input: {
    orderId: string;
    transactionStatus: string;
  }) => Promise<void>;
  getAdminOrderById: (orderId: string) => Promise<{
    order: OrderWithItems["order"];
    items: OrderWithItems["items"];
  }>;
  listAdminOrders: (input: {
    page: number;
    limit: number;
    type?: "ticket" | "merch";
    status?:
      | "pending_payment"
      | "pending_verification"
      | "paid"
      | "expired"
      | "refund_requested"
      | "refunded"
      | "rejected";
    search?: string;
    sortBy: "createdAt" | "totalPrice" | "status";
    sortOrder: "asc" | "desc";
  }) => Promise<ListOrdersResult>;
  verifyPayment: (input: {
    orderId: string;
    action: "approve" | "reject";
    reason?: string;
    verifierId: string;
  }) => Promise<"paid" | "rejected">;
  runPendingPaymentExpiry: () => Promise<number>;
  runPendingVerificationExpiry: () => Promise<number>;
};

const isPendingPayment = (status: string) => status === "pending_payment";

export const createOrderService = ({
  merchQueries,
  configQueries,
  signProofUrl,
}: CreateOrderServiceOptions): OrderService => ({
  uploadManualPaymentProof: async ({ orderId, proofObjectKey }) => {
    const paymentMode = await configQueries.getPaymentMode();
    if (paymentMode !== "manual") {
      throw createPaymentModeMismatchError("manual", paymentMode);
    }

    const order = await merchQueries.getOrderById(orderId);
    if (!order) {
      throw createOrderNotFoundError(orderId);
    }

    if (!isPendingPayment(order.status)) {
      throw createPaymentModeMismatchError(
        "manual",
        order.paymentMethod ?? "manual"
      );
    }

    await merchQueries.updateOrder(orderId, {
      proofImageUrl: proofObjectKey,
      status: "pending_verification",
    });

    return {
      orderId,
      status: "pending_verification",
    };
  },

  handleMidtransStatus: async ({ orderId, transactionStatus }) => {
    const paymentMode = await configQueries.getPaymentMode();
    if (paymentMode !== "midtrans") {
      throw createPaymentModeMismatchError("midtrans", paymentMode);
    }

    const order =
      (await merchQueries.getOrderByMidtransOrderId(orderId)) ??
      (await merchQueries.getOrderById(orderId));

    if (!order) {
      throw createOrderNotFoundError(orderId);
    }

    if (!isPendingPayment(order.status)) {
      return;
    }

    if (transactionStatus === "settlement") {
      await merchQueries.updateOrder(order.id, {
        status: "paid",
        paidAt: new Date().toISOString(),
      });
      return;
    }

    if (transactionStatus === "expire") {
      await merchQueries.updateOrder(order.id, {
        status: "expired",
      });
    }
  },

  getAdminOrderById: async (orderId) => {
    const orderWithItems = await merchQueries.getOrderWithItemsById(orderId);
    if (!orderWithItems) {
      throw createOrderNotFoundError(orderId);
    }

    if (
      signProofUrl &&
      orderWithItems.order.proofImageUrl &&
      !orderWithItems.order.proofImageUrl.startsWith("http")
    ) {
      const signedUrl = await signProofUrl(orderWithItems.order.proofImageUrl);
      orderWithItems.order.proofImageUrl = signedUrl;
    }

    return {
      order: orderWithItems.order,
      items: orderWithItems.items,
    };
  },

  listAdminOrders: async (input) => {
    return await merchQueries.listOrders(input);
  },

  verifyPayment: async ({ orderId, action, reason, verifierId }) => {
    const order = await merchQueries.getOrderById(orderId);
    if (!order) {
      throw createOrderNotFoundError(orderId);
    }

    if (order.status !== "pending_verification") {
      throw createPaymentModeMismatchError(
        "manual",
        order.paymentMethod ?? "manual"
      );
    }

    if (action === "approve") {
      await merchQueries.updateOrder(orderId, {
        status: "paid",
        paidAt: new Date().toISOString(),
        verifiedAt: new Date().toISOString(),
        verifiedBy: verifierId,
        rejectionReason: null,
      });
      return "paid";
    }

    await merchQueries.updateOrder(orderId, {
      status: "rejected",
      rejectionReason: reason,
      verifiedAt: new Date().toISOString(),
      verifiedBy: verifierId,
    });

    return "rejected";
  },

  runPendingPaymentExpiry: async () => {
    return await merchQueries.expirePendingPaymentOrders(
      new Date().toISOString()
    );
  },

  runPendingVerificationExpiry: async () => {
    return await merchQueries.expirePendingVerificationOrders(
      new Date().toISOString()
    );
  },
});
