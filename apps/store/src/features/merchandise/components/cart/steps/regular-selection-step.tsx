import { Button } from "@tedx-2026/ui/components/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@tedx-2026/ui/components/select";
import { cn } from "@tedx-2026/ui/lib/utils";
import { MinusIcon, PlusIcon } from "lucide-react";
import { capitalize } from "../../../../../shared/lib/string";
import { useRegularSelectionItem } from "../../../hooks/use-regular-selection-item";
import { formatIdrCurrency } from "../../../lib/formatter";
import { groupVariantsByType } from "../../../lib/variant";
import { useCartStore } from "../../../stores/use-cart-store";
import type { CartItem } from "../../../types/cart";
import type { Product } from "../../../types/product";
import { SizeChartDialog } from "../../size-chart-dialog";

type RegularSelectionStepProps = {
  selectedItem: CartItem;
  categorySiblings: Product[];
};

export function RegularSelectionStep({
  selectedItem,
  categorySiblings,
}: RegularSelectionStepProps) {
  const { selectionStepMode } = useCartStore();

  const {
    item,
    onChangeQuantity,
    onAddItem,
    onProductSwitch,
    onVariantChange,
  } = useRegularSelectionItem(selectedItem);

  const variantItems = groupVariantsByType(item.variants);

  return (
    <div className="flex max-h-[80vh] flex-col pt-10 text-white">
      <div className="no-scrollbar flex-1 overflow-x-hidden overflow-y-scroll px-1 pr-2 pb-8">
        <div className="flex items-start gap-2 sm:items-center sm:gap-3">
          <div className="w-1/2 shrink-0 overflow-hidden rounded-2xl border border-white/5 bg-neutral-900 shadow-lg md:w-2/5">
            {item.imageUrl ? (
              <img
                alt={item.name}
                className="h-full w-full object-cover"
                height={160}
                src={item.imageUrl}
                width={160}
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
            <div className="flex items-start justify-between">
              <div className="space-y-0.5">
                <h1 className="text-sm text-white sm:text-lg">{item.name}</h1>
                <p className="font-normal text-base text-white-2 sm:text-2xl">
                  {formatIdrCurrency(item.price)}
                </p>
              </div>
            </div>

            <div className="mt-2 flex w-full items-center gap-4 font-sans-2 sm:flex-nowrap">
              <div className="w-1/2">
                <span className="font-sans-2 text-white text-xs">
                  Jumlah<span className="text-red-2">*</span>
                </span>
                <div className="mt-2 flex h-9 items-center gap-1.5 text-white sm:gap-3">
                  <button
                    className="text-white hover:text-gray-2"
                    onClick={() =>
                      onChangeQuantity(Math.max(1, item.quantity - 1))
                    }
                    type="button"
                  >
                    <MinusIcon className="h-4 w-4 sm:h-6 sm:w-6" />
                  </button>
                  <span className="text-center text-sm sm:text-base">
                    {item.quantity}
                  </span>
                  <button
                    className="text-white hover:text-gray-2"
                    onClick={() => onChangeQuantity(item.quantity + 1)}
                    type="button"
                  >
                    <PlusIcon className="h-4 w-4 sm:h-6 sm:w-6" />
                  </button>
                </div>
              </div>

              {variantItems?.map(({ type, variants }) => {
                const selectedVariant = item.selectedVariants?.find(
                  (v) => v.type === type
                );

                return (
                  <div className="w-1/2" key={type}>
                    <span className="flex items-center gap-1 font-sans-2 text-white text-xs">
                      {capitalize(type)}
                      <span className="text-red-2">*</span>
                      {type === "size" && item.category && (
                        <SizeChartDialog category={item.category} />
                      )}
                    </span>
                    <Select
                      items={variants}
                      onValueChange={(value) => {
                        if (value === null) {
                          return;
                        }

                        onVariantChange(type, value, variants);
                      }}
                      value={selectedVariant?.id}
                    >
                      <SelectTrigger className="mt-2 h-9 w-full rounded-xl border-none bg-white px-3 font-medium font-sans-2 text-black text-sm shadow-md">
                        <SelectValue>{selectedVariant?.label}</SelectValue>
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-none bg-white font-sans-2 text-black shadow-xl">
                        {variants.map((v) => (
                          <SelectItem
                            className="font-sans-2 text-black text-sm"
                            key={v.value}
                            value={v.value}
                          >
                            {capitalize(v.label)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* UI says variant but actually is selecting other product within the same category */}
        {selectionStepMode === "edit" && categorySiblings.length > 1 && (
          <div className="mt-4 mb-2 space-y-2.5 sm:space-y-3">
            <span className="text-sm text-white">
              Variant<span className="text-red-2">*</span>
            </span>
            <div className="mt-2 grid grid-cols-2 gap-2.5">
              {categorySiblings.map((prod) => (
                <button
                  className={cn(
                    "flex w-full min-w-0 flex-col items-center justify-between gap-2 overflow-hidden rounded-xl border-[3px] bg-white px-2 py-1.5 text-black transition-all",
                    item.id === prod.id
                      ? "border-red-2 shadow-md"
                      : "border-transparent hover:bg-neutral-100"
                  )}
                  key={prod.id}
                  onClick={() => onProductSwitch(prod)}
                  type="button"
                >
                  <div className="flex aspect-square w-full shrink-0 items-center justify-center overflow-hidden bg-gray-2">
                    {prod.imageUrl ? (
                      <img
                        alt={prod.name}
                        className="h-full w-full object-cover"
                        height={72}
                        src={prod.imageUrl}
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
                  <span className="min-w-0 flex-1 truncate text-right font-semibold text-xs">
                    {prod.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="sticky bottom-0 bg-black px-1 pt-1.5 pb-1.5">
        <div className="flex items-center justify-between font-sans-2 text-gray-2">
          <div>
            <p className="text-sm md:text-base">Harga Total</p>
            <p className="text-sm md:text-base">
              {formatIdrCurrency(item.price * item.quantity)}
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
