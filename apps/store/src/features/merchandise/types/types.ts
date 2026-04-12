export type { FormApi } from "@tanstack/react-form";
export type { ZodValidator } from "@tanstack/zod-form-adapter";
import { merchBuyerInfoSchema } from "@tedx-2026/api/schemas/common";
import type { z } from "zod";

export type CheckoutStep =
  | "selection"
  | "cart"
  | "identification"
  | "summary"
  | "payment"
  | "success";

export type CheckoutFormData = z.infer<typeof merchBuyerInfoSchema>;

export const checkoutSchema = merchBuyerInfoSchema;

export const progressSteps: CheckoutStep[] = [
  "cart",
  "identification",
  "summary",
  "payment",
];
