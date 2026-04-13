export type CreateMidtransTransactionInput = {
  orderId: string;
  totalPrice: number;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  expiryMinutes: number;
};

export type CreatePaymentServiceOptions = {
  serverKey: string;
  isProduction: boolean;
};
