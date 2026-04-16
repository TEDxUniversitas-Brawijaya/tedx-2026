const orderKeys = {
  buyerCooldown: (email: string) => `buyer_cooldown:${email}`,
  idempotencyKey: (idempotencyKey: string) =>
    `order_idempotency_key:${idempotencyKey}`,
  stock: (productId: string) => `order:stock:${productId}`,
};

const configKeys = {
  key: (key: string) => `config:${key}`,
};

export const KEYS = {
  order: orderKeys,
  config: configKeys,
} as const;
