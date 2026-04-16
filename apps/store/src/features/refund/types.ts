export type RefundOrderInfo = {
  orderId: string;
  buyerName: string;
  buyerEmail: string;
  paymentMethod: "midtrans" | "manual";
  items: {
    name: string;
    quantity: number;
    unitPrice: number;
    snapshotVariants?: {
      label: string;
      type: string;
    }[];
  }[];
  totalPrice: number;
  refundDeadline: string;
};

export type RefundSubmitResponse = {
  refundId: string;
  status: "requested";
  message: string;
};

export type RefundErrorCode =
  | "INVALID_REFUND_TOKEN"
  | "ORDER_NOT_REFUNDABLE"
  | "REFUND_DEADLINE_PASSED"
  | "REFUND_ALREADY_REQUESTED"
  | "UNKNOWN";
