import {
  DialogClose,
  DialogHeader,
  DialogTitle,
} from "@tedx-2026/ui/components/dialog";
import { Button } from "@tedx-2026/ui/components/button";
import { MinusIcon, PlusIcon, ChevronDownIcon } from "lucide-react";
import { cn } from "@tedx-2026/ui/lib/utils";
import {
  formatIdrCurrency,
  getBundleItemSubtitle,
  getBundleSelectionLabel,
} from "../../../lib/order-management-utils";
import type { CartStepViewProps } from "../../../types/merch-view";

export function CartStep({
  items,
  onCancel,
  onEditSelection,
  onNext,
  onUpdateQuantity,
  totalPrice,
}: CartStepViewProps) {
  const shouldScrollItems = items.length > 2;

  return (
    <div className="flex max-h-[80vh] flex-col">
      <DialogHeader>
        <DialogTitle className="font-normal font-serif-2 text-xl sm:text-2xl">
          Cart
        </DialogTitle>
      </DialogHeader>

      <div
        className={cn(
          "mt-6 space-y-4 px-1 pb-2 [scrollbar-color:rgba(224,224,224,0.35)_transparent] [scrollbar-width:thin] sm:mt-8 sm:space-y-6 sm:px-2 sm:pb-3 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/30 hover:[&::-webkit-scrollbar-thumb]:bg-white/45 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-1",
          shouldScrollItems
            ? "max-h-74 overflow-y-auto sm:max-h-96"
            : "overflow-y-visible"
        )}
      >
        {items.length === 0 ? (
          <div className="py-10 text-center text-gray-2">
            Your cart is empty
          </div>
        ) : (
          items.map((item) => (
            <div
              className="flex items-center gap-3 border-white/10 border-b pb-4 last:border-b-0 last:pb-0 sm:gap-6 sm:pb-6"
              key={item.id}
            >
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-neutral-200 sm:h-32 sm:w-32 sm:rounded-2xl">
                <img
                  alt={item.name}
                  className="h-full w-full object-cover"
                  height={400}
                  src={item.imageUrl || undefined}
                  width={400}
                />
              </div>
              <div className="min-w-0 flex-1 font-sans-2">
                <div>
                  <h4 className="truncate text-sm text-white sm:text-base">
                    {item.name}
                  </h4>
                  <p className="truncate text-base text-white-2 sm:text-xl">
                    {formatIdrCurrency(item.price)}
                  </p>
                  {getBundleItemSubtitle(item) && (
                    <p className="truncate text-white text-xs sm:text-sm">
                      {getBundleItemSubtitle(item)}
                    </p>
                  )}
                </div>

                <div className="flex items-start justify-between gap-2 pt-2 font-sans-2">
                  <div className="w-[46%] min-w-0 sm:w-3/5">
                    {(item.type === "merch_bundle" ||
                      (item.variants?.length ?? 0) > 0) && (
                      <button
                        className="flex h-6 w-full cursor-pointer items-center justify-between rounded-md border border-white/10 bg-white px-1.5 text-[8px] text-black sm:h-10 sm:rounded-lg sm:px-3 sm:text-xs"
                        onClick={() => onEditSelection(item)}
                        type="button"
                      >
                        <span className="truncate">
                          {item.type === "merch_bundle"
                            ? (getBundleSelectionLabel(item) ??
                              "Pilih Bundling")
                            : item.variants?.find(
                                (v) => v.id === item.selectedVariantIds[0]
                              )?.label || "Pilih Varian"}
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
                        onUpdateQuantity(item.id, item.quantity - 1)
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
                        onUpdateQuantity(item.id, item.quantity + 1)
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
                onClick={onCancel}
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
            onClick={onNext}
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
