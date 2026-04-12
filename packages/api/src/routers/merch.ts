import {
  createMerchOrderInputSchema,
  createMerchOrderOutputSchema,
  getMerchOrderStatusInputSchema,
  getMerchOrderStatusOutputSchema,
  listMerchProductsInputSchema,
  listMerchProductsOutputSchema,
} from "../schemas/merch";
import { createTRPCRouter, publicProcedure } from "../trpc";

const DUMMY_MERCH_PAYMENT_CONFIG = {
  useManualQris: true,
};

const getDummyMerchPaymentMethod = (): "manual" | "midtrans" => {
  if (DUMMY_MERCH_PAYMENT_CONFIG.useManualQris) {
    return "manual";
  }

  return "midtrans";
};

const generateOrderId = () => {
  const now = new Date();
  const yy = now.getFullYear().toString().slice(-2);
  const mm = `${now.getMonth() + 1}`.padStart(2, "0");
  const dd = `${now.getDate()}`.padStart(2, "0");
  const random = Math.random().toString(36).toUpperCase().slice(2, 7);
  return `TDX-${yy}${mm}${dd}-${random}`;
};

const listProducts = publicProcedure
  .input(listMerchProductsInputSchema)
  .output(listMerchProductsOutputSchema)
  .query(() => {
    // TODO: Implement merch.listProducts

    const now = new Date();
    return [
      // -- Merch Regular --
      {
        id: "prod_m_tshirt_1",
        type: "merch_regular",
        name: "T-shirt 1",
        description: "TEDxUB 2026 T-shirt 1",
        price: 120_000,
        isActive: true,
        category: "t-shirt",
        variants: [
          { id: "var_ts_s", type: "size", label: "S" },
          { id: "var_ts_m", type: "size", label: "M" },
          { id: "var_ts_l", type: "size", label: "L" },
          { id: "var_ts_xl", type: "size", label: "XL" },
        ],
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "prod_m_tshirt_2",
        type: "merch_regular",
        name: "T-shirt 2",
        description: "TEDxUB 2026 T-shirt 2",
        price: 120_000,
        isActive: true,
        category: "t-shirt",
        variants: [
          { id: "var_ts_s", type: "size", label: "S" },
          { id: "var_ts_m", type: "size", label: "M" },
          { id: "var_ts_l", type: "size", label: "L" },
          { id: "var_ts_xl", type: "size", label: "XL" },
        ],
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "prod_m_tshirt_3",
        type: "merch_regular",
        name: "T-shirt 3",
        description: "TEDxUB 2026 T-shirt 3",
        price: 120_000,
        isActive: true,
        category: "t-shirt",
        variants: [
          { id: "var_ts_s", type: "size", label: "S" },
          { id: "var_ts_m", type: "size", label: "M" },
          { id: "var_ts_l", type: "size", label: "L" },
          { id: "var_ts_xl", type: "size", label: "XL" },
        ],
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "prod_m_workshirt_black_1",
        type: "merch_regular",
        name: "Work Shirt Black 1",
        description: "TEDxUB 2026 Work Shirt Black 1",
        price: 150_000,
        isActive: true,
        category: "workshirt",
        variants: [
          { id: "var_ws_s", type: "size", label: "S" },
          { id: "var_ws_m", type: "size", label: "M" },
          { id: "var_ws_l", type: "size", label: "L" },
          { id: "var_ws_xl", type: "size", label: "XL" },
        ],
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "prod_m_workshirt_black_2",
        type: "merch_regular",
        name: "Work Shirt Black 2",
        description: "TEDxUB 2026 Work Shirt Black 2",
        price: 150_000,
        isActive: true,
        category: "workshirt",
        variants: [
          { id: "var_ws_s", type: "size", label: "S" },
          { id: "var_ws_m", type: "size", label: "M" },
          { id: "var_ws_l", type: "size", label: "L" },
          { id: "var_ws_xl", type: "size", label: "XL" },
        ],
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "prod_m_workshirt_maroon_1",
        type: "merch_regular",
        name: "Work Shirt Maroon 1",
        description: "TEDxUB 2026 Work Shirt Maroon 1",
        price: 150_000,
        isActive: true,
        category: "workshirt",
        variants: [
          { id: "var_ws_s", type: "size", label: "S" },
          { id: "var_ws_m", type: "size", label: "M" },
          { id: "var_ws_l", type: "size", label: "L" },
          { id: "var_ws_xl", type: "size", label: "XL" },
        ],
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "prod_m_workshirt_maroon_2",
        type: "merch_regular",
        name: "Work Shirt Maroon 2",
        description: "TEDxUB 2026 Work Shirt Maroon 2",
        price: 150_000,
        isActive: true,
        category: "workshirt",
        variants: [
          { id: "var_ws_s", type: "size", label: "S" },
          { id: "var_ws_m", type: "size", label: "M" },
          { id: "var_ws_l", type: "size", label: "L" },
          { id: "var_ws_xl", type: "size", label: "XL" },
        ],
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "prod_m_workshirt_maroon_3",
        type: "merch_regular",
        name: "Work Shirt Maroon 3",
        description: "TEDxUB 2026 Work Shirt Maroon 3",
        price: 150_000,
        isActive: true,
        category: "workshirt",
        variants: [
          { id: "var_ws_s", type: "size", label: "S" },
          { id: "var_ws_m", type: "size", label: "M" },
          { id: "var_ws_l", type: "size", label: "L" },
          { id: "var_ws_xl", type: "size", label: "XL" },
        ],
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "prod_m_topi_1",
        type: "merch_regular",
        name: "Topi 1",
        category: "hat",
        description: "TEDxUB 2026 Cap",
        price: 50_000,
        isActive: true,
        variants: [
          { id: "var_tp_blk", type: "color", label: "Hitam" },
          { id: "var_tp_wht", type: "color", label: "Putih" },
        ],
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "prod_m_socks",
        type: "merch_regular",
        name: "Socks",
        description: "TEDxUB 2026 Socks",
        price: 35_000,
        category: "socks",
        isActive: true,
        variants: [{ id: "var_sk_free", type: "size", label: "Free Size" }],
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "prod_m_keychain",
        type: "merch_regular",
        name: "Keychain",
        description: "TEDxUB 2026 Keychain",
        price: 25_000,
        isActive: true,
        category: "keychain",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "prod_m_sticker",
        type: "merch_regular",
        name: "Sticker",
        description: "TEDxUB 2026 Sticker Pack",
        price: 15_000,
        isActive: true,
        category: "stickers",
        createdAt: now,
        updatedAt: now,
      },

      // -- Merch Bundle --
      {
        id: "prod_mb_a",
        type: "merch_bundle",
        name: "Bundling A",
        description: "T-Shirt + Topi",
        price: 155_000,
        isActive: true,
        bundleItems: [
          {
            category: "t-shirt",
            type: "merchandise",
            products: [
              {
                id: "prod_m_tshirt_1",
                name: "T-shirt 1",
                imageUrl: "https://example.com/tshirt1.jpg",
                variants: [
                  { id: "var_ts_s", type: "size", label: "S" },
                  { id: "var_ts_m", type: "size", label: "M" },
                  { id: "var_ts_l", type: "size", label: "L" },
                  { id: "var_ts_xl", type: "size", label: "XL" },
                ],
              },
              {
                id: "prod_m_tshirt_2",
                name: "T-shirt 2",
                imageUrl: "https://example.com/tshirt2.jpg",
                variants: [
                  { id: "var_ts_s", type: "size", label: "S" },
                  { id: "var_ts_m", type: "size", label: "M" },
                  { id: "var_ts_l", type: "size", label: "L" },
                  { id: "var_ts_xl", type: "size", label: "XL" },
                ],
              },
              {
                id: "prod_m_tshirt_3",
                name: "T-shirt 3",
                imageUrl: "https://example.com/tshirt3.jpg",
                variants: [
                  { id: "var_ts_s", type: "size", label: "S" },
                  { id: "var_ts_m", type: "size", label: "M" },
                  { id: "var_ts_l", type: "size", label: "L" },
                  { id: "var_ts_xl", type: "size", label: "XL" },
                ],
              },
            ],
          },
          {
            category: "hat",
            type: "merchandise",
            products: [
              {
                id: "prod_m_topi_1",
                name: "Topi 1",
                imageUrl: "https://example.com/cap.jpg",
                variants: [
                  { id: "var_tp_blk", type: "color", label: "Hitam" },
                  { id: "var_tp_wht", type: "color", label: "Putih" },
                ],
              },
            ],
          },
        ],
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "prod_mb_b",
        type: "merch_bundle",
        name: "Bundling B",
        description: "Workshirt + Topi",
        price: 185_000,
        isActive: true,
        bundleItems: [
          {
            category: "workshirt",
            type: "merchandise",
            products: [
              {
                id: "prod_m_workshirt_black_1",
                name: "Work Shirt Black 1",
                imageUrl: "https://example.com/workshirt_black.jpg",
                variants: [
                  { id: "var_ws_s", type: "size", label: "S" },
                  { id: "var_ws_m", type: "size", label: "M" },
                  { id: "var_ws_l", type: "size", label: "L" },
                  { id: "var_ws_xl", type: "size", label: "XL" },
                ],
              },
            ],
          },
          {
            category: "hat",
            type: "merchandise",
            products: [
              {
                id: "prod_m_topi_1",
                name: "Topi 1",
                imageUrl: "https://example.com/cap.jpg",
                variants: [
                  { id: "var_tp_blk", type: "color", label: "Hitam" },
                  { id: "var_tp_wht", type: "color", label: "Putih" },
                ],
              },
            ],
          },
        ],
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "prod_mb_c",
        type: "merch_bundle",
        name: "Bundling C",
        description: "T-Shirt + Socks",
        price: 145_000,
        isActive: true,
        bundleItems: [
          {
            category: "t-shirt",
            type: "merchandise",
            products: [
              {
                id: "prod_m_tshirt_1",
                name: "T-shirt 1",
                imageUrl: "https://example.com/tshirt1.jpg",
                variants: [
                  { id: "var_ts_s", type: "size", label: "S" },
                  { id: "var_ts_m", type: "size", label: "M" },
                  { id: "var_ts_l", type: "size", label: "L" },
                  { id: "var_ts_xl", type: "size", label: "XL" },
                ],
              },
            ],
          },
          {
            category: "socks",
            type: "merchandise",
            products: [
              {
                id: "prod_m_socks",
                name: "Socks",
                imageUrl: "https://example.com/socks.jpg",
                variants: [
                  { id: "var_sk_free", type: "size", label: "Free Size" },
                ],
              },
            ],
          },
        ],
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "prod_mb_d",
        type: "merch_bundle",
        name: "Bundling D",
        description: "Workshirt + Socks",
        price: 175_000,
        isActive: true,
        bundleItems: [
          {
            category: "workshirt",
            type: "merchandise",
            products: [
              {
                id: "prod_m_workshirt_black_1",
                name: "Work Shirt Black 1",
                imageUrl: "https://example.com/workshirt_black.jpg",
                variants: [
                  { id: "var_ws_s", type: "size", label: "S" },
                  { id: "var_ws_m", type: "size", label: "M" },
                  { id: "var_ws_l", type: "size", label: "L" },
                  { id: "var_ws_xl", type: "size", label: "XL" },
                ],
              },
            ],
          },
          {
            category: "socks",
            type: "merchandise",
            products: [
              {
                id: "prod_m_socks",
                name: "Socks",
                imageUrl: "https://example.com/socks.jpg",
                variants: [
                  { id: "var_sk_free", type: "size", label: "Free Size" },
                ],
              },
            ],
          },
        ],
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "prod_mb_e",
        type: "merch_bundle",
        name: "Bundling E",
        description: "Topi + Keychain",
        price: 70_000,
        isActive: true,
        bundleItems: [
          {
            category: "hat",
            type: "merchandise",
            products: [
              {
                id: "prod_m_hat",
                name: "Topi",
                imageUrl: "https://example.com/hat.jpg",
                variants: [
                  { id: "var_ht_blk", type: "color", label: "Hitam" },
                  { id: "var_ht_wht", type: "color", label: "Putih" },
                ],
              },
            ],
          },
          {
            category: "keychain",
            type: "merchandise",
            products: [
              {
                id: "prod_m_keychain",
                name: "Keychain",
                imageUrl: "https://example.com/keychain.jpg",
                variants: [
                  { id: "var_kc_std", type: "size", label: "Standard" },
                ],
              },
            ],
          },
        ],
        createdAt: now,
        updatedAt: now,
      },
    ];
  });

