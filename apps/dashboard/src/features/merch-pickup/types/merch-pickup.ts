export type MerchPickupStatus = "picked_up" | "not_picked_up";

export type MerchPickupItem = {
  name: string;
  quantity: number;
  snapshotVariants: { label: string; type: string }[] | null;
};

export type MerchPickupOrder = {
  orderId: string;
  buyerName: string;
  buyerEmail: string;
  totalPrice: number;
  items: MerchPickupItem[];
  pickedUpAt: string | null;
  createdAt: string;
};
