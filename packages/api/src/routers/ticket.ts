import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTicketOrderInputSchema,
  createTicketOrderOutputSchema,
  getTicketOrderStatusInputSchema,
  getTicketOrderStatusOutputSchema,
  listTicketProductsInputSchema,
  listTicketProductsOutputSchema,
} from "../schemas/ticket";
import { createTRPCRouter, publicProcedure } from "../trpc";

const ORDER_EXPIRES_MS = 20 * 60 * 1000;

const usedIdempotencyKeys = new Set<string>();

const generateOrderId = () => {
  const now = new Date();
  const yy = now.getFullYear().toString().slice(-2);
  const mm = `${now.getMonth() + 1}`.padStart(2, "0");
  const dd = `${now.getDate()}`.padStart(2, "0");
  const random = Math.random().toString(36).toUpperCase().slice(2, 7);
  return `TDX-${yy}${mm}${dd}-${random}`;
};

const getDummyTicketProducts = () => {
  return listTicketProductsOutputSchema.parse([
    // -- Ticket Regular --
    {
      id: "prod_tkt_p3d1",
      type: "ticket_regular",
      name: "Propaganda 3 Day 1",
      description: "Propaganda 3 - Day 1",
      price: 135_000,
      stock: 100,
      isActive: true,
      imageUrl: null,
    },
    {
      id: "prod_tkt_p3d2",
      type: "ticket_regular",
      name: "Propaganda 3 Day 2",
      description: "Propaganda 3 - Day 2",
      price: 105_000,
      stock: 100,
      isActive: true,
      imageUrl: null,
    },
    {
      id: "prod_tkt_main",
      type: "ticket_regular",
      name: "Main Event",
      description: "Main Event",
      price: 75_000,
      stock: 80,
      isActive: true,
      imageUrl: null,
    },

    // -- Ticket Bundle --
    {
      id: "prod_tkt_b_1",
      type: "ticket_bundle",
      name: "Bundling I",
      description: "Tiket Propa 3 Day 1, Tiket Propa 3 Day 2",
      price: 235_000,
      stock: 50,
      isActive: true,
      imageUrl: null,
      bundleItems: [
        {
          type: "ticket",
          productId: "prod_tkt_p3d1",
          product: { id: "prod_tkt_p3d1", name: "Propaganda 3 Day 1" },
        },
        {
          type: "ticket",
          productId: "prod_tkt_p3d2",
          product: { id: "prod_tkt_p3d2", name: "Propaganda 3 Day 2" },
        },
      ],
    },
    {
      id: "prod_tkt_b_2",
      type: "ticket_bundle",
      name: "Bundling II",
      description: "Tiket Main Event, Tiket Day 1 Propaganda 3",
      price: 195_000,
      stock: 60,
      isActive: true,
      imageUrl: null,
      bundleItems: [
        {
          type: "ticket",
          productId: "prod_tkt_main",
          product: { id: "prod_tkt_main", name: "Main Event" },
        },
        {
          type: "ticket",
          productId: "prod_tkt_p3d1",
          product: { id: "prod_tkt_p3d1", name: "Propaganda 3 Day 1" },
        },
      ],
    },
    {
      id: "prod_tkt_b_3",
      type: "ticket_bundle",
      name: "Bundling III",
      description: "Tiket Main Event, Tiket Day 2 Propaganda 3",
      price: 165_000,
      stock: 50,
      isActive: true,
      imageUrl: null,
      bundleItems: [
        {
          type: "ticket",
          productId: "prod_tkt_main",
          product: { id: "prod_tkt_main", name: "Main Event" },
        },
        {
          type: "ticket",
          productId: "prod_tkt_p3d2",
          product: { id: "prod_tkt_p3d2", name: "Propaganda 3 Day 2" },
        },
      ],
    },
    {
      id: "prod_tkt_b_4",
      type: "ticket_bundle",
      name: "Bundling IV",
      description: "Tiket Propa 3 Day 1, Tiket Propa 3 Day 2, Tiket Main Event",
      price: 285_000,
      stock: 40,
      isActive: true,
      imageUrl: null,
      bundleItems: [
        {
          type: "ticket",
          productId: "prod_tkt_p3d1",
          product: { id: "prod_tkt_p3d1", name: "Propaganda 3 Day 1" },
        },
        {
          type: "ticket",
          productId: "prod_tkt_p3d2",
          product: { id: "prod_tkt_p3d2", name: "Propaganda 3 Day 2" },
        },
        {
          type: "ticket",
          productId: "prod_tkt_main",
          product: { id: "prod_tkt_main", name: "Main Event" },
        },
      ],
    },
  ]);
};

