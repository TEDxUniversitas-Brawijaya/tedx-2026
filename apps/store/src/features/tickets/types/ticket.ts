export type TicketTab = "regular" | "bundling";

export type ProductVariant = {
  id: string;
  type: string;
  label: string;
};

export type MerchProduct = {
  id: string;
  name: string;
  imageUrl: string | null;
  variants: ProductVariant[] | null;
};

export type MerchCategory =
  | "t-shirt"
  | "workshirt"
  | "stickers"
  | "socks"
  | "keychain"
  | "hat";

export type BundleItem =
  | {
      type: "ticket";
      productId: string;
      product: {
        id: string;
        name: string;
      };
    }
  | {
      type: "merchandise";
      category: MerchCategory;
      products: MerchProduct[];
    }
  | {
      type: "selectable_item";
      items: (
        | {
            type: "ticket";
            productId: string;
            product: {
              id: string;
              name: string;
            };
          }
        | {
            type: "merchandise";
            category: MerchCategory;
            products: MerchProduct[];
          }
      )[];
    };

export type TicketProduct = {
  id: string;
  type: "ticket_regular" | "ticket_bundle" | "merch_bundle" | "merch_regular";
  name: string;
  price: number;
  stock: number | null;
  isActive: boolean;
  description: string | null;
  imageUrl: string | null;
  bundleItems?: BundleItem[];
};

export type TicketBuyer = {
  buyerName: string;
  buyerEmail: string;
  phone: string;
  buyerInstansi: string;
};

export type TicketPaymentMidtrans = {
  type: "midtrans";
  qrisUrl: string;
  midtransOrderId: string;
};

export type TicketPaymentManual = {
  type: "manual";
  uploadUrl: string;
};

export type TicketPayment = TicketPaymentMidtrans | TicketPaymentManual;

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
