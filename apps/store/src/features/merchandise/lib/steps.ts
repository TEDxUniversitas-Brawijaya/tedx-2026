export type CheckoutStep =
  | "selection"
  | "cart"
  | "identification"
  | "summary"
  | "payment"
  | "success";

export const progressSteps: {
  [key in CheckoutStep]: {
    idx: number;
    prev: CheckoutStep | null;
    next: CheckoutStep | null;
  };
} = {
  selection: {
    idx: 0,
    prev: null,
    next: "cart",
  },
  cart: {
    idx: 1,
    prev: null,
    next: "identification",
  },
  identification: {
    idx: 2,
    prev: "cart",
    next: "summary",
  },
  summary: {
    idx: 3,
    prev: "identification",
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