const createOrder = publicProcedure
  .input(createMerchOrderInputSchema)
  .output(createMerchOrderOutputSchema)
  .mutation((opts) => {
    const totalPrice = opts.input.items.reduce(
      (sum, item) => sum + item.quantity * 100_000,
      0
    );
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();
    const paymentMethod = getDummyMerchPaymentMethod();

    const payment:
      | { qrisUrl: string; midtransOrderId: string }
      | { uploadUrl: string } =
      paymentMethod === "midtrans"
        ? {
            qrisUrl: "https://example.com/qris-midtrans",
            midtransOrderId: `MID-${generateOrderId()}`,
          }
        : {
            uploadUrl: "https://example.com/upload",
          };

    return {
      orderId: generateOrderId(),
      status: "paid",
      totalPrice,
      expiresAt,
      paymentMethod,
      payment,
    };
  });

const getOrderStatus = publicProcedure
  .input(getMerchOrderStatusInputSchema)
  .output(getMerchOrderStatusOutputSchema)
  .query((opts) => {
    const now = new Date().toISOString();
    return {
      orderId: opts.input.orderId,
      status: "paid",
      type: "merch",
      totalPrice: 250_000,
      items: [
        {
          snapshotName: "TEDx Merch Item",
          quantity: 1,
          unitPrice: 150_000,
          snapshotVariants: [{ label: "M", type: "size" }],
        },
        {
          snapshotName: "Sticker Pack",
          quantity: 1,
          unitPrice: 100_000,
        },
      ],
      createdAt: now,
      paidAt: now,
    };
  });

export const merchRouter = createTRPCRouter({
  listProducts,
  createOrder,
  getOrderStatus,
});
