// Ticket domain types: defines ticket products, buyer payload, and order response shapes.
export type TicketTab = "regular" | "bundling";

export type TicketProduct = {
  id: string;
  type: "ticket_regular" | "ticket_bundle" | "merch_bundle" | "merch_regular";
  name: string;
  price: number;
  stock: number | null;
  isActive: boolean;
  description: string | null;
  imageUrl: string | null;
  bundleItems?: Array<
    | {
        type: "ticket";
        productId: string;
        productName: string;
      }
    | {
        type: "merchandise";
        category: string;
        products: Array<{
          id: string;
          name: string;
          imageUrl: string | null;
          variants?: Array<{ id: string; type: string; label: string }>;
        }>;
      }
    | {
        type: "selectable_item";
        items: Array<
          | { type: "ticket"; productId: string; productName: string }
          | {
              type: "merchandise";
              category: string;
              products: Array<{
                id: string;
                name: string;
                imageUrl: string | null;
                variants?: Array<{ id: string; type: string; label: string }>;
              }>;
            }
        >;
      }
  >;
};

export type TicketBuyer = {
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  buyerInstansi: string;
};

export type TicketOrder = {
  orderId: string;
  status: "pending_payment" | "pending_verification";
  totalPrice: number;
  expiresAt: string;
  payment:
    | {
        qrisUrl: string;
        midtransOrderId: string;
      }
    | {
        uploadUrl: string;
      };
};
