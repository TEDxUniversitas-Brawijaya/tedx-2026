const orderKeys = {
  buyerCooldown: (email: string) => `buyer_cooldown:${email}`,
  idempotencyKey: (idempotencyKey: string) =>
    `order_idempotency_key:${idempotencyKey}`,
};

const configKeys = {
  key: (key: string) => `config:${key}`,
};

export const KEYS = {
  order: orderKeys,
  config: configKeys,
} as const;
