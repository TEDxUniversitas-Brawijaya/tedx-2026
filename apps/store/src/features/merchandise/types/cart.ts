import type { Product } from "./product";

export interface CartItem extends Product {
  quantity: number;
  selectedVariantIds: string[];
  selectedBundleProductIds?: string[];
}

export type OrderSnapshotVariant = {
  label: string;
  type: string;
};

export type OrderSnapshotItem = {
  snapshotName: string;
  quantity: number;
  unitPrice: number;
  snapshotVariants?: OrderSnapshotVariant[];
};

export type OrderPayment =
  | { qrisUrl: string; midtransOrderId: string }
  | { uploadUrl: string };

export type OrderPaymentMethod = "manual" | "midtrans";

export type OrderStatus =
  | "pending_payment"
  | "pending_verification"
  | "paid"
  | "expired"
  | "refund_requested"
  | "refunded";

export type SetOrderPayload = {
  orderId: string;
  status: OrderStatus | null;
  items?: OrderSnapshotItem[];
  totalPrice: number;
  paymentMethod?: OrderPaymentMethod | null;
  payment?: OrderPayment | null;
  createdAt?: string | null;
  paidAt?: string | null;
};
