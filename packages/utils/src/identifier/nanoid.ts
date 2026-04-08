import { nanoid } from "nanoid";

/**
 * Creates a new Nano ID.
 * @example
 * const id = createNanoId(); // e.g., "V1StGXR8_Z5jdHi6B-myT"
 * const customId = createNanoId(10); // e.g., "IRFa-VaY2b"
 *
 * @param size - The size of the Nano ID. If not provided, it defaults to 21 characters.
 * @returns A new Nano ID string.
 */
export const createNanoId = (size?: number) => nanoid(size);

/**
 * Creates a new Nano ID with a prefix.
 * @example
 * const id = createNanoIdWithPrefix("user"); // e.g., "user_V1StGXR8_Z5jdHi6B-myT"
 * const customId = createNanoIdWithPrefix("item", 10); // e.g., "item_IRFa-VaY2b"
 *
 * @param prefix - The prefix for the Nano ID.
 * @param size - The size of the Nano ID. If not provided, it defaults to 21 characters.
 * @returns A new Nano ID string with the specified prefix.
 */
export const createNanoIdWithPrefix = (prefix: string, size?: number) =>
  `${prefix}_${nanoid(size)}`;
