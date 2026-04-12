import { AppError } from "./app-error";

export const createOrderNotFoundError = (orderId: string) =>
  new AppError("NOT_FOUND", "Order not found", {
    details: { orderId },
  });
