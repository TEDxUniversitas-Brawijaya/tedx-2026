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
    next: "success",
  },
  success: {
    idx: 4,
    prev: "payment",
    next: null,
  },
} as const;
