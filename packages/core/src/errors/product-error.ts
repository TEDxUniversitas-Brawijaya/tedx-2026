import { AppError } from "./app-error";

export const createProductNotFoundError = (productId: string) =>
  new AppError("NOT_FOUND", "Product not found", {
    details: { productId },
  });

export const createProductInactiveError = (productId: string) =>
  new AppError("CONFLICT", "Product is inactive", {
    details: { productId },
  });

export const createPreorderDeadlinePassedError = (deadline: string) =>
  new AppError("CONFLICT", "Merch pre-order deadline has passed", {
    details: { deadline },
  });

export const createInvalidVariantsError = (
  productId: string,
  invalidVariantIds: string[]
) =>
  new AppError("BAD_REQUEST", "Invalid variants selected", {
    details: { productId, invalidVariantIds },
  });
