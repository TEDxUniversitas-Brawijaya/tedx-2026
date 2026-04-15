const ORDER_CODE_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

const generateOrderCode = (size = 5) => {
  const randomBytes = crypto.getRandomValues(new Uint8Array(size));
  return Array.from(randomBytes)
    .map((value) => ORDER_CODE_ALPHABET[value % ORDER_CODE_ALPHABET.length])
    .join("");
};

/**
 * Generates a unique order ID in the format "TDX-YYMMDD-CODE", where "CODE" is a random alphanumeric string.
 * @returns A unique order ID string.
 */
export const generateOrderId = () => {
  const now = new Date();
  const year = now.getFullYear() % 100; // Get last two digits of the year
  const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
  const day = String(now.getDate()).padStart(2, "0");
  const date = `${year}${month}${day}`;
  const code = generateOrderCode();
  return `TDX-${date}-${code}`;
};
