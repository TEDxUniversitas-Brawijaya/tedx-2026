export type OrderType = "ticket" | "merch";

export type OrderStatus =
  | "pending_payment"
  | "pending_verification"
  | "paid"
  | "expired"
  | "refund_requested"
  | "refunded";

export type ListOrder = {
  id: string;
  type: OrderType;
  status: OrderStatus;
  buyerName: string;
  buyerEmail: string;
  totalPrice: number;
  createdAt: string;
  paidAt: string | null;
};

export type OrderDetail = {
  id: string;
  type: OrderType;
  status: OrderStatus;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  buyerCollege: string;
  totalPrice: number;
  idempotencyKey: string | null;
  updatedAt: string;
  createdAt: string;
  paidAt: string | null;
  expiresAt: string | null;
  paymentMethod: "midtrans" | "manual" | null;
  midtransOrderId: string | null;
  proofImageUrl: string | null;
  verifiedBy: string | null;
  verifiedAt: string | null;
  rejectionReason: string | null;
  refundToken: string | null;
  pickedUpAt: string | null;
  pickedUpBy: string | null;
  items: {
    id: string;
    productId: string;
    quantity: number;
    snapshotName: string;
    snapshotPrice: number;
    snapshotType: string;
    snapshotVariants: { label: string; type: string }[] | null;
  }[];
  tickets?: {
    id: string;
    qrCode: string;
    eventDay: string;
    attendanceStatus: string;
    checkedInAt: string | null;
    checkedInBy: string | null;
  }[];
  refund: {
    id: string;
    status: "requested" | "approved" | "rejected";
    reason: string;
    paymentMethod: string;
    paymentProofUrl: string | null;
    bankAccountNumber: string;
    bankName: string;
    bankAccountHolder: string;
    processedBy: string | null;
    processedAt: string | null;
    rejectionReason: string | null;
    createdAt: string;
  } | null;
};

export type OrderListState = {
  type: "all" | OrderType;
  status: "all" | OrderStatus;
  search: string;
  sortBy: "createdAt" | "totalPrice" | "status";
  sortOrder: "asc" | "desc";
  page: number;
  limit: number;
};

export const initialOrderListState: OrderListState = {
  type: "all",
  status: "all",
  search: "",
  sortBy: "createdAt",
  sortOrder: "desc",
  page: 1,
  limit: 10,
};
