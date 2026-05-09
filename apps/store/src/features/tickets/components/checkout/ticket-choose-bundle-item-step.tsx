import { capitalize } from "@/shared/lib/string";
import { Button } from "@tedx-2026/ui/components/button";
import { cn } from "@tedx-2026/ui/lib/utils";
import { useTicketCheckoutStore } from "../../stores/use-ticket-checkout-store";
import type { CartItem } from "../../types/checkout";
import type { MerchProduct } from "../../types/ticket";

type Props = {
  selectedProduct: CartItem;
};

export const TicketChooseBundleItemStep = ({ selectedProduct }: Props) => {
  const { setSelectedProduct, onNextStep, onPrevStep } =
    useTicketCheckoutStore();

  const onBundleProductSelect = (
    product: MerchProduct,
    bundleCategory: string
  ) => {
    const alreadySelected = selectedProduct.selectedBundleProducts?.find(
      (p) => p.productId === product.id
    );
    if (alreadySelected) {
      // No need to do anything if the user selects the same product that's already selected
      return;
    }

    setSelectedProduct({
      ...selectedProduct,
      selectedBundleProducts: selectedProduct.selectedBundleProducts?.map(
        (bundleProduct) => {
          if (bundleProduct.category !== bundleCategory) {
            return bundleProduct;
          }

          return {
            productId: product.id,
            category: bundleCategory,
            product: {
              name: product.name,
            },
          };
        }
      ),
    });
  };

  return (
    <div className="flex max-h-[85vh] flex-col font-sans-2 text-white">
      <div className="no-scrollbar flex-1 overflow-y-auto overflow-x-hidden px-2 pb-14">
        <div className="space-y-4 sm:space-y-6">
          {selectedProduct.bundleItems?.map((item) => {
            if (
              item.type === "ticket" ||
              item.type === "selectable_item" ||
              item.type === "merchandise_product"
            ) {
              return null;
            }

            const product = selectedProduct.selectedBundleProducts?.find(
              (p) => p.category === item.category
            );
            if (!product) {
              return null;
            }

            return (
              <div
                className="space-y-4 sm:space-y-4"
                key={`${item.type}-${item.category}`}
              >
                <div className="mt-4">
                  <span className="text-sm text-white">
                    Variant {capitalize(item.category)}{" "}
                    <span className="text-red-2">*</span>
                  </span>

                  <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
                    {item.products.map((product) => {
                      const selectedBundleProduct =
                        selectedProduct.selectedBundleProducts?.find(
                          (p) => p.productId === product.id
                        );

                      return (
                        <button
                          className={cn(
                            "flex flex-col overflow-hidden rounded-lg border-[3px] bg-white p-2 transition-all",
                            selectedBundleProduct?.productId === product.id
                              ? "border-[3px] border-red-2"
                              : "border-transparent"
                          )}
                          key={product.id}
                          onClick={() => {
                            onBundleProductSelect(product, item.category);
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
              </div>
            );
          })}
        </div>
      </div>

      <div className="sticky bottom-0 bg-black px-2 pt-1.5 pb-1.5">
        <div className="flex flex-row items-center justify-between gap-2 text-gray-2">
          <Button
            className="flex-1"
            onClick={onPrevStep}
            size="checkout"
            variant="store-secondary"
          >
            Kembali
          </Button>
          <Button
            className="flex-1"
            onClick={onNextStep}
            size="checkout"
            variant="store-primary"
          >
            Lanjut
          </Button>
        </div>
      </div>
    </div>
  );
};
