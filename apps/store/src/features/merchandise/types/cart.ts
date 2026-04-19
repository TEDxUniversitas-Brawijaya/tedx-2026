import type {
  MerchCategory,
  MerchProduct,
  Product,
  ProductVariant,
} from "./product";

export type CartItem = Product & {
  itemId: string;
  quantity: number;
  selectedVariants?: ProductVariant[];
  selectedBundleProducts?: (MerchProduct & {
    category: MerchCategory | null; // null means it comes from a merchandise_product type bundle item, which doesn't have a category
    selectedVariants?: ProductVariant[];
  })[];
};

export type Order = {
  orderId: string;
  status:
    | "pending_payment"
    | "pending_verification"
    | "paid"
    | "expired"
    | "refund_requested"
    | "refunded"
    | "rejected";
  totalPrice: number;
  expiresAt: string;
  qrisUrl: string | null;
};

export type Buyer = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
};
