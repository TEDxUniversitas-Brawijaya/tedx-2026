import type { ChangeEvent } from "react";
import type { CartItem } from "./cart";

export type SummaryBuyerInfo = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
};

export type SummaryStepViewProps = {
  buyerInfo: SummaryBuyerInfo;
  isSubmitting: boolean;
  items: CartItem[];
  onEditCart: () => void;
  onEditIdentification: () => void;
  onSubmitOrder: () => void;
  totalPrice: number;
};

export type PaymentStepViewProps = {
  isCheckingStatus: boolean;
  onCheckStatus: () => void;
  orderId: string | null;
  qrisUrl: string;
  timeLeftSeconds: number;
  totalPrice: number;
};

export type PaymentManualStepViewProps = {
  canUploadProof: boolean;
  fileInputId: string;
  isCheckingStatus: boolean;
  onBack: () => void;
  onCheckStatus: () => void;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onUploadProof: () => void;
  orderId: string | null;
  selectedFileName: string | null;
  totalPrice: number;
  uploadUrl: string | null;
};
