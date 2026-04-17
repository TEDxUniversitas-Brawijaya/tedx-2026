import { Button } from "@tedx-2026/ui/components/button";
import { DialogHeader, DialogTitle } from "@tedx-2026/ui/components/dialog";
import { isManualPayment } from "../../configs/payment";
import { useTicketCreateOrderForm } from "../../hooks/use-ticket-create-order-form";
import { formatIdrCurrency } from "../../lib/formatter";
import { useTicketCheckoutStore } from "../../stores/use-ticket-checkout-store";

export const TicketSummaryStep = () => {
  const {
    buyer,
    selectedProduct,
    quantity,
    selectedBundleItemId,
    onPrevStep,
    setStep,
  } = useTicketCheckoutStore();
  const { form, isPending } = useTicketCreateOrderForm();

  if (!(buyer && selectedProduct)) {
    return null;
  }

  const productNameText = `${selectedProduct.name} ${
    selectedProduct.description ? `\n(${selectedProduct.description})` : ""
  }`;

  return (
    <div className="flex max-h-[80vh] flex-col gap-y-4 sm:gap-y-6">
      <DialogHeader className="text-left">
        <DialogTitle className="font-normal font-serif-2 text-xl sm:text-2xl">
          Quick Summary
        </DialogTitle>
      </DialogHeader>

      <div className="no-scrollbar flex-1 space-y-4 overflow-x-hidden overflow-y-scroll sm:space-y-6">
        <form
          className="space-y-6 sm:space-y-8"
          id="ticket-summary-form"
          onSubmit={(event) => {
            event.preventDefault();
            if (isManualPayment) {
              setStep("payment");
            } else {
              form.handleSubmit();
            }
          }}
        >
          {/* Informasi Pembelian */}
          <div className="font-sans-2 text-[#E0E0E0] text-sm">
            <h4 className="mb-4 font-bold text-sm text-white">
              Informasi Pembelian
            </h4>
            <div className="space-y-4">
              <div className="flex justify-between gap-4">
                <span className="w-1/3 shrink-0">Tiket yang Dibeli</span>
                <span className="w-2/3 whitespace-pre-wrap text-right font-bold text-white">
                  {productNameText}
                  {selectedBundleItemId && `\nBundle: ${selectedBundleItemId}`}
                </span>
              </div>
              <div className="h-px w-full bg-white/20" />
              <div className="flex justify-between gap-4">
                <span className="w-1/3 shrink-0">Jumlah Tiket</span>
                <span className="w-2/3 text-right font-bold text-white">
                  {quantity}
                </span>
              </div>
              <div className="h-px w-full bg-white/20" />
              <div className="flex justify-between gap-4">
                <span className="w-1/3 shrink-0">Harga</span>
                <span className="w-2/3 text-right font-bold text-white">
                  {formatIdrCurrency(selectedProduct.price)} (x{quantity})
                </span>
              </div>
              <div className="h-px w-full bg-white/20" />
              <div className="flex justify-between gap-4">
                <span className="w-1/3 shrink-0">Total</span>
                <span className="w-2/3 text-right font-bold text-white">
                  {formatIdrCurrency(selectedProduct.price * quantity)}
                </span>
              </div>
            </div>
          </div>

          {/* Identitas */}
          <div className="font-sans-2 text-[#E0E0E0] text-sm">
            <h4 className="mb-4 font-bold text-sm text-white">Identitas</h4>
            <div className="space-y-4">
              <div className="flex justify-between gap-4">
                <span className="w-1/3 shrink-0">Nama Lengkap</span>
                <span className="w-2/3 truncate text-right font-bold text-white">
                  {buyer.buyerName}
                </span>
              </div>
              <div className="h-px w-full bg-white/20" />
              <div className="flex justify-between gap-4">
                <span className="w-1/3 shrink-0">Email</span>
                <span className="w-2/3 truncate text-right font-bold text-white">
                  {buyer.buyerEmail}
                </span>
              </div>
              <div className="h-px w-full bg-white/20" />
              <div className="flex justify-between gap-4">
                <span className="w-1/3 shrink-0">No. Telp</span>
                <span className="w-2/3 truncate text-right font-bold text-white">
                  {buyer.phone}
                </span>
              </div>
              <div className="h-px w-full bg-white/20" />
              <div className="flex justify-between gap-4">
                <span className="w-1/3 shrink-0">Institusi</span>
                <span className="w-2/3 truncate text-right font-bold text-white">
                  {buyer.buyerInstansi}
                </span>
              </div>
            </div>
          </div>
        </form>
      </div>

      <div className="flex gap-2 border-white/10 border-t pt-4 sm:gap-4 sm:pt-6">
        <Button
          className="flex-1"
          onClick={onPrevStep}
          size="checkout"
          type="button"
          variant="store-secondary"
        >
          Kembali
        </Button>
        <Button
          className="flex-1"
          disabled={isPending}
          form="ticket-summary-form"
          size="checkout"
          type="submit"
          variant="store-primary"
        >
          {isPending ? "Memproses..." : "Lanjutkan"}
        </Button>
      </div>
    </div>
  );
};
