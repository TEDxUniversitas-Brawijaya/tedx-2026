import { capitalize } from "@/shared/lib/string";
import { Button } from "@tedx-2026/ui/components/button";
import { cn } from "@tedx-2026/ui/lib/utils";
import { useBundleSelectionItem } from "../../../hooks/use-bundle-selection-item";
import { formatIdrCurrency } from "../../../lib/formatter";
import { groupVariantsByType } from "../../../lib/variant";
import { useCartStore } from "../../../stores/use-cart-store";
import type { CartItem } from "../../../types/cart";
import { SizeChartDialog } from "../../size-chart-dialog";

type BundleSelectionStepProps = {
  selectedItem: CartItem;
};

export function BundleSelectionStep({
  selectedItem,
}: BundleSelectionStepProps) {
  const { selectionStepMode } = useCartStore();

  const {
    item,
    onAddItem,
    onBundleProductSelect,
    onBundleVariantChange,
    onBundleItemVariantChange,
  } = useBundleSelectionItem(selectedItem);

  return (
    <div className="flex max-h-[85vh] flex-col font-sans-2 text-white">
      <div className="no-scrollbar flex-1 overflow-y-auto overflow-x-hidden px-2 pt-10 pb-14">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="size-24 shrink-0 overflow-hidden rounded-2xl border border-white/5 bg-neutral-900 shadow-lg sm:h-32 sm:w-32 lg:w-2/5">
            {item.imageUrl ? (
              <img
                alt={item.name}
                className="h-full w-full object-cover"
                height={160}
                src={item.imageUrl}
                width={160}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-neutral-300 text-center text-neutral-600">
                <span className="font-sans-2 text-sm">
                  Gambar tidak tersedia
                </span>
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1 pt-1">
            <div className="flex items-start justify-between">
              <div className="space-y-0.5">
                <h1 className="text-base text-white md:text-base">
                  {item.name}
                </h1>
                <p className="font-normal text-2xl text-white-2 sm:text-2xl">
                  {formatIdrCurrency(item.price)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {selectedItem.bundleItems?.map((bundleItem) => {
            // In this flow, there will be no non-merchandise (ticket or selectable_item) bundle items, so we can skip rendering for them
            if (
              bundleItem.type !== "merchandise" &&
              bundleItem.type !== "merchandise_product"
            ) {
              return null;
            }

            if (bundleItem.type === "merchandise_product") {
              const product = item.selectedBundleProducts?.find(
                (p) => p.id === bundleItem.productId
              );
              if (!product) {
                return null;
              }
              const variantItems = groupVariantsByType(product.variants);

              const selectedBundleProduct = item.selectedBundleProducts?.find(
                (p) => p.id === product.id
              );

              return (
                <div
                  className="space-y-4 sm:space-y-4"
                  key={`${bundleItem.type}-${bundleItem.productId}`}
                >
                  <div className="mt-4">
                    <span className="text-sm text-white">
                      {product.name}
                      <span className="text-red-2">*</span>
                    </span>

                    <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
                      <button
                        className={cn(
                          "flex flex-col overflow-hidden rounded-lg border-[3px] bg-white p-2 transition-all",
                          selectedBundleProduct?.id === product.id
                            ? "border-[3px] border-red-2"
                            : "border-transparent"
                        )}
                        key={product.id}
                        onClick={() => {
                          // we cant select other products since this is a merchandise_product type, so this button just serves as a non-interactive display of the selected product
                          return;
                        }}
                        type="button"
                      >
                        <div className="aspect-square w-full overflow-hidden bg-neutral-200">
                          {product.imageUrl ? (
                            <img
                              alt={product.name}
                              className="h-full w-full object-cover"
                              height={72}
                              src={product.imageUrl}
                              width={72}
                            />
                          ) : (
                            <div className="flex aspect-square h-full w-full items-center justify-center bg-neutral-300 text-center text-neutral-600">
                              <span className="font-sans-2 text-sm">
                                Gambar tidak tersedia
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex h-7 items-center justify-between px-2 font-medium text-[9px] text-black sm:h-8 sm:text-[10px]">
                          <span className="min-w-0 truncate">
                            {product.name}
                          </span>
                        </div>
                      </button>
                    </div>
                  </div>

                  {variantItems?.map((variantGroup) => {
                    const selectedBundleProduct =
                      item.selectedBundleProducts?.find(
                        (p) => p.id === product?.id
                      );
                    const selectedVariant =
                      selectedBundleProduct?.selectedVariants?.find(
                        (v) => v.type === variantGroup.type
                      );

                    return (
                      <div className="space-y-1.5" key={variantGroup.type}>
                        <span className="flex items-center gap-1.5 text-sm text-white">
                          {capitalize(variantGroup.type)}{" "}
                          <span className="text-red-2">*</span>
                          {variantGroup.type === "size" &&
                            product?.category && (
                              <SizeChartDialog category={product.category} />
                            )}
                        </span>
                        <div className="mt-2 grid w-full grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
                          {variantGroup.variants.map((variant) => (
                            <button
                              className={cn(
                                "h-10 w-full rounded-lg border-[3px] px-2 font-semibold text-sm transition-all",
                                selectedVariant?.id === variant.id
                                  ? "border-red-2 bg-white text-black"
                                  : "border-transparent bg-white text-[#ADADAD] hover:bg-neutral-100"
                              )}
                              key={variant.id}
                              onClick={() => {
                                onBundleItemVariantChange(
                                  product.id,
                                  variantGroup.type,
                                  variant
                                );
                              }}
                              type="button"
                            >
                              {variant.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            }

            const product = item.selectedBundleProducts?.find(
              (p) => p.category === bundleItem.category
            );
            if (!product) {
              return null;
            }
            const variantItems = groupVariantsByType(product.variants);

            return (
              <div
                className="space-y-4 sm:space-y-4"
                key={`${bundleItem.type}-${bundleItem.category}`}
              >
                <div className="mt-4">
                  <span className="text-sm text-white">
                    Variant {capitalize(bundleItem.category)}{" "}
                    <span className="text-red-2">*</span>
                  </span>

                  <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
                    {bundleItem.products.map((product) => {
                      const selectedBundleProduct =
                        item.selectedBundleProducts?.find(
                          (p) => p.id === product.id
                        );

                      return (
                        <button
                          className={cn(
                            "flex flex-col overflow-hidden rounded-lg border-[3px] bg-white p-2 transition-all",
                            selectedBundleProduct?.id === product.id
                              ? "border-[3px] border-red-2"
                              : "border-transparent"
                          )}
                          key={product.id}
                          onClick={() => {
                            onBundleProductSelect(product, bundleItem.category);
                          }}
                          type="button"
                        >
                          <div className="aspect-square w-full overflow-hidden bg-neutral-200">
                            {product.imageUrl ? (
                              <img
                                alt={product.name}
                                className="h-full w-full object-cover"
                                height={72}
                                src={product.imageUrl}
                                width={72}
                              />
                            ) : (
                              <div className="flex aspect-square h-full w-full items-center justify-center bg-neutral-300 text-center text-neutral-600">
                                <span className="font-sans-2 text-sm">
                                  Gambar tidak tersedia
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="flex h-7 items-center justify-between px-2 font-medium text-[9px] text-black sm:h-8 sm:text-[10px]">
                            <span className="min-w-0 truncate">
                              {product.name}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {variantItems?.map((variantGroup) => {
                  const selectedBundleProduct =
                    item.selectedBundleProducts?.find(
                      (p) => p.id === product.id
                    );
                  const selectedVariant =
                    selectedBundleProduct?.selectedVariants?.find(
                      (v) => v.type === variantGroup.type
                    );

                  return (
                    <div className="space-y-1.5" key={variantGroup.type}>
                      <span className="flex items-center gap-1.5 text-sm text-white">
                        {capitalize(variantGroup.type)}{" "}
                        <span className="text-red-2">*</span>
                        {variantGroup.type === "size" && product?.category && (
                          <SizeChartDialog category={product.category} />
                        )}
                      </span>
                      <div className="mt-2 grid w-full grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
                        {variantGroup.variants.map((variant) => (
                          <button
                            className={cn(
                              "h-10 w-full rounded-lg border-[3px] px-2 font-semibold text-sm transition-all",
                              selectedVariant?.id === variant.id
                                ? "border-red-2 bg-white text-black"
                                : "border-transparent bg-white text-[#ADADAD] hover:bg-neutral-100"
                            )}
                            key={variant.id}
                            onClick={() => {
                              onBundleVariantChange(
                                bundleItem.category,
                                variantGroup.type,
                                variant
                              );
                            }}
                            type="button"
                          >
                            {variant.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      <div className="sticky bottom-0 bg-black px-2 pt-1.5 pb-1.5">
        <div className="flex items-center justify-between text-gray-2">
          <div>
            <p className="text-sm md:text-base">Harga Total</p>
            <p className="text-sm md:text-base">
              {formatIdrCurrency(selectedItem.price * selectedItem.quantity)}
            </p>
          </div>
          <Button
            className="h-12 w-1/2 rounded-xl bg-red-2 px-7 text-base text-white shadow-lg transition-all hover:bg-[#C01F1F] active:scale-95"
            onClick={onAddItem}
          >
            {selectionStepMode === "add" ? "Bayar" : "Konfirmasi"}
          </Button>
        </div>
      </div>
    </div>
  );
}
