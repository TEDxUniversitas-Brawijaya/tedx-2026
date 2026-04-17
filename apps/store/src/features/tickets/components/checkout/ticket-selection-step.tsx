import { Button } from "@tedx-2026/ui/components/button";
import { MinusIcon, PlusIcon } from "lucide-react";
import { useTicketBundleOptions } from "../../hooks/use-ticket-bundle-options";
import { formatIdrCurrency } from "../../lib/formatter";
import { useTicketCheckoutStore } from "../../stores/use-ticket-checkout-store";
import { toast } from "sonner";

export const TicketSelectionStep = () => {
  const {
    selectedProduct,
    quantity,
    setQuantity,
    selectedBundleItemId,
    setSelectedBundleItemId,
    onNextStep,
  } = useTicketCheckoutStore();
  const bundleOptions = useTicketBundleOptions(selectedProduct);

  if (!selectedProduct) {
    return null;
  }

  const maxQty =
    selectedProduct.stock === null
      ? 5
      : Math.min(5, Math.max(1, selectedProduct.stock));

  const onContinue = () => {
    if (bundleOptions.length > 0 && !selectedBundleItemId) {
      toast.error("Pilih item bundling terlebih dahulu.");
      return;
    }

    onNextStep();
  };

  return (
    <div className="space-y-5" id="ticket-checkout-selection">
      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <h4 className="font-serif-2 text-lg">{selectedProduct.name}</h4>
        <p className="mt-1 font-sans-2 text-sm text-white/75">
          {selectedProduct.stock === null
            ? "Stok tak terbatas"
            : `Sisa stok: ${selectedProduct.stock}`}
        </p>
        <p className="mt-3 font-sans-2 text-lg">
          {formatIdrCurrency(selectedProduct.price)}
        </p>
      </div>

      <div>
        <p className="font-sans-2 text-sm">Jumlah tiket (max {maxQty})</p>
        <div className="mt-2 inline-flex items-center gap-4 rounded-full border border-white/20 px-4 py-2">
          <button onClick={() => setQuantity(quantity - 1)} type="button">
            <MinusIcon size={18} />
          </button>
          <span className="w-6 text-center font-sans-2">{quantity}</span>
          <button onClick={() => setQuantity(quantity + 1)} type="button">
            <PlusIcon size={18} />
          </button>
        </div>
      </div>

      {bundleOptions.length > 0 && (
        <div className="space-y-2">
          <p className="font-sans-2 text-sm">Pilih item bundling</p>
          {bundleOptions.map((option) => (
            <label
              className="flex cursor-pointer items-center gap-2"
              key={option.id}
            >
              <input
                checked={selectedBundleItemId === option.id}
                name="bundle-option"
                onChange={() => setSelectedBundleItemId(option.id)}
                type="radio"
              />
              <span className="font-sans-2 text-sm">{option.label}</span>
            </label>
          ))}
        </div>
      )}

      <div className="mt-2 border-white/10 border-t pt-4 sm:pt-6">
        <Button
          className="w-full"
          onClick={onContinue}
          size="checkout"
          variant="store-primary"
        >
          Lanjutkan
        </Button>
      </div>
    </div>
  );
};