const getProductByIdOrThrow = (productId: string) => {
  const product = getDummyTicketProducts().find(
    (item) => item.id === productId
  );
  if (!product) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: `Ticket product ${productId} not found.`,
    });
  }

  return product;
};

const getSelectableBundleOptionIds = (
  product: (typeof listTicketProductsOutputSchema)["_output"][number]
) => {
  const selectable = product.bundleItems?.find(
    (item) => item.type === "selectable_item"
  );

  if (!selectable || selectable.type !== "selectable_item") {
    return [];
  }

  return selectable.items.flatMap((item) => {
    if (item.type === "ticket") {
      return [item.productId];
    }

    return item.products.map((productItem) => productItem.id);
  });
};

type CreateTicketOrderInput = (typeof createTicketOrderInputSchema)["_output"];

type NormalizedCreateOrderInput = {
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  buyerInstansi: string;
  captchaToken: string;
  idempotencyKey: string;
  selectedBundleItemId: string | undefined;
};

const normalizeCreateOrderInput = (
  input: CreateTicketOrderInput
): NormalizedCreateOrderInput => {
  return {
    buyerName: input.buyerName.trim(),
    buyerEmail: input.buyerEmail.trim().toLowerCase(),
    buyerPhone: input.phone.trim(),
    buyerInstansi: input.buyerInstansi.trim(),
    captchaToken: input.captchaToken.trim(),
    idempotencyKey: input.idempotencyKey.trim(),
    selectedBundleItemId: input.selectedBundleItemId?.trim(),
  };
};

const assertBuyerInfo = (input: NormalizedCreateOrderInput) => {
  if (
    input.buyerName &&
    input.buyerEmail &&
    input.buyerPhone &&
    input.buyerInstansi
  ) {
    return;
  }

  throw new TRPCError({
    code: "BAD_REQUEST",
    message: "Buyer information is incomplete.",
  });
};

const assertCaptchaToken = (captchaToken: string) => {
  if (captchaToken) {
    return;
  }

  throw new TRPCError({
    code: "BAD_REQUEST",
    message: "CAPTCHA token is required.",
  });
};

const assertIdempotencyKey = (idempotencyKey: string) => {
  if (!idempotencyKey) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Idempotency key is required.",
    });
  }

  // Guard duplicate submissions by idempotency key in dummy in-memory mode.
  if (usedIdempotencyKeys.has(idempotencyKey)) {
    throw new TRPCError({
      code: "CONFLICT",
      message: "Duplicate idempotency key.",
    });
  }
};

const assertProductIsPurchasable = (
  product: (typeof listTicketProductsOutputSchema)["_output"][number],
  quantity: number
) => {
  if (!product.isActive) {
    throw new TRPCError({
      code: "CONFLICT",
      message: "Product is not active.",
    });
  }

  if (product.stock !== null && quantity > product.stock) {
    throw new TRPCError({
      code: "CONFLICT",
      message: `Insufficient stock. Requested ${quantity}, available ${product.stock}.`,
    });
  }
};

