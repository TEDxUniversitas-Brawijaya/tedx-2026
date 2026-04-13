import { useState } from "react";
import { useCartStore } from "../stores/use-cart-store";
import type { CartItem } from "../types/cart";
import type { Product } from "../types/product";

export function useRegularSelectionItem(selectedItem: CartItem) {
  const { addItem, selectionStepMode, updateItem } = useCartStore();
  const [item, setItem] = useState(selectedItem);

  const onChangeQuantity = (quantity: number) => {
    setItem((prev) => ({ ...prev, quantity }));
  };

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

  const onProductSwitch = (product: Product) => {
    const isProductAlreadySelected = item.id === product.id;
    // No need to do anything if the user selects the same product that's already selected
    if (isProductAlreadySelected) {
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
      ...product,
      selectedVariants: defaultVariantSelection,
      itemId: `${product.id}-${Date.now()}`, // Unique item ID for cart management
      quantity: prev.quantity, // Keep the same quantity when switching products
    }));
  };

  const onVariantChange = (
    type: string,
    variantId: string,
    variants: Product["variants"]
  ) => {
    const selectedVariant = variants?.find((v) => v.id === variantId);
    if (!selectedVariant) {
      return;
    }

    setItem((prev) => ({
      ...prev,
      // Replace existing variant of the same type with the new one
      // Or add the new variant if it doesn't exist
      selectedVariants: [
        ...(prev.selectedVariants?.filter((v) => v.type !== type) || []),
        selectedVariant,
      ],
    }));
  };

  return {
    item,
    onChangeQuantity,
    onAddItem,
    onProductSwitch,
    onVariantChange,
  };
}
