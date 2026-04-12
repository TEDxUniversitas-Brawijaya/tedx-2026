import { useState, useMemo, useEffect } from "react";
import type { BundleItem, Product } from "../../../types/product";
import { useCartStore } from "../../../store/cart-store";
import { useMerchProductsQuery } from "../../../hooks/use-merch-products-query";
import { RegularSelectionStep } from "./regular-selection-step";
import { BundleSelectionStep } from "./bundle-selection-step";

export function SelectionStep() {
  const {
    activeProduct,
    editingItemId,
    items,
    addItem,
    removeItem,
    updateItem,
    setStep,
  } = useCartStore();

  const editingItem = editingItemId
    ? items.find((item) => item.id === editingItemId)
    : null;

  const existingItem = activeProduct
    ? items.find((item) => item.id === activeProduct.id)
    : null;

  const [quantity, setQuantity] = useState(editingItem?.quantity ?? 1);

  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    editingItem?.selectedVariantIds?.[0] ??
      activeProduct?.variants?.[0]?.id ??
      ""
  );

  const initialBundleProductIds = useMemo(() => {
    if (editingItem?.selectedBundleProductIds) {
      return editingItem.selectedBundleProductIds;
    }
    return (
      activeProduct?.bundleItems?.map((item) => {
        if (item.type === "merchandise") {
          return item.products[0]?.id ?? "";
        }
        return "";
      }) ?? []
    );
  }, [activeProduct, editingItem?.selectedBundleProductIds]);

  const [selectedBundleProductIds, setSelectedBundleProductIds] = useState<
    string[]
  >(initialBundleProductIds);

  const [selectedBundleVariantIds, setSelectedBundleVariantIds] = useState<
    string[]
  >(
    editingItem?.selectedVariantIds ??
      activeProduct?.bundleItems?.map((item, idx) => {
        if (item.type === "merchandise") {
          const productId = initialBundleProductIds[idx];
          const product = item.products.find((p) => p.id === productId);
          return product?.variants?.[0]?.id ?? "";
        }
        return "";
      }) ??
      []
  );

  const { data: allMerchs = [] } = useMerchProductsQuery();

  const categorySiblings = useMemo(() => {
    if (!activeProduct || activeProduct.type === "merch_bundle") {
      return [];
    }
    return allMerchs.filter(
      (p) => p.category === activeProduct.category && p.type === "merch_regular"
    );
  }, [allMerchs, activeProduct]);

  useEffect(() => {
    if (activeProduct && activeProduct.type === "merch_regular") {
      setSelectedVariantId(
        editingItem?.selectedVariantIds?.[0] ??
          activeProduct.variants?.[0]?.id ??
          ""
      );
    }
  }, [activeProduct, editingItem]);

  if (!activeProduct) {
    return null;
  }

  const isBundling = activeProduct.type === "merch_bundle";

  const handlePay = () => {
    const variantIds = isBundling
      ? selectedBundleVariantIds
      : [selectedVariantId];
    const bundleIds = isBundling ? selectedBundleProductIds : undefined;
    const shouldReplace =
      editingItemId !== null && editingItemId !== activeProduct.id;

    if (shouldReplace) {
      removeItem(editingItemId);
      addItem(activeProduct, quantity, variantIds, bundleIds);
      setStep("cart");
      return;
    }

    const targetId = editingItemId ?? activeProduct.id;
    if (editingItemId || existingItem) {
      updateItem(targetId, quantity, variantIds, bundleIds);
    } else {
      addItem(activeProduct, quantity, variantIds, bundleIds);
    }

    setStep("cart");
  };

  const handleProductSwitch = (newProduct: Product) => {
    useCartStore.setState({ activeProduct: newProduct });
  };

  const handleBundleProductChange = (
    itemIdx: number,
    productId: string,
    bundleItem: BundleItem
  ) => {
    const newProductIds = [...selectedBundleProductIds];
    newProductIds[itemIdx] = productId;
    setSelectedBundleProductIds(newProductIds);

    if (bundleItem.type === "merchandise") {
      const product = bundleItem.products.find((p) => p.id === productId);
      const newVariantIds = [...selectedBundleVariantIds];
      newVariantIds[itemIdx] = product?.variants?.[0]?.id ?? "";
      setSelectedBundleVariantIds(newVariantIds);
    }
  };

  const handleBundleVariantChange = (itemIdx: number, variantId: string) => {
    const newVariantIds = [...selectedBundleVariantIds];
    newVariantIds[itemIdx] = variantId;
    setSelectedBundleVariantIds(newVariantIds);
  };

  const getVariantLabel = (variantType?: string) => {
    if (variantType === "color") {
      return "Warna";
    }
    return "Ukuran";
  };

  const selectedVariantLabel =
    activeProduct.variants?.find((variant) => variant.id === selectedVariantId)
      ?.label ?? "Pilih Ukuran";

  const shouldShowConfirmationLabel = Boolean(editingItemId);
  const actionLabel = shouldShowConfirmationLabel ? "Konfirmasi" : "Bayar";

  return isBundling ? (
    <BundleSelectionStep
      actionLabel={actionLabel}
      activeProduct={activeProduct}
      getVariantLabel={getVariantLabel}
      onBundleProductChange={handleBundleProductChange}
      onBundleVariantChange={handleBundleVariantChange}
      onPay={handlePay}
      quantity={quantity}
      selectedBundleProductIds={selectedBundleProductIds}
      selectedBundleVariantIds={selectedBundleVariantIds}
    />
  ) : (
    <RegularSelectionStep
      actionLabel={actionLabel}
      activeProduct={activeProduct}
      categorySiblings={categorySiblings}
      onPay={handlePay}
      onProductSwitch={handleProductSwitch}
      onQuantityChange={setQuantity}
      onVariantChange={setSelectedVariantId}
      quantity={quantity}
      selectedVariantId={selectedVariantId}
      selectedVariantLabel={selectedVariantLabel}
    />
  );
}
