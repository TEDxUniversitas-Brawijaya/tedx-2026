const orderKeys = {
  buyerCooldown: (email: string) => `buyer_cooldown:${email}`,
  idempotencyKey: (idempotencyKey: string) =>
    `order_idempotency_key:${idempotencyKey}`,
  stock: (productId: string) => `order:stock:${productId}`,
};

const configKeys = {
  key: (key: string) => `config:${key}`,
};

const productKeys = {
  merchs: (status: "all" | "active" | "inactive") =>
    `products:merchs:${status}`,
  tickets: (status: "all" | "active" | "inactive") =>
    `products:tickets:${status}`,
};

export const KEYS = {
  order: orderKeys,
  config: configKeys,
  product: productKeys,
} as const;
