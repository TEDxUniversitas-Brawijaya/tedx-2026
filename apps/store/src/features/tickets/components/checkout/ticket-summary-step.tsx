import { useMutation } from "@tanstack/react-query";
import { Button } from "@tedx-2026/ui/components/button";
import { DialogHeader, DialogTitle } from "@tedx-2026/ui/components/dialog";
import { toast } from "sonner";
import { trpc } from "@/shared/lib/trpc";
import { formatIdrCurrency } from "../../lib/formatter";
import { isManualPayment } from "../../configs/payment";
import { useTicketCheckoutStore } from "../../stores/use-ticket-checkout-store";

export const TicketSummaryStep = () => {
  const { buyer, selectedProduct, quantity, onPrevStep, onNextStep, setOrder } =
    useTicketCheckoutStore();

  const createOrderMutation = useMutation(
    trpc.ticket.createOrder.mutationOptions()
  );

  if (!(buyer && selectedProduct)) {
    return null;
  }

  const onSubmit = async () => {
    if (isManualPayment) {
      onNextStep();
      return;
    }

    const formData = new FormData();
    formData.append("productId", selectedProduct.id);
    formData.append("quantity", quantity.toString());
    formData.append("buyerName", buyer.buyerName);
    formData.append("buyerEmail", buyer.buyerEmail);
    formData.append("phone", buyer.phone);
    formData.append("buyerInstansi", buyer.buyerInstansi);
    formData.append("captchaToken", "dummy-captcha-token");
    formData.append("idempotencyKey", new Date().toISOString());

    await createOrderMutation.mutateAsync(formData, {
      onSuccess: (response) => {
        setOrder(response);
        onNextStep();
      },
      onError: (error) => {
        toast.error(error.message || "Gagal membuat pesanan.");
      },
    });
  };

  return (
    <div className="flex max-h-[80vh] flex-col">
      <DialogHeader className="text-left">
        <DialogTitle className="font-normal font-serif-2 text-2xl text-white sm:text-3xl">
          Quick Summary
        </DialogTitle>
      </DialogHeader>

      <div className="no-scrollbar mt-6 flex-1 space-y-8 overflow-x-hidden overflow-y-scroll pr-2">
        {/* Informasi Pembelian */}
        <div>
          <h5 className="mb-4 font-sans-2 text-gray-2 text-xs">
            Informasi Pembelian
          </h5>
          <div className="space-y-4 font-sans-2 text-sm">
            <div className="flex items-start justify-between gap-4 border-white/10 border-b pb-4">
              <span className="shrink-0 text-gray-2">Tiket yang Dibeli</span>
              <span className="max-w-[60%] text-right font-bold text-white">
                {selectedProduct.name}
                {selectedProduct.description &&
                  ` (${selectedProduct.description})`}
              </span>
            </div>
            <div className="flex items-start justify-between gap-4 border-white/10 border-b pb-4">
              <span className="text-gray-2">Jumlah Tiket</span>
              <span className="text-right font-bold text-white">
                {quantity}
              </span>
            </div>
            <div className="flex items-start justify-between gap-4 border-white/10 border-b pb-4">
              <span className="text-gray-2">Harga</span>
              <span className="text-right font-bold text-white">
                {formatIdrCurrency(selectedProduct.price)} (x{quantity})
              </span>
            </div>
            <div className="flex items-start justify-between gap-4 py-2">
              <span className="text-gray-2">Total</span>
              <span className="text-right font-bold text-white">
                {formatIdrCurrency(selectedProduct.price * quantity)}
              </span>
            </div>
          </div>
        </div>

        {/* Identitas */}
        <div>
          <h5 className="mb-4 font-bold font-sans-2 text-gray-2 text-xs">
            Identitas
          </h5>
          <div className="space-y-4 font-sans-2 text-sm">
            <div className="flex items-start justify-between border-white/5 border-b pb-4">
              <span className="text-gray-2">Nama Lengkap</span>
              <span className="text-right font-bold text-white">
                {buyer.buyerName}
              </span>
            </div>
            <div className="flex items-start justify-between border-white/5 border-b pb-4">
              <span className="text-gray-2">Email</span>
              <span className="max-w-50 truncate text-right font-bold text-white">
                {buyer.buyerEmail}
              </span>
            </div>
            <div className="flex items-start justify-between border-white/5 border-b pb-4">
              <span className="text-gray-2">No. Telp</span>
              <span className="text-right font-bold text-white">
                {buyer.phone}
              </span>
            </div>
            <div className="flex items-start justify-between pt-2">
              <span className="shrink-0 text-gray-2">Institusi</span>
              <span className="max-w-62.5 pl-4 text-right font-bold text-white">
                {buyer.buyerInstansi}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex gap-4">
        <Button
          className="flex-1"
          disabled={createOrderMutation.isPending}
          onClick={onPrevStep}
          size="checkout"
          variant="store-secondary"
        >
          Kembali
        </Button>
        <Button
          className="flex-1"
          disabled={createOrderMutation.isPending}
          onClick={onSubmit}
          size="checkout"
          variant="store-primary"
        >
          {createOrderMutation.isPending ? "Memproses..." : "Bayar"}
        </Button>
      </div>
    </div>
  );
};
