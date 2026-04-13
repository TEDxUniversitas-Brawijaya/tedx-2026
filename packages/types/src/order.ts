export type CreateOrderInput = {
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  buyerInstansi: string;
  idempotencyKey: string;
  items: {
    productId: string;
    quantity: number;
    variantIds: string[];
  }[];
};
