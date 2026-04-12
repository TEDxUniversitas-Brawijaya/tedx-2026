import type { SelectionStepViewProps } from "@/features/merchandise/types/merch-view";
import { RegularSelectionStep } from "./regular-selection-step";
import { BundleSelectionStep } from "./bundle-selection-step";

const getVariantLabel = (variantType?: string) => {
  if (variantType === "color") {
    return "Warna";
  }

  return "Ukuran";
};

export function SelectionStep({
  actionLabel,
  activeProduct,
  categorySiblings,
  isBundling,
  onBundleProductChange,
  onBundleVariantChange,
  onPay,
  onProductSwitch,
  onQuantityChange,
  onVariantChange,
  quantity,
  selectedBundleProductIds,
  selectedBundleVariantIds,
  selectedVariantId,
  selectedVariantLabel,
}: SelectionStepViewProps) {
  return isBundling ? (
    <BundleSelectionStep
      actionLabel={actionLabel}
      activeProduct={activeProduct}
      getVariantLabel={getVariantLabel}
      onBundleProductChange={onBundleProductChange}
      onBundleVariantChange={onBundleVariantChange}
      onPay={onPay}
      quantity={quantity}
      selectedBundleProductIds={selectedBundleProductIds}
      selectedBundleVariantIds={selectedBundleVariantIds}
    />
  ) : (
    <RegularSelectionStep
      actionLabel={actionLabel}
      activeProduct={activeProduct}
      categorySiblings={categorySiblings}
      onPay={onPay}
      onProductSwitch={onProductSwitch}
      onQuantityChange={onQuantityChange}
      onVariantChange={onVariantChange}
      quantity={quantity}
      selectedVariantId={selectedVariantId}
      selectedVariantLabel={selectedVariantLabel}
    />
  );
}
