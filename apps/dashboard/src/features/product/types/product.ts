// Product type matching the admin.product.list tRPC output
export type Product = {
  id: string;
  type: "ticket_regular" | "ticket_bundle" | "merch_regular" | "merch_bundle";
  name: string;
  description: string | null;
  price: number;
  stock: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type TicketProductType = "ticket_regular" | "ticket_bundle";
