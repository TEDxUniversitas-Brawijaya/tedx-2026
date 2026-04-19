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
  variants: ProductVariant[] | null;
};

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
    }
  | {
      type: "merchandise_product";
      productId: string;
      product: MerchProduct;
    };

export type Product = {
  id: string;
  type: "ticket_regular" | "ticket_bundle" | "merch_bundle" | "merch_regular";
  name: string;
  price: number;
  imageUrl: string | null;
  variants: ProductVariant[] | null;
  category: MerchCategory | null;
  bundleItems: BundleItem[] | null;
};
