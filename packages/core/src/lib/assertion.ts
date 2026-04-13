import type { CreateOrderInput } from "@tedx-2026/types/order";
import { AppError } from "../errors";

export const assertOrderItemsPresent = (items: CreateOrderInput["items"]) => {
  if (items.length === 0) {
    throw new AppError("BAD_REQUEST", "Order items are required");
  }
};
