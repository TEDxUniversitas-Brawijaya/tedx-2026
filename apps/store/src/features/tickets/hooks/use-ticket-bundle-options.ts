import { useMemo } from "react";
import type { TicketProduct } from "../types/ticket";

export type TicketBundleOption = {
  id: string;
  label: string;
};

export const useTicketBundleOptions = (product: TicketProduct | null) => {
  return useMemo(() => {
    if (!product?.bundleItems) {
      return [];
    }

    const selectable = product.bundleItems.find(
      (item) => item.type === "selectable_item"
    );
    if (!selectable || selectable.type !== "selectable_item") {
      return [];
    }

    return selectable.items.flatMap((item) => {
      if (item.type === "ticket") {
        return [
          {
            id: item.productId,
            label: item.product.name,
          },
        ];
      }

      return item.products.map((productItem) => ({
        id: productItem.id,
        label: productItem.name,
      }));
    });
  }, [product]);
};
