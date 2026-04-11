const rateLimitKeys = {
  ip: (ip: string) => `rate_limit:ip:${ip}`,
};

export const KEYS = {
  rateLimit: rateLimitKeys,
};
