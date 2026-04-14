type ProductCategory =
  | "t-shirt"
  | "workshirt"
  | "stickers"
  | "socks"
  | "keychain"
  | "hat";

export type Product = {
  id: string;
  type: "ticket_regular" | "ticket_bundle" | "merch_regular" | "merch_bundle";
  name: string;
  description: string | null;
  price: number; // IDR, no decimals
  stock: number | null; // tickets only; null for merch (pre-order)
  isActive: boolean; // active means visible on the storefront and can be purchased
  imageUrl: string | null;
  category: ProductCategory | null;
  variants:
    | {
        id: string; // e.g. var_x
        type: string; // e.g. size, color
        label: string; // e.g. M, Red
      }[]
    | null;
  bundleItems:
    | (
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
            category: ProductCategory;
            products: {
              id: string;
              name: string;
              imageUrl: string | null;
              variants:
                | {
                    id: string; // e.g. var_x
                    type: string; // e.g. size, color
                    label: string; // e.g. M, Red
                  }[]
                | null;
            }[];
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
                  category: ProductCategory;
                  products: {
                    id: string;
                    name: string;
                    imageUrl: string | null;
                    variants:
                      | {
                          id: string; // e.g. var_x
                          type: string; // e.g. size, color
                          label: string; // e.g. M, Red
                        }[]
                      | null;
                  }[];
                }
            )[];
          }
      )[]
    | null;
  createdAt: Date;
  updatedAt: Date;
};
