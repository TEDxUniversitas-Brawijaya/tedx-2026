import type { MerchCategory, TicketProduct } from "./ticket";

export type TicketCheckoutStep =
  | "identification"
  | "choose_bundle_item"
  | "summary"
  | "payment"
  | "success";

export type CartItem = TicketProduct & {
  itemId: string;
  // TODO: add support for merch
  selectedBundleProducts?: {
    productId: string;
    product: {
      name: string;
    };
    category: MerchCategory | null; // null means it comes from a merchandise_product type bundle item, which doesn't have a category
  }[];
};
