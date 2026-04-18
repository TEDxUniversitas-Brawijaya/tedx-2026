export type OrderType = "ticket" | "merch";

export type OrderStatus =
  | "pending_payment"
  | "pending_verification"
  | "paid"
  | "expired"
  | "refund_requested"
  | "refunded"
  | "rejected";

export type Order = {
  id: string;
  type: OrderType;
  status: OrderStatus;
  buyer: {
    name: string;
    email: string;
    phone: string;
    college: string; // instansi for tickets, alamat for merch
  };
  totalPrice: number;
  createdAt: string;
  paidAt: string | null;
};

export type DetailOrder = Order & {
  idempotencyKey: string | null;
  updatedAt: string;
  expiresAt: string | null;
  paymentMethod: "midtrans" | "manual" | null;
  midtransOrderId: string | null;
  proofImageUrl: string | null;
  verifiedBy: string | null;
  verifiedByUser: {
    id: string;
    name: string;
  } | null;
  verifiedAt: string | null;
  rejectionReason: string | null;
  refundToken: string | null;
  pickedUpAt: string | null;
  pickedUpBy: string | null;
  pickedUpByUser: {
    id: string;
    name: string;
  } | null;
  items: {
    id: string;
    productId: string;
    quantity: number;
    snapshot: {
      name: string;
      price: number;
      type: string;
      variants: { label: string; type: string }[] | null;
      bundleProducts:
        | {
            name: string;
            category: string | null;
            selectedVariants: { label: string; type: string }[] | null;
          }[]
        | null;
    };
  }[];
  tickets:
    | {
        id: string;
        qrCode: string;
        eventDay: string;
        attendanceStatus: string;
        checkedInAt: string | null;
        checkedInBy: string | null;
      }[]
    | null;
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
