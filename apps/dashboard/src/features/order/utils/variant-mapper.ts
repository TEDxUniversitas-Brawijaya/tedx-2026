import type { BadgeVariant } from "@tedx-2026/ui/components/badge";
import type { OrderStatus } from "../types/order";

export const orderStatusBadgeVariantMap: Record<
  OrderStatus,
  BadgeVariant["variant"]
> = {
  paid: "default",
  pending_payment: "secondary",
  pending_verification: "secondary",
  refund_requested: "outline",
  expired: "destructive",
  refunded: "destructive",
  rejected: "destructive",
} as const;

export const orderRefundStatusBadgeVariantMap: Record<
  string,
  BadgeVariant["variant"]
> = {
  approved: "default",
  requested: "secondary",
  rejected: "destructive",
} as const;
