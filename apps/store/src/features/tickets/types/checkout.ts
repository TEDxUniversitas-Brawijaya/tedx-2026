// Checkout flow types: defines checkout step union and shared ticket type exports.
export type TicketCheckoutStep =
  | "selection"
  | "identification"
  | "summary"
  | "payment";

export type { TicketBuyer, TicketOrder, TicketProduct } from "./ticket";
