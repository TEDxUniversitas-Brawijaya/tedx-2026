import { Button } from "@tedx-2026/ui/components/button";
import { cn } from "@tedx-2026/ui/lib/utils";
import type { BundleItem, Product } from "../../../types/product";

type BundleSelectionStepProps = {
  activeProduct: Product;
  quantity: number;
  actionLabel: string;
  selectedBundleProductIds: string[];
  selectedBundleVariantIds: string[];
  onBundleProductChange: (
    itemIdx: number,
    productId: string,
    bundleItem: BundleItem
  ) => void;
  onBundleVariantChange: (itemIdx: number, variantId: string) => void;
  onPay: () => void;
  getVariantLabel: (variantType?: string) => string;
};

export function BundleSelectionStep({
  activeProduct,
  quantity,
  actionLabel,
  selectedBundleProductIds,
  selectedBundleVariantIds,
  onBundleProductChange,
  onBundleVariantChange,
  onPay,
  getVariantLabel,
}: BundleSelectionStepProps) {
  return (
    <div className="flex max-h-[85vh] flex-col font-sans-2 text-white">
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-2 pt-10 pb-14 [scrollbar-color:rgba(224,224,224,0.35)_transparent] [scrollbar-width:thin] sm:pb-20 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/30 hover:[&::-webkit-scrollbar-thumb]:bg-white/45 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-1">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-white/5 bg-neutral-900 shadow-lg sm:h-32 sm:w-32 lg:w-2/5">
            <img
              alt={activeProduct.name}
              className="h-full w-full object-cover"
              height={160}
              src={activeProduct.imageUrl || undefined}
              width={160}
            />
          </div>

          <div className="min-w-0 flex-1 pt-1">
            <div className="flex items-start justify-between">
              <div className="space-y-0.5">
                <h1 className="text-base text-white md:text-base">
                  {activeProduct.name}
                </h1>
                <p className="font-normal text-2xl text-white-2 sm:text-2xl">
                  {activeProduct.price.toLocaleString("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    maximumFractionDigits: 0,
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {activeProduct.bundleItems?.map((bundleItem, idx) => {
            if (bundleItem.type !== "merchandise") {
              return null;
            }

            const selectedProdId = selectedBundleProductIds[idx];
            const selectedProd = bundleItem.products.find(
              (p) => p.id === selectedProdId
            );
            const categoryLabel =
              bundleItem.category.charAt(0).toUpperCase() +
              bundleItem.category.slice(1);

            return (
              <div
                className="space-y-4 sm:space-y-4"
                key={`${bundleItem.type}-${bundleItem.category}`}
              >
                <div className="mt-4">
                  <span className="text-sm text-white">
                    Variant {categoryLabel}{" "}
                    <span className="text-red-2">*</span>
                  </span>

                  <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
                    {bundleItem.products.map((product) => (
                      <button
                        className={cn(
                          "flex flex-col overflow-hidden rounded-lg border-[3px] bg-white p-2 transition-all",
                          selectedProdId === product.id
                            ? "border-[3px] border-red-2"
                            : "border-transparent"
                        )}
                        key={product.id}
                        onClick={() =>
                          onBundleProductChange(idx, product.id, bundleItem)
                        }
                        type="button"
                      >
                        <div className="aspect-square w-full overflow-hidden bg-neutral-200">
                          <img
                            alt={product.name}
                            className="h-full w-full object-cover"
                            height={72}
                            src={product.imageUrl || undefined}
                            width={72}
                          />
                        </div>
                        <div className="flex h-7 items-center justify-between px-2 font-medium text-[9px] text-black sm:h-8 sm:text-[10px]">
                          <span className="min-w-0 truncate">
                            {product.name}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {selectedProd?.variants && selectedProd.variants.length > 1 && (
                  <div className="space-y-1.5">
                    <span className="text-sm text-white">
                      {getVariantLabel(selectedProd.variants[0]?.type)}{" "}
                      <span className="text-red-2">*</span>
                    </span>
                    <div className="mt-2 grid w-full grid-cols-3 gap-2 sm:grid-cols-4">
                      {selectedProd.variants.map((v) => (
                        <button
                          className={cn(
                            "h-10 w-full rounded-lg border-[3px] px-2 font-semibold text-sm transition-all",
                            selectedBundleVariantIds[idx] === v.id
                              ? "border-red-2 bg-white text-black"
                              : "border-transparent bg-white text-[#ADADAD] hover:bg-neutral-100"
                          )}
                          key={v.id}
                          onClick={() => onBundleVariantChange(idx, v.id)}
                          type="button"
                        >
                          {v.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
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
              {(activeProduct.price * quantity).toLocaleString("id-ID", {
                style: "currency",
                currency: "IDR",
                maximumFractionDigits: 0,
              })}
            </p>
          </div>
          <Button
            className="h-12 w-1/2 rounded-xl bg-red-2 px-7 text-base text-white shadow-lg transition-all hover:bg-[#C01F1F] active:scale-95"
            onClick={onPay}
          >
            {actionLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
