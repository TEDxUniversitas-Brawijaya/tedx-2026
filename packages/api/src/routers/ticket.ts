import { TRPCError } from "@trpc/server";
import {
  createTicketOrderInputSchema,
  createTicketOrderOutputSchema,
  getTicketOrderStatusInputSchema,
  getTicketOrderStatusOutputSchema,
  listTicketProductsInputSchema,
  listTicketProductsOutputSchema,
} from "../schemas/ticket";
import { createTRPCRouter, publicProcedure } from "../trpc";

const COOLDOWN_MS = 10 * 60 * 1000;
const ORDER_EXPIRES_MS = 20 * 60 * 1000;
const DUMMY_PAYMENT_MODE: "midtrans" | "manual" =
  process.env.TICKET_DUMMY_PAYMENT_MODE === "manual" ? "manual" : "midtrans";

const usedIdempotencyKeys = new Set<string>();
const lastOrderAtByEmail = new Map<string, number>();

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
      name: "Bundling 1",
      description: "2 Day Pass Propaganda 3",
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
      name: "Bundling 2",
      description: "Main Event + Merch Keychain",
      price: 60_000,
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
          type: "merchandise",
          category: "keychain",
          products: [
            {
              id: "prod_m_keychain_v1_a",
              name: "Keychain v1 A",
              imageUrl: null,
              variants: null,
            },
            {
              id: "prod_m_keychain_v1_b",
              name: "Keychain v1 B",
              imageUrl: null,
              variants: null,
            },
            {
              id: "prod_m_keychain_v1_c",
              name: "Keychain v1 C",
              imageUrl: null,
              variants: null,
            },
            {
              id: "prod_m_keychain_v2_a",
              name: "Keychain v2 A",
              imageUrl: null,
              variants: null,
            },
            {
              id: "prod_m_keychain_v2_b",
              name: "Keychain v2 B",
              imageUrl: null,
              variants: null,
            },
          ],
        },
      ],
    },
    {
      id: "prod_tkt_b_3",
      type: "ticket_bundle",
      name: "Bundling 3",
      description: "Main Event + Merch Socks",
      price: 100_000,
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
          type: "merchandise",
          category: "socks",
          products: [
            {
              id: "prod_m_socks_a",
              name: "Socks A",
              imageUrl: null,
              variants: null,
            },
            {
              id: "prod_m_socks_b",
              name: "Socks B",
              imageUrl: null,
              variants: null,
            },
            {
              id: "prod_m_socks_c",
              name: "Socks C",
              imageUrl: null,
              variants: null,
            },
          ],
        },
      ],
    },
    {
      id: "prod_tkt_b_4",
      type: "ticket_bundle",
      name: "Bundling 4",
      description: "Main Event + Merch Stickers",
      price: 95_000,
      stock: 40,
      isActive: true,
      imageUrl: null,
      bundleItems: [
        {
          type: "ticket",
          productId: "prod_tkt_main",
          product: { id: "prod_tkt_main", name: "Main Event" },
        },
        {
          type: "merchandise",
          category: "stickers",
          products: [
            {
              id: "prod_m_sticker_a",
              name: "Stickers A",
              imageUrl: null,
              variants: null,
            },
            {
              id: "prod_m_sticker_b",
              name: "Stickers B",
              imageUrl: null,
              variants: null,
            },
          ],
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

const assertCooldown = (buyerEmail: string, now: number) => {
  const latestOrderAt = lastOrderAtByEmail.get(buyerEmail);

  // Simulate KV cooldown checks so rapid retries by same email are blocked.
  if (latestOrderAt !== undefined && now - latestOrderAt < COOLDOWN_MS) {
    const retryAfterSeconds = Math.ceil(
      (COOLDOWN_MS - (now - latestOrderAt)) / 1000
    );

    throw new TRPCError({
      code: "TOO_MANY_REQUESTS",
      message: `Cooldown active. Retry after ${retryAfterSeconds} seconds.`,
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

const assertPaymentProof = (input: CreateTicketOrderInput) => {
  if (DUMMY_PAYMENT_MODE === "manual" && !input.paymentProof) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "paymentProof is required when payment mode is manual.",
    });
  }

  if (DUMMY_PAYMENT_MODE === "midtrans" && input.paymentProof) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "paymentProof is only allowed when payment mode is manual.",
    });
  }
};

const persistDummyOrderGuards = (
  idempotencyKey: string,
  buyerEmail: string
) => {
  usedIdempotencyKeys.add(idempotencyKey);
  lastOrderAtByEmail.set(buyerEmail, Date.now());
};

const buildCreateOrderOutput = (params: {
  buyerEmail: string;
  buyerName: string;
  quantity: number;
  unitPrice: number;
}) => {
  const orderId = generateOrderId();
  const totalPrice = params.unitPrice * params.quantity;
  const expiresAt = new Date(Date.now() + ORDER_EXPIRES_MS).toISOString();

  // Shape payment output by active dummy mode while preserving schema union contract.
  const output =
    DUMMY_PAYMENT_MODE === "manual"
      ? {
          orderId,
          status: "pending_verification" as const,
          totalPrice,
          expiresAt,
          payment: {
            uploadUrl: `https://example.com/uploads/tickets/${orderId.toLowerCase()}?buyer=${encodeURIComponent(params.buyerEmail)}`,
          },
        }
      : {
          orderId,
          status: "pending_payment" as const,
          totalPrice,
          expiresAt,
          payment: {
            qrisUrl: "https://example.com/payments/qris-ticket.png",
            midtransOrderId: `MID-${orderId}-${params.buyerName.slice(0, 3).toUpperCase()}`,
          },
        };

  return createTicketOrderOutputSchema.parse(output);
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
  .input(createTicketOrderInputSchema)
  .output(createTicketOrderOutputSchema)
  .mutation(({ input }) => {
    const normalizedInput = normalizeCreateOrderInput(input);
    const now = Date.now();

    assertBuyerInfo(normalizedInput);
    assertCaptchaToken(normalizedInput.captchaToken);
    assertIdempotencyKey(normalizedInput.idempotencyKey);
    assertCooldown(normalizedInput.buyerEmail, now);

    const product = getProductByIdOrThrow(input.productId);
    assertProductIsPurchasable(product, input.quantity);
    assertBundleSelection(product, normalizedInput.selectedBundleItemId);
    assertPaymentProof(input);

    persistDummyOrderGuards(
      normalizedInput.idempotencyKey,
      normalizedInput.buyerEmail
    );

    return buildCreateOrderOutput({
      buyerEmail: normalizedInput.buyerEmail,
      buyerName: normalizedInput.buyerName,
      quantity: input.quantity,
      unitPrice: product.price,
    });
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