const assertBundleSelection = (
  product: (typeof listTicketProductsOutputSchema)["_output"][number],
  selectedBundleItemId: string | undefined
) => {
  const selectableOptionIds = getSelectableBundleOptionIds(product);

  // Selectable bundles require one of predefined option IDs.
  if (selectableOptionIds.length > 0 && !selectedBundleItemId) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "selectedBundleItemId is required for this bundle product.",
    });
  }

  if (selectableOptionIds.length === 0 && selectedBundleItemId) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "selectedBundleItemId is not allowed for this product.",
    });
  }

  if (
    selectedBundleItemId &&
    !selectableOptionIds.includes(selectedBundleItemId)
  ) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `selectedBundleItemId ${selectedBundleItemId} is invalid for this product.`,
    });
  }
};

const persistDummyOrderGuards = (idempotencyKey: string) => {
  usedIdempotencyKeys.add(idempotencyKey);
};

const listProducts = publicProcedure
  .input(listTicketProductsInputSchema)
  .output(listTicketProductsOutputSchema)
  .query(() => {
    try {
      return getDummyTicketProducts();
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message:
          error instanceof Error
            ? `Failed to build ticket product fixtures: ${error.message}`
            : "Failed to build ticket product fixtures.",
      });
    }
  });

const createOrder = publicProcedure
  .input(z.instanceof(FormData))
  .output(createTicketOrderOutputSchema)
  .mutation(({ input: formData }) => {
    const input = createTicketOrderInputSchema.parse({
      buyerName: formData.get("buyerName"),
      buyerEmail: formData.get("buyerEmail"),
      phone: formData.get("phone"),
      buyerInstansi: formData.get("buyerInstansi"),
      productId: formData.get("productId"),
      quantity: Number(formData.get("quantity")),
      selectedBundleItemId: formData.get("selectedBundleItemId") || undefined,
      captchaToken: formData.get("captchaToken"),
      idempotencyKey: formData.get("idempotencyKey"),
      paymentProof: formData.get("paymentProof") ?? undefined,
    });

    const normalizedInput = normalizeCreateOrderInput(input);

    assertBuyerInfo(normalizedInput);
    assertCaptchaToken(normalizedInput.captchaToken);
    assertIdempotencyKey(normalizedInput.idempotencyKey);

    const product = getProductByIdOrThrow(input.productId);
    assertProductIsPurchasable(product, input.quantity);
    assertBundleSelection(product, normalizedInput.selectedBundleItemId);

    // Dynamic payment mode
    const paymentMode = input.paymentProof ? "manual" : "midtrans";
    if (paymentMode === "manual" && !input.paymentProof) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "paymentProof is required when payment mode is manual.",
      });
    }

    persistDummyOrderGuards(normalizedInput.idempotencyKey);

    const orderId = generateOrderId();
    const totalPrice = product.price * input.quantity;
    const expiresAt = new Date(Date.now() + ORDER_EXPIRES_MS).toISOString();

    const output = {
      orderId,
      status: "paid" as const,
      totalPrice,
      expiresAt,
      payment:
        paymentMode === "manual"
          ? {
              uploadUrl: `https://example.com/uploads/tickets/${orderId.toLowerCase()}?buyer=${encodeURIComponent(normalizedInput.buyerEmail)}`,
            }
          : {
              qrisUrl: "https://example.com/payments/qris-ticket.png",
              midtransOrderId: `MID-${orderId}-${normalizedInput.buyerName.slice(0, 3).toUpperCase()}`,
            },
    };

    return createTicketOrderOutputSchema.parse(output);
  });

const getOrderStatus = publicProcedure
  .input(getTicketOrderStatusInputSchema)
  .output(getTicketOrderStatusOutputSchema)
  .query(() => {
    // TODO: Implement ticket.getOrderStatus
    throw new TRPCError({
      code: "NOT_IMPLEMENTED",
      message: "ticket.getOrderStatus is not implemented yet",
    });
  });

export const ticketRouter = createTRPCRouter({
  listProducts,
  createOrder,
  getOrderStatus,
});
