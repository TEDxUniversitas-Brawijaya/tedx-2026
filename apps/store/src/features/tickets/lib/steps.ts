import type { TicketCheckoutStep } from "../types/checkout";

export const progressSteps: {
  [key in TicketCheckoutStep]: {
    idx: number;
    prev: TicketCheckoutStep | null;
    next: TicketCheckoutStep | null;
  };
} = {
  selection: {
    idx: 0,
    prev: null,
    next: "identification",
  },
  identification: {
    idx: 1,
    prev: "selection",
    next: "summary",
  },
  summary: {
    idx: 2,
    prev: "identification",
    next: "payment",
  },
  payment: {
    idx: 3,
    prev: "summary",
    next: null,
  },
} as const;
