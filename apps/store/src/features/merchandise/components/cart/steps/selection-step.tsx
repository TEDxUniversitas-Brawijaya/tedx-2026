import { trpc } from "@/shared/lib/trpc";
import { useQuery } from "@tanstack/react-query";
import type { CartItem } from "../../../types/cart";
import { BundleSelectionStep } from "./bundle-selection-step";
import { RegularSelectionStep } from "./regular-selection-step";

export function SelectionStep({ selectedItem }: { selectedItem: CartItem }) {
  const { data } = useQuery(trpc.merch.listProducts.queryOptions({}));

  const isBundling = selectedItem.type === "merch_bundle";
  if (isBundling) {
    return <BundleSelectionStep selectedItem={selectedItem} />;
  }

  const getCategorySiblings = () => {
    if (!data) {
      return [];
    }

    return data.filter(
      (product) =>
        product.category === selectedItem.category &&
        product.type === "merch_regular"
    );
  };

  const categorySiblings = getCategorySiblings();

  return (
    <RegularSelectionStep
      categorySiblings={categorySiblings}
      selectedItem={selectedItem}
    />
  );
}
