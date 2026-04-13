export type ProductVariant = {
  id: string;
  label: string;
  type: string;
};

export type MerchCategory =
  | "t-shirt"
  | "workshirt"
  | "stickers"
  | "socks"
  | "keychain"
  | "hat";

export type MerchProduct = {
  id: string;
  name: string;
  imageUrl: string | null;
  variants?: ProductVariant[];
};

export type BundleItem =
  | {
      type: "ticket";
      productId: string;
      productName: string;
    }
  | {
      type: "merchandise";
      category: MerchCategory;
      products: MerchProduct[];
    }
  | {
      type: "selectable_item";
      items: (
        | { productId: string; productName: string; type: "ticket" }
        | {
            type: "merchandise";
            category: MerchCategory;
            products: MerchProduct[];
          }
      )[];
    };

export type Product = {
  id: string;
  type: "ticket_regular" | "ticket_bundle" | "merch_bundle" | "merch_regular";
  name: string;
  price: number;
  imageUrl?: string | null;
  variants?: ProductVariant[];
  category?: MerchCategory;
  bundleItems?: BundleItem[];
};
