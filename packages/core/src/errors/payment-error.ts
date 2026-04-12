import { AppError } from "./app-error";

export const createPaymentModeMismatchError = (
  expected: "midtrans" | "manual",
  actual: "midtrans" | "manual"
) =>
  new AppError("CONFLICT", "Payment mode mismatch", {
    details: { expected, actual },
  });
