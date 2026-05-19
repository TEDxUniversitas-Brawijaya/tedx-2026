import type { MerchPickupItem } from "../types/merch-pickup";

export function formatMerchPickupDate(date: string | null) {
  if (!date) {
    return "-";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function formatItemsSummary(items: MerchPickupItem[]): string {
  return items
    .map((item) => {
      const variants = item.snapshotVariants?.map((v) => v.label).join(", ");
      return variants
        ? `${item.name} (${variants}) ×${item.quantity}`
        : `${item.name} ×${item.quantity}`;
    })
    .join(", ");
}
