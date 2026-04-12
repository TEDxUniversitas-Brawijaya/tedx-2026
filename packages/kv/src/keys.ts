const normalizeEmail = (email: string) => email.trim().toLowerCase();

export const KEYS = {
  orderExpiry: (orderId: string) => `order_expiry:${orderId}`,
  buyerCooldown: (email: string) => `buyer_cooldown:${normalizeEmail(email)}`,
} as const;
