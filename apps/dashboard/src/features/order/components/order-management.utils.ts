export const statusVariant = (status: string) => {
  if (status === "paid") {
    return "default" as const;
  }

  if (status === "pending_payment" || status === "pending_verification") {
    return "secondary" as const;
  }

  if (status === "refund_requested") {
    return "outline" as const;
  }

  if (status === "expired" || status === "refunded") {
    return "destructive" as const;
  }

  return "outline" as const;
};

export const formatDate = (value: string | null) => {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("id-ID", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
};

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
};
