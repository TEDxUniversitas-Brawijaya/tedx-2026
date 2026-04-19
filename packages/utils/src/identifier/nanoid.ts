import { customAlphabet, nanoid } from "nanoid";

const alphanumericNanoId = customAlphabet(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  21
);

/**
 * Creates a new Nano ID.
 * @example
 * const id = createNanoId(); // e.g., "V1StGXR8_Z5jdHi6B-myT"
 * const customId = createNanoId(10); // e.g., "IRFa-VaY2b"
 * const alphanumericId = createNanoId(10, true); // e.g., "A1B2C3D4E5"
 *
 * @param size - The size of the Nano ID. If not provided, it defaults to 21 characters.
 * @param alphanumericOnly - Whether to generate an alphanumeric-only ID. If not provided, it defaults to false.
 * @returns A new Nano ID string.
 */
export const createNanoId = (size?: number, alphanumericOnly?: boolean) => {
  if (alphanumericOnly === undefined) {
    return nanoid(size);
  }

  if (!alphanumericOnly) {
    return nanoid(size);
  }

  return alphanumericNanoId(size);
};

/**
 * Creates a new Nano ID with a prefix.
 * @example
 * const id = createNanoIdWithPrefix("user"); // e.g., "user_V1StGXR8_Z5jdHi6B-myT"
 * const customId = createNanoIdWithPrefix("item", 10); // e.g., "item_IRFa-VaY2b"
 * const alphanumericId = createNanoIdWithPrefix("user", 10, true); // e.g., "user_A1B2C3D4E5"
 *
 * @param prefix - The prefix for the Nano ID.
 * @param size - The size of the Nano ID. If not provided, it defaults to 21 characters.
 * @param alphanumericOnly - Whether to generate an alphanumeric-only ID. If not provided, it defaults to false.
 * @returns A new Nano ID string with the specified prefix.
 */
export const createNanoIdWithPrefix = (
  prefix: string,
  size?: number,
  alphanumericOnly?: boolean
) => {
  const nanoId = createNanoId(size, alphanumericOnly);
  return `${prefix}_${nanoId}`;
};
