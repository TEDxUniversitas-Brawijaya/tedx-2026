export const isUniqueConstraintError = (error: unknown) => {
  if (!(error && typeof error === "object")) {
    return false;
  }

  const maybeError = error as {
    code?: string | number;
    message?: string;
    cause?: { code?: string | number; message?: string };
  };

  const candidates = [
    String(maybeError.code ?? ""),
    maybeError.message ?? "",
    String(maybeError.cause?.code ?? ""),
    maybeError.cause?.message ?? "",
  ]
    .join(" ")
    .toLowerCase();

  return (
    candidates.includes("23505") ||
    candidates.includes("sqlite_constraint") ||
    candidates.includes("unique constraint")
  );
};

export const isPendingPayment = (status: string) => {
  return status === "pending_payment";
};

export const isOrderCreationStatus = (
  status: string
): status is "pending_payment" | "pending_verification" => {
  return status === "pending_payment" || status === "pending_verification";
};
