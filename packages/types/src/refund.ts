export type SubmitRefundRequestInput = {
  refundToken: string;
  reason: string;
  paymentMethod: "midtrans" | "manual";
  bankAccountNumber: string;
  bankName: string;
  bankAccountHolder: string;
  paymentProof?: File | null;
};
