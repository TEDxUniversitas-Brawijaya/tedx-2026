const ORDER_CODE_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

const generateOrderCode = (size = 5) => {
  const randomBytes = crypto.getRandomValues(new Uint8Array(size));
  return Array.from(randomBytes)
    .map((value) => ORDER_CODE_ALPHABET[value % ORDER_CODE_ALPHABET.length])
    .join("");
};

export const generateOrderId = () => {
  const date = new Date().toISOString().split("T")[0]?.replace(/-/g, "");
  const code = generateOrderCode();
  return `TDX-${date}-${code}`;
};
