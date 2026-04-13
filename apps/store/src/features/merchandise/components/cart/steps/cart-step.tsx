import { Button } from "@tedx-2026/ui/components/button";
import {
  DialogClose,
  DialogHeader,
  DialogTitle,
} from "@tedx-2026/ui/components/dialog";
import { ChevronDownIcon, MinusIcon, PlusIcon } from "lucide-react";
import { capitalize } from "../../../../../shared/lib/string";
import { formatIdrCurrency } from "../../../lib/formatter";
import { useCartStore } from "../../../stores/use-cart-store";

export function CartStep() {
  const {
    items,
    updateQuantity,
    getTotalPrice,
    onNextStep,
    onPrevStep,
    openSelectionStep,
  } = useCartStore();
  const totalPrice = getTotalPrice();

  return (
    <div className="flex max-h-[80vh] flex-col">
      <DialogHeader>
        <DialogTitle className="font-normal font-serif-2 text-xl sm:text-2xl">
          Cart
        </DialogTitle>
      </DialogHeader>

      <div className="no-scrollbar mt-6 space-y-4 overflow-x-hidden overflow-y-scroll px-1 pb-2 sm:mt-8 sm:space-y-6 sm:px-2 sm:pb-3">
        {items.length === 0 ? (
          <div className="py-10 text-center text-gray-2">
            Your cart is empty
          </div>
        ) : (
          items.map((item) => (
            <div
              className="flex items-center gap-3 border-white/10 border-b pb-4 last:border-b-0 last:pb-0 sm:gap-6 sm:pb-6"
              key={item.itemId}
            >
              <div className="size-20 shrink-0 overflow-hidden rounded-xl bg-neutral-200 sm:h-32 sm:w-32 sm:rounded-2xl">
                {item.imageUrl ? (
                  <img
                    alt={item.name}
                    className="h-full w-full object-cover"
                    height={400}
                    src={item.imageUrl}
                    width={400}
                  />
                ) : (
                  <div className="flex aspect-square h-full w-full items-center justify-center bg-neutral-300 text-center text-neutral-600">
                    <span className="font-sans-2 text-sm">
                      Gambar tidak tersedia
                    </span>
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1 font-sans-2">
                <div>
                  <h4 className="truncate text-sm text-white sm:text-base">
                    {item.name}
                  </h4>
                  <p className="truncate text-base text-white-2 sm:text-xl">
                    {formatIdrCurrency(item.price)}
                  </p>
                </div>

                <div className="flex items-start justify-between gap-2 pt-2 font-sans-2">
                  <div className="w-[46%] min-w-0 sm:w-3/5">
                    {(item.type === "merch_bundle" ||
                      (item.variants && item.variants.length > 0)) && (
                      <button
                        className="flex h-fit min-h-6 w-full cursor-pointer items-center justify-between rounded-md border border-white/10 bg-white px-1.5 text-[8px] text-black sm:min-h-10 sm:rounded-lg sm:px-3 sm:text-xs"
                        onClick={() => openSelectionStep(item, "edit")}
                        type="button"
                      >
                        <span className="text-left">
                          {/* TODO: Implement proper variant display */}
                          {item.selectedBundleProducts
                            ?.map(
                              (p) =>
                                `${p.name} (${p.selectedVariants?.map((v) => `${capitalize(v.type)}: ${capitalize(v.label)}`).join(", ")})`
                            )
                            .join(", ") ||
                            item.selectedVariants
                              ?.map(
                                (v) =>
                                  `${capitalize(v.type)}: ${capitalize(v.label)}`
                              )
                              .join(", ") ||
                            "Pilih variant"}
                        </span>
                        <ChevronDownIcon
                          className="shrink-0 sm:size-3.5"
                          size={9}
                        />
                      </button>
                    )}
                  </div>

                  <div className="flex w-[54%] items-center justify-end gap-1 px-0 py-1 sm:w-2/5 sm:gap-2 sm:px-2 sm:py-1">
                    <button
                      className="p-1 text-white hover:text-white"
                      onClick={() =>
                        updateQuantity(item.itemId, item.quantity - 1)
                      }
                      type="button"
                    >
                      <MinusIcon size={16} />
                    </button>
                    <span className="w-5 text-center text-sm sm:w-6 sm:text-sm">
                      {item.quantity}
                    </span>
                    <button
                      className="p-1 text-white hover:text-white"
                      onClick={() =>
                        updateQuantity(item.itemId, item.quantity + 1)
                      }
                      type="button"
                    >
                      <PlusIcon size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="sticky bottom-0 z-10 bg-black pt-4 font-sans-2">
        <div className="mb-4 flex items-center justify-between sm:mb-6">
          <span className="text-gray-2 text-sm sm:text-base">Harga Total</span>
          <span className="text-gray-2 text-sm sm:text-base">
            {formatIdrCurrency(totalPrice)}
          </span>
        </div>
        <div className="flex gap-2 sm:gap-4">
          <DialogClose
            render={
              <Button
                className="w-full flex-1"
                onClick={onPrevStep}
                size="checkout"
                variant="store-secondary"
              />
            }
          >
            Batal
          </DialogClose>
          <Button
            className="flex-1"
            disabled={items.length === 0}
            onClick={onNextStep}
            size="checkout"
            variant="store-primary"
          >
            Lanjutkan
          </Button>
        </div>
      </div>
    </div>
  );
}
