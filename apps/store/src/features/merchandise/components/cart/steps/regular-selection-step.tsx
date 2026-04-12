import { MinusIcon, PlusIcon } from "lucide-react";
import { Button } from "@tedx-2026/ui/components/button";
import { cn } from "@tedx-2026/ui/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@tedx-2026/ui/components/select";
import type { Product } from "../../../types/product";

type RegularSelectionStepProps = {
  activeProduct: Product;
  quantity: number;
  selectedVariantId: string;
  selectedVariantLabel: string;
  actionLabel: string;
  onQuantityChange: (next: number) => void;
  onVariantChange: (next: string) => void;
  onPay: () => void;
  onProductSwitch: (product: Product) => void;
  categorySiblings: Product[];
};

const selectionItemClassName = "font-sans-2 text-sm text-black";

export function RegularSelectionStep({
  activeProduct,
  quantity,
  selectedVariantId,
  selectedVariantLabel,
  actionLabel,
  onQuantityChange,
  onVariantChange,
  onPay,
  onProductSwitch,
  categorySiblings,
}: RegularSelectionStepProps) {
  const getVariantLabel = (variantType?: string) => {
    if (variantType === "color") {
      return "Warna";
    }
    return "Ukuran";
  };

  return (
    <div className="flex max-h-[80vh] flex-col pt-10 text-white">
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-1 pr-2 pb-8 [scrollbar-color:rgba(224,224,224,0.35)_transparent] [scrollbar-width:thin] sm:pb-12 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/30 hover:[&::-webkit-scrollbar-thumb]:bg-white/45 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-1">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-1/2 shrink-0 overflow-hidden rounded-2xl border border-white/5 bg-neutral-900 shadow-lg md:w-2/5">
            <img
              alt={activeProduct.name}
              className="h-full w-full object-cover"
              height={160}
              src={activeProduct.imageUrl || undefined}
              width={160}
            />
          </div>

          <div className="min-w-0 flex-1 font-sans-2">
            <div className="flex items-start justify-between">
              <div className="space-y-0.5">
                <h1 className="text-sm text-white sm:text-lg">
                  {activeProduct.name}
                </h1>
                <p className="font-normal text-base text-white-2 sm:text-2xl">
                  {activeProduct.price.toLocaleString("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    maximumFractionDigits: 0,
                  })}
                </p>
              </div>
            </div>

            <div className="mt-2 hidden items-center gap-4 font-sans-2 sm:flex">
              <div className="w-1/2">
                <span className="font-sans-2 text-white text-xs">
                  Jumlah <span className="text-red-2">*</span>
                </span>
                <div className="mt-2 flex h-9 items-center gap-3 text-white">
                  <button
                    className="text-white hover:text-gray-2"
                    onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
                    type="button"
                  >
                    <MinusIcon size={22} />
                  </button>
                  <span className="w-4 text-center text-sm">{quantity}</span>
                  <button
                    className="text-white hover:text-gray-2"
                    onClick={() => onQuantityChange(quantity + 1)}
                    type="button"
                  >
                    <PlusIcon size={22} />
                  </button>
                </div>
              </div>

              {activeProduct.variants && activeProduct.variants.length > 0 && (
                <div className="w-1/2">
                  <span className="font-sans-2 text-white text-xs">
                    {getVariantLabel(activeProduct.variants[0]?.type)}{" "}
                    <span className="text-red-2">*</span>
                  </span>
                  <Select
                    onValueChange={(value) => onVariantChange(value ?? "")}
                    value={selectedVariantId}
                  >
                    <SelectTrigger className="mt-2 h-9 w-full rounded-xl border-none bg-white px-3 font-medium font-sans-2 text-black text-sm shadow-md">
                      <SelectValue>
                        <span>{selectedVariantLabel}</span>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-none bg-white font-sans-2 text-black shadow-xl">
                      {activeProduct.variants.map((v) => (
                        <SelectItem
                          className={selectionItemClassName}
                          key={v.id}
                          value={v.id}
                        >
                          {v.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4 grid w-full grid-cols-2 gap-1.5 lg:hidden">
          <div className="space-y-1">
            <span className="font-sans-2 font-semibold text-white text-xs">
              Jumlah <span className="text-red-2">*</span>
            </span>
            <div className="flex h-8 w-full items-center justify-between px-1 text-white">
              <button
                className="text-neutral-400 hover:text-white"
                onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
                type="button"
              >
                <MinusIcon size={20} />
              </button>
              <span className="w-4 text-center font-semibold text-xs">
                {quantity}
              </span>
              <button
                className="text-neutral-400 hover:text-white"
                onClick={() => onQuantityChange(quantity + 1)}
                type="button"
              >
                <PlusIcon size={20} />
              </button>
            </div>
          </div>

          {activeProduct.variants && activeProduct.variants.length > 0 && (
            <div className="space-y-1">
              <span className="font-sans-2 font-semibold text-white text-xs">
                {getVariantLabel(activeProduct.variants[0]?.type)}{" "}
                <span className="text-red-2">*</span>
              </span>
              <Select
                onValueChange={(value) => onVariantChange(value ?? "")}
                value={selectedVariantId}
              >
                <SelectTrigger className="h-8 w-full rounded-lg border-none bg-white px-2.5 font-medium font-sans-2 text-black text-xs shadow-md">
                  <SelectValue placeholder="Pilih Ukuran">
                    <span>{selectedVariantLabel}</span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="rounded-xl border-none bg-white font-sans-2 text-black shadow-xl">
                  {activeProduct.variants.map((v) => (
                    <SelectItem
                      className={selectionItemClassName}
                      key={v.id}
                      value={v.id}
                    >
                      {v.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <div className="mt-4 mb-2 space-y-2.5 sm:space-y-3">
          <span className="text-sm text-white">
            Variant <span className="text-red-2">*</span>
          </span>
          <div className="mt-2 grid grid-cols-2 gap-2.5">
            {categorySiblings.map((prod) => (
              <button
                className={cn(
                  "flex w-full min-w-0 items-center justify-between gap-2 overflow-hidden rounded-xl border-[3px] bg-white px-2 py-1.5 text-black transition-all",
                  activeProduct.id === prod.id
                    ? "border-red-2 shadow-md"
                    : "border-transparent hover:bg-neutral-100"
                )}
                key={prod.id}
                onClick={() => onProductSwitch(prod)}
                type="button"
              >
                <div className="flex aspect-square w-7 shrink-0 items-center justify-center overflow-hidden bg-gray-2">
                  {prod.imageUrl ? (
                    <img
                      alt={prod.name}
                      className="h-full w-full object-cover"
                      height={28}
                      src={prod.imageUrl}
                      width={28}
                    />
                  ) : (
                    <div className="h-4 w-4 rounded-lg bg-neutral-400/20" />
                  )}
                </div>
                <span className="min-w-0 flex-1 truncate text-right font-semibold text-xs">
                  {prod.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 bg-black px-1 pt-1.5 pb-1.5">
        <div className="flex items-center justify-between font-sans-2 text-gray-2">
          <div>
            <p className="text-sm md:text-base">Harga Total</p>
            <p className="text-sm md:text-base">
              {(activeProduct.price * quantity).toLocaleString("id-ID", {
                style: "currency",
                currency: "IDR",
                maximumFractionDigits: 2,
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
