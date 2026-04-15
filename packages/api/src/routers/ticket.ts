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
    {
      id: "prod_ticket_main_event",
      type: "ticket_regular",
      name: "Main Event Ticket",
      price: 150_000,
      stock: 125,
      isActive: true,
      description: "Access for TEDxUB 2026 Main Event day.",
      imageUrl: "https://example.com/tickets/main-event.jpg",
    },
    {
      id: "prod_ticket_propa_day1",
      type: "ticket_regular",
      name: "Propaganda 3 Day 1",
      price: 95_000,
      stock: 40,
      isActive: true,
      description: "Access for Propaganda 3 - Day 1 only.",
      imageUrl: "https://example.com/tickets/propa-day1.jpg",
    },
    {
      id: "prod_ticket_bundle_main_plus_merch_pick",
      type: "ticket_bundle",
      name: "Main Event + Merch Pick",
      price: 210_000,
      stock: 18,
      isActive: true,
      description: "Main Event ticket plus one selectable merch item.",
      imageUrl: "https://example.com/tickets/main-plus-merch.jpg",
      bundleItems: [
        {
          type: "ticket",
          productId: "prod_ticket_main_event",
          productName: "Main Event Ticket",
        },
        {
          type: "merchandise",
          category: "hat",
          products: [
            {
              id: "prod_m_topi_1",
              name: "Topi TEDxUB",
              imageUrl: "https://example.com/merch/topi.jpg",
              variants: [
                { id: "var_hat_black", type: "color", label: "Black" },
                { id: "var_hat_white", type: "color", label: "White" },
              ],
            },
          ],
        },
        {
          type: "selectable_item",
          items: [
            {
              type: "ticket",
              productId: "prod_ticket_propa_day1",
              productName: "Upgrade to Propaganda 3 Day 1",
            },
            {
              type: "merchandise",
              category: "stickers",
              products: [
                {
                  id: "prod_m_sticker_pack",
                  name: "Sticker Pack",
                  imageUrl: "https://example.com/merch/sticker-pack.jpg",
                },
              ],
            },
            {
              type: "merchandise",
              category: "socks",
              products: [
                {
                  id: "prod_m_socks",
                  name: "TEDxUB Socks",
                  imageUrl: "https://example.com/merch/socks.jpg",
                  variants: [
                    { id: "var_sock_free", type: "size", label: "Free" },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "prod_ticket_bundle_vip_waiting",
      type: "ticket_bundle",
      name: "VIP Bundle (Coming Soon)",
      price: 320_000,
      stock: 10,
      isActive: false,
      description: "Coming soon ticket bundle for VIP access.",
      imageUrl: "https://example.com/tickets/vip-bundle.jpg",
      bundleItems: [
        {
          type: "ticket",
          productId: "prod_ticket_main_event",
          productName: "Main Event Ticket",
        },
      ],
    },
    {
      id: "prod_ticket_partner_passthrough",
      type: "ticket_regular",
      name: "Partner Allocation Pass",
      price: 0,
      stock: null,
      isActive: true,
      description:
        "Partner-issued access pass with unlimited stock for dummy mode.",
      imageUrl: null,
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
    buyerPhone: input.buyerPhone.trim(),
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
