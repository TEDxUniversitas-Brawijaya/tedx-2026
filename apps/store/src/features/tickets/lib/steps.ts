import type { TicketCheckoutStep } from "../types/checkout";

export const progressSteps: {
  [key in TicketCheckoutStep]: {
    idx: number;
    prev: TicketCheckoutStep | null;
    next: TicketCheckoutStep | null;
  };
} = {
  identification: {
    idx: 1,
    prev: null,
    next: "choose_bundle_item",
  },
  choose_bundle_item: {
    idx: 2,
    prev: "identification",
    next: "summary",
  },
  summary: {
    idx: 3,
    prev: "choose_bundle_item",
    next: "payment",
  },
  payment: {
    idx: 4,
    prev: "summary",
    next: "success",
  },
  success: {
    idx: 5,
    prev: "payment",
    next: null,
  },
} as const;
