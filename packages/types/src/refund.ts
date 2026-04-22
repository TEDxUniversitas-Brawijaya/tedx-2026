import type { Order } from "./order";

export type Refund = {
  id: string;
  orderId: string;
  order: Order;
  status: "requested" | "approved" | "rejected";
  reason: string;
  paymentMethod: string;
  paymentProofUrl?: string;
  bankAccountNumber: string;
  bankName: string;
  bankAccountHolder: string;
  processedBy?: string;
  processedByUser?: {
    id: string;
    name: string;
    email: string;
  };
  processedAt?: Date;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
};
