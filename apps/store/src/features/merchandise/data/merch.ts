import { z } from "zod";
import {
  bundleItemSchema,
  productTypeSchema,
  productVariantSchema,
} from "../../../../../../packages/api/src/schemas/common";

const productSchema = z.object({
  id: z.string(),
  type: productTypeSchema,
  name: z.string(),
  price: z.number().int(),
  imageUrl: z.string().nullable(),
  variants: z.array(productVariantSchema),
  bundleItems: z
    .array(
      bundleItemSchema.extend({
        name: z.string(),
      })
    )
    .optional(),
});

export type MerchProduct = z.infer<typeof productSchema>;

export const merchsData = {
  tshirt: [
    {
      id: "prod_tshirt_1",
      type: "merch_regular",
      name: "T-Shirt 1",
      price: 75_000,
      imageUrl: "/img/merch-tshirt-1.png",
      variants: [
        { id: "v_s", type: "size", label: "S" },
        { id: "v_m", type: "size", label: "M" },
        { id: "v_l", type: "size", label: "L" },
        { id: "v_xl", type: "size", label: "XL" },
      ],
    },
    {
      id: "prod_tshirt_2",
      type: "merch_regular",
      name: "T-Shirt 2",
      price: 75_000,
      imageUrl: "/img/merch-tshirt-2.png",
      variants: [
        { id: "v_s", type: "size", label: "S" },
        { id: "v_m", type: "size", label: "M" },
        { id: "v_l", type: "size", label: "L" },
        { id: "v_xl", type: "size", label: "XL" },
      ],
    },
    {
      id: "prod_tshirt_3",
      type: "merch_regular",
      name: "T-Shirt 3",
      price: 75_000,
      imageUrl: "/img/merch-tshirt-3.png",
      variants: [
        { id: "v_s", type: "size", label: "S" },
        { id: "v_m", type: "size", label: "M" },
        { id: "v_l", type: "size", label: "L" },
        { id: "v_xl", type: "size", label: "XL" },
      ],
    },
  ],
  workshirt: [
    {
      id: "prod_workshirt_1",
      type: "merch_regular",
      name: "Workshirt 1",
      price: 160_000,
      imageUrl: "/img/merch-workshirt-1.png",
      variants: [
        { id: "v_s", type: "size", label: "S" },
        { id: "v_m", type: "size", label: "M" },
        { id: "v_l", type: "size", label: "L" },
        { id: "v_xl", type: "size", label: "XL" },
      ],
    },
    {
      id: "prod_workshirt_2",
      type: "merch_regular",
      name: "Workshirt 2",
      price: 160_000,
      imageUrl: "/img/merch-workshirt-2.png",
      variants: [
        { id: "v_s", type: "size", label: "S" },
        { id: "v_m", type: "size", label: "M" },
        { id: "v_l", type: "size", label: "L" },
        { id: "v_xl", type: "size", label: "XL" },
      ],
    },
  ],
  sticker: [
    {
      id: "prod_sticker_1",
      type: "merch_regular",
      name: "Sticker 1",
      price: 15_000,
      imageUrl: "/img/merch-sticker-1.png",
      variants: [],
    },
    {
      id: "prod_sticker_2",
      type: "merch_regular",
      name: "Sticker 2",
      price: 15_000,
      imageUrl: "/img/merch-sticker-2.png",
      variants: [],
    },
  ],
  totebag: [
    {
      id: "prod_totebag_1",
      type: "merch_regular",
      name: "Totebag 1",
      price: 50_000,
      imageUrl: "/img/merch-totebag-1.png",
      variants: [],
    },
  ],
  hat: [
    {
      id: "prod_hat_1",
      type: "merch_regular",
      name: "Hat 1",
      price: 65_000,
      imageUrl: "/img/merch-hat-1.png",
      variants: [],
    },
    {
      id: "prod_hat_2",
      type: "merch_regular",
      name: "Hat 2",
      price: 65_000,
      imageUrl: "/img/merch-hat-2.png",
      variants: [],
    },
  ],
};

