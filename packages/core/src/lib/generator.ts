const ORDER_CODE_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

const generateOrderCode = (size = 5) => {
  const randomBytes = crypto.getRandomValues(new Uint8Array(size));
  return Array.from(randomBytes)
    .map((value) => ORDER_CODE_ALPHABET[value % ORDER_CODE_ALPHABET.length])
    .join("");
};

export const generateOrderId = (date = new Date()) => {
  const year = String(date.getUTCFullYear()).slice(-2);
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");

  return `TDX-${year}${month}${day}-${generateOrderCode()}`;
};
