import type { TicketProduct } from "./ticket";

export type TicketCheckoutStep =
  | "identification"
  | "summary"
  | "payment"
  | "success";

export type CartItem = TicketProduct & {
  itemId: string;
  // TODO: add support for merch
  selectedBundleProducts?: {
    productId: string;
    variantIds?: string[] | undefined;
  }[];
};
