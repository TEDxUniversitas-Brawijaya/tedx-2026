export type BundleItem =
  | {
      type: "ticket";
      productId: string;
      productName: string;
    }
  | {
      type: "merchandise";
      category:
        | "t-shirt"
        | "workshirt"
        | "stickers"
        | "socks"
        | "keychain"
        | "hat";
      products: {
        id: string;
        name: string;
        imageUrl: string | null;
        variants?: {
          id: string;
          label: string;
          type: string;
        }[];
      }[];
    }
  | {
      type: "selectable_item";
      items: (
        | { productId: string; productName: string }
        | {
            category:
              | "t-shirt"
              | "workshirt"
              | "stickers"
              | "socks"
              | "keychain"
              | "hat";
            products: {
              id: string;
              name: string;
              imageUrl: string | null;
              variants?: {
                id: string;
                label: string;
                type: string;
              }[];
            }[];
          }
      )[];
    };

export type Product = {
  id: string;
  type: "ticket_regular" | "ticket_bundle" | "merch_bundle" | "merch_regular";
  name: string;
  price: number;
  imageUrl?: string | null;
  variants?: {
    id: string;
    label: string;
    type: string;
  }[];
  category?:
    | "t-shirt"
    | "workshirt"
    | "stickers"
    | "socks"
    | "keychain"
    | "hat";
  bundleItems?: BundleItem[];
};
