import { AppError } from "./app-error";

export const createOrderNotFoundError = (orderId: string) =>
  new AppError("NOT_FOUND", "Order not found", {
    details: { orderId },
  });

export const createInvalidOrderStatusError = (
  orderId: string,
  expected: string,
  actual: string
) =>
  new AppError("CONFLICT", "Invalid order status", {
    details: {
      orderId,
      expected,
      actual,
    },
  });
