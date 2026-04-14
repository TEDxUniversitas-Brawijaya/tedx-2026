export type Order = {
  id: string;
  type: "merch" | "ticket";
  status:
    | "pending_payment"
    | "pending_verification"
    | "paid"
    | "expired"
    | "refund_requested"
    | "refunded"
    | "rejected";

  buyer: {
    name: string;
    email: string;
    phone: string;
    college: string; // instansi for tickets, alamat for merch
  };

  totalPrice: number; // IDR
  idempotencyKey: string; // client-generated, prevents duplicate orders
  expiresAt: Date; // 20-min TTL for pending_payment
  paidAt: Date | null;
  createdAt: Date;
  updatedAt: Date;

  paymentMethod: "midtrans" | "manual"; // midtrans | manual — system-determined
  midtransOrderId: string | null;
  proofImageUrl: string | null; // storage.tedxuniversitasbrawijaya.com (private bucket)
  verifiedBy: string | null; // admin user ID
  verifiedByUser: {
    id: string;
    name: string;
  } | null;
  verifiedAt: Date | null;
  rejectionReason: string | null;

  refundToken: string; // nanoid, for tokenized refund link

  pickedUpAt: Date | null;
  pickedUpBy: string | null; // admin user ID
  pickedUpByUser: {
    id: string;
    name: string;
  } | null;
};

export type OrderItem = {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  snapshot: {
    name: string;
    price: number;
    type: string;
    variants?:
      | {
          label: string;
          type: string;
        }[]
      | null;
    bundleProducts?: {
      name: string; // product name
      category: string | null; // product category (for merch) or null (for tickets)
      selectedVariants?: {
        label: string; // e.g. M, Red
        type: string; // e.g. size, color
      }[]; // JSON array of selected variants for this bundle product at purchase time. e.g. [{"label":"M","type":"size"}]
    }[];
  };
  createdAt: Date;
  updatedAt: Date;
};
