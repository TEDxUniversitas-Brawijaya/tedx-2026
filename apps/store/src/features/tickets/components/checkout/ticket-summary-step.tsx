import { trpc } from "@/shared/lib/trpc";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@tedx-2026/ui/components/button";
import { DialogHeader, DialogTitle } from "@tedx-2026/ui/components/dialog";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { isManualPayment } from "../../configs/payment";
import { formatIdrCurrency } from "../../lib/formatter";
import { useTicketCheckoutStore } from "../../stores/use-ticket-checkout-store";
import type { TicketBuyer } from "../../types/ticket";
import type { CartItem } from "../../types/checkout";

type TicketSummaryStepProps = {
  buyer: TicketBuyer;
  selectedProduct: CartItem;
  quantity: number;
};

export const TicketSummaryStep = ({
  buyer,
  selectedProduct,
  quantity,
}: TicketSummaryStepProps) => {
  const { onPrevStep, onNextStep, setOrder } = useTicketCheckoutStore();

  const createOrderMutation = useMutation(
    trpc.ticket.createOrder.mutationOptions()
  );

  const turnstileRef = useRef<TurnstileInstance>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [idempotencyKey] = useState(() => crypto.randomUUID());

  const onSubmit = async () => {
    if (isManualPayment) {
      onNextStep();
      return;
    }

    if (!captchaToken) {
      toast.error("Mohon selesaikan verifikasi CAPTCHA terlebih dahulu.");
      return;
    }

    const formData = new FormData();
    formData.append("productId", selectedProduct.id);
    formData.append("quantity", quantity.toString());
    formData.append("buyerName", buyer.buyerName);
    formData.append("buyerEmail", buyer.buyerEmail);
    formData.append("phone", buyer.phone);
    formData.append("buyerInstansi", buyer.buyerInstansi);
    formData.append("captchaToken", captchaToken);
    formData.append("idempotencyKey", idempotencyKey);
    formData.append(
      "bundleItemProducts",
      JSON.stringify(
        selectedProduct.selectedBundleProducts?.map((item) => ({
          productId: item.productId,
        }))
      )
    );

    await createOrderMutation.mutateAsync(formData, {
      onSuccess: (response) => {
        setOrder(response);
        onNextStep();
      },
      onError: (error) => {
        // Reset CAPTCHA on error
        turnstileRef.current?.reset();
        setCaptchaToken(null);

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

        {/* CAPTCHA Widget on this step only show on midtrans, captch for manual payment will show on manual payment step */}
        {isManualPayment ? null : (
          <div className="flex justify-center">
            <Turnstile
              onError={() => {
                setCaptchaToken(null);
                toast.error("Verifikasi CAPTCHA gagal. Silakan coba lagi.");
              }}
              onExpire={() => setCaptchaToken(null)}
              onSuccess={(token) => setCaptchaToken(token)}
              options={{
                theme: "light",
              }}
              ref={turnstileRef}
              siteKey={import.meta.env.VITE_PUBLIC_TURNSTILE_SITE_KEY}
            />
          </div>
        )}
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
          disabled={
            createOrderMutation.isPending || !(captchaToken || isManualPayment)
          }
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
