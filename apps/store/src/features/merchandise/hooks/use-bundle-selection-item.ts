import { useState } from "react";
import { useCartStore } from "../stores/use-cart-store";
import type { CartItem } from "../types/cart";
import type { MerchProduct, ProductVariant } from "../types/product";

export function useBundleSelectionItem(selectedItem: CartItem) {
  const { addItem, selectionStepMode, updateItem } = useCartStore();
  const [item, setItem] = useState(selectedItem);

  const onAddItem = () => {
    if (selectionStepMode === "add") {
      addItem(item);
      return;
    }

    if (selectionStepMode === "edit") {
      updateItem(selectedItem.itemId, item);
      return;
    }
  };

  const onBundleProductSelect = (
    product: MerchProduct,
    bundleCategory: string
  ) => {
    const isProductAlreadySelected = item.selectedBundleProducts?.find(
      (p) => p.id === product.id
    );
    if (isProductAlreadySelected) {
      // No need to do anything if the user selects the same product that's already selected
      return;
    }

    // We need to find the default variant because
    // even though the products are in the same category, they might have different variants (e.g. different sizes)
    const variantSet = new Set<string>();
    const defaultVariantSelection = product.variants
      ?.filter((v) => {
        if (variantSet.has(v.type)) {
          return false;
        }

        variantSet.add(v.type);

        return true;
      })
      .map((v) => ({
        id: v.id,
        label: v.label,
        type: v.type,
      }));

    setItem((prev) => ({
      ...prev,
      selectedBundleProducts: prev.selectedBundleProducts?.map(
        (bundleProduct) => {
          if (bundleProduct.category !== bundleCategory) {
            return bundleProduct;
          }

          return {
            ...product,
            category: bundleCategory,
            selectedVariants: defaultVariantSelection,
          };
        }
      ),
    }));
  };

  const onBundleVariantChange = (
    bundleCategory: string,
    variantType: string,
    variant: ProductVariant
  ) => {
    const newSelectedBundleProducts = item.selectedBundleProducts?.map(
      (bundleProduct) => {
        if (bundleProduct.category !== bundleCategory) {
          return bundleProduct;
        }

        const newSelectedVariants = bundleProduct.selectedVariants?.map((v) => {
          if (v.type !== variantType) {
            return v;
          }

          return variant;
        });

        return {
          ...bundleProduct,
          selectedVariants: newSelectedVariants,
        };
      }
    );

    setItem((prev) => ({
      ...prev,
      selectedBundleProducts: newSelectedBundleProducts,
    }));
  };

  return {
    item,
    onAddItem,
    onBundleProductSelect,
    onBundleVariantChange,
  };
}