export const merchBundlingData: MerchProduct[] = [
  {
    id: "prod_bundle_1",
    type: "merch_bundle",
    name: "Bundling 1",
    price: 130_000,
    imageUrl: "/img/merch-bundling-1.png",
    variants: [
      { id: "v_s", type: "size", label: "S" },
      { id: "v_m", type: "size", label: "M" },
      { id: "v_l", type: "size", label: "L" },
      { id: "v_xl", type: "size", label: "XL" },
    ],
    bundleItems: [
      {
        productId: "prod_tshirt_1",
        quantity: 1,
        isSelectable: true,
        name: "T-Shirt",
      },
      {
        productId: "prod_hat_1",
        quantity: 1,
        isSelectable: false,
        name: "Hat",
      },
    ],
  },
  {
    id: "prod_bundle_2",
    type: "merch_bundle",
    name: "Bundling 2",
    price: 80_000,
    imageUrl: "/img/merch-bundling-2.png",
    variants: [
      { id: "v_s", type: "size", label: "S" },
      { id: "v_m", type: "size", label: "M" },
      { id: "v_l", type: "size", label: "L" },
      { id: "v_xl", type: "size", label: "XL" },
    ],
    bundleItems: [
      {
        productId: "prod_tshirt_1",
        quantity: 1,
        isSelectable: true,
        name: "T-Shirt",
      },
      {
        productId: "prod_sticker_1",
        quantity: 1,
        isSelectable: false,
        name: "Sticker",
      },
    ],
  },
  {
    id: "prod_bundle_3",
    type: "merch_bundle",
    name: "Bundling 3",
    price: 115_000,
    imageUrl: "/img/merch-bundling-3.png",
    variants: [
      { id: "v_s", type: "size", label: "S" },
      { id: "v_m", type: "size", label: "M" },
      { id: "v_l", type: "size", label: "L" },
      { id: "v_xl", type: "size", label: "XL" },
    ],
    bundleItems: [
      {
        productId: "prod_tshirt_1",
        quantity: 1,
        isSelectable: true,
        name: "T-Shirt",
      },
      {
        productId: "prod_totebag_1",
        quantity: 1,
        isSelectable: false,
        name: "Totebag",
      },
    ],
  },
  {
    id: "prod_bundle_4",
    type: "merch_bundle",
    name: "Bundling 4",
    price: 210_000,
    imageUrl: "/img/merch-bundling-4.png",
    variants: [
      { id: "v_s", type: "size", label: "S" },
      { id: "v_m", type: "size", label: "M" },
      { id: "v_l", type: "size", label: "L" },
      { id: "v_xl", type: "size", label: "XL" },
    ],
    bundleItems: [
      {
        productId: "prod_workshirt_1",
        quantity: 1,
        isSelectable: true,
        name: "Workshirt",
      },
      {
        productId: "prod_hat_1",
        quantity: 1,
        isSelectable: false,
        name: "Hat",
      },
    ],
  },
  {
    id: "prod_bundle_5",
    type: "merch_bundle",
    name: "Bundling 5",
    price: 170_000,
    imageUrl: "/img/merch-bundling-5.png",
    variants: [
      { id: "v_s", type: "size", label: "S" },
      { id: "v_m", type: "size", label: "M" },
      { id: "v_l", type: "size", label: "L" },
      { id: "v_xl", type: "size", label: "XL" },
    ],
    bundleItems: [
      {
        productId: "prod_workshirt_1",
        quantity: 1,
        isSelectable: true,
        name: "Workshirt",
      },
      {
        productId: "prod_sticker_1",
        quantity: 1,
        isSelectable: false,
        name: "Sticker",
      },
    ],
  },
  {
    id: "prod_bundle_6",
    type: "merch_bundle",
    name: "Bundling 6",
    price: 195_000,
    imageUrl: "/img/merch-bundling-6.png",
    variants: [
      { id: "v_s", type: "size", label: "S" },
      { id: "v_m", type: "size", label: "M" },
      { id: "v_l", type: "size", label: "L" },
      { id: "v_xl", type: "size", label: "XL" },
    ],
    bundleItems: [
      {
        productId: "prod_workshirt_1",
        quantity: 1,
        isSelectable: true,
        name: "Workshirt",
      },
      {
        productId: "prod_totebag_1",
        quantity: 1,
        isSelectable: false,
        name: "Totebag",
      },
    ],
  },
  {
    id: "prod_bundle_7",
    type: "merch_bundle",
    name: "Bundling 7",
    price: 105_000,
    imageUrl: "/img/merch-bundling-7.png",
    variants: [],
    bundleItems: [
      {
        productId: "prod_totebag_1",
        quantity: 1,
        isSelectable: false,
        name: "Totebag",
      },
      {
        productId: "prod_hat_1",
        quantity: 1,
        isSelectable: false,
        name: "Hat",
      },
    ],
  },
  {
    id: "prod_bundle_8",
    type: "merch_bundle",
    name: "Bundling 8",
    price: 55_000,
    imageUrl: "/img/merch-bundling-8.png",
    variants: [],
    bundleItems: [
      {
        productId: "prod_totebag_1",
        quantity: 1,
        isSelectable: false,
        name: "Totebag",
      },
      {
        productId: "prod_sticker_1",
        quantity: 1,
        isSelectable: false,
        name: "Sticker",
      },
    ],
  },
  {
    id: "prod_bundle_9",
    type: "merch_bundle",
    name: "Bundling 9",
    price: 70_000,
    imageUrl: "/img/merch-bundling-9.png",
    variants: [],
    bundleItems: [
      {
        productId: "prod_hat_1",
        quantity: 1,
        isSelectable: false,
        name: "Hat",
      },
      {
        productId: "prod_sticker_1",
        quantity: 1,
        isSelectable: false,
        name: "Sticker",
      },
    ],
  },
];

export type MerchFilter = keyof typeof merchsData;
