import { trpc } from "@/shared/lib/trpc";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@tedx-2026/ui/components/button";
import { DialogHeader, DialogTitle } from "@tedx-2026/ui/components/dialog";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { isManualPayment } from "../../../configs/payment";
import { formatIdrCurrency } from "../../../lib/formatter";
import { useCartStore } from "../../../stores/use-cart-store";

type SummaryStepProps = {
  buyer: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
  };
};

export function SummaryStep({ buyer }: SummaryStepProps) {
  const { setStep, items, onNextStep, setOrder, getTotalPrice } =
    useCartStore();
  const createOrderMutation = useMutation(
    trpc.merch.createOrder.mutationOptions()
  );

  const turnstileRef = useRef<TurnstileInstance>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [idempotencyKey] = useState(() => crypto.randomUUID());

  const totalPrice = getTotalPrice();

  const onSubmit = () => {
    if (isManualPayment) {
      setStep("payment");
      return;
    }

    if (!captchaToken) {
      toast.error("Mohon selesaikan verifikasi CAPTCHA terlebih dahulu.");
      return;
    }

    const formData = new FormData();
    formData.append("fullName", buyer.fullName);
    formData.append("email", buyer.email);
    formData.append("phone", buyer.phone);
    formData.append("address", buyer.address);
    formData.append(
      "items",
      JSON.stringify(
        items.map((item) => ({
          productId: item.id,
          variantIds: item.selectedVariants?.map((v) => v.id),
          bundleItemProducts: item.selectedBundleProducts?.map((p) => ({
            productId: p.id,
            variantIds: p.selectedVariants?.map((v) => v.id),
          })),
          quantity: item.quantity,
        }))
      )
    );
    formData.append("captchaToken", captchaToken);
    formData.append("idempotencyKey", idempotencyKey);

    createOrderMutation.mutate(formData, {
      onSuccess: (data) => {
        setOrder(data);
        onNextStep();
      },
      onError: (error) => {
        // Reset CAPTCHA on error
        turnstileRef.current?.reset();
        setCaptchaToken(null);

        toast.error(
          error.message || "Gagal membuat pesanan. Silakan coba lagi."
        );
      },
    });
  };

  return (
    <div className="flex max-h-[80vh] flex-col">
      <DialogHeader>
        <DialogTitle className="font-serif-2 text-xl">Summary</DialogTitle>
      </DialogHeader>

      <div className="no-scrollbar mt-6 max-h-80 space-y-6 overflow-y-auto pr-2">
        <div className="rounded-2xl">
          <div className="mb-4 flex items-center justify-between">
            <h5 className="font-sans-2 text-white text-xs">
              Informasi Pembelian
            </h5>
            <button
              className="font-sans-2 text-gray-2 text-xs underline hover:cursor-pointer"
              onClick={() => setStep("cart")}
              type="button"
            >
              ubah
            </button>
          </div>
          <div className="space-y-4">
            {items.map((item) => (
              <div
                className="flex items-start justify-between gap-4 border-white/10 border-b pb-4 last:border-b-0 last:pb-0"
                key={item.id}
              >
                <div className="space-y-1">
                  <p className="font-sans-2 text-base text-gray-2 leading-tight">
                    {item.name} (x{item.quantity})
                  </p>
                  {item.selectedVariants &&
                    item.selectedVariants.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {item.selectedVariants.map((variant) => (
                          <span
                            className="font-sans-2 text-gray-2 text-sm"
                            key={variant.id}
                          >
                            {variant.type}: {variant.label}
                          </span>
                        ))}
                      </div>
                    )}
                </div>
                <p className="shrink-0 font-sans-2 text-base text-gray-2">
                  {formatIdrCurrency(item.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-4 flex items-center justify-between">
            <h5 className="font-sans-2 text-white text-xs">Identitas</h5>
            <button
              className="font-sans-2 text-gray-2 text-xs underline hover:cursor-pointer"
              onClick={() => setStep("identification")}
              type="button"
            >
              ubah
            </button>
          </div>
          <div className="space-y-4">
            <div className="flex items-start justify-between border-white/5 border-b pb-4">
              <span className="font-sans-2 text-gray-2 text-sm">
                Nama Lengkap
              </span>
              <span className="text-right font-sans-2 text-sm text-white">
                {buyer.fullName}
              </span>
            </div>
            <div className="flex items-start justify-between border-white/5 border-b pb-4">
              <span className="font-sans-2 text-gray-2 text-sm">Email</span>
              <span className="max-w-50 truncate text-right font-sans-2 text-sm text-white">
                {buyer.email}
              </span>
            </div>
            <div className="flex items-start justify-between border-white/5 border-b pb-4">
              <span className="font-sans-2 text-gray-2 text-sm">No. Telp</span>
              <span className="text-right font-sans-2 text-sm text-white">
                {buyer.phone}
              </span>
            </div>
            <div className="flex items-start justify-between pt-2">
              <span className="shrink-0 font-sans-2 text-gray-2 text-sm">
                Alamat
              </span>
              <span className="max-w-62.5 pl-4 text-right font-sans-2 text-sm text-white">
                {buyer.address}
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

      <div className="sticky bottom-0 z-10 mt-4 border-white/10 border-t bg-black pt-4 font-sans-2 sm:mt-6 sm:pt-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <p className="text-gray-2 text-sm sm:text-base">Harga Total</p>
            <p className="text-gray-2 text-sm sm:text-base">
              {formatIdrCurrency(totalPrice)}
            </p>
          </div>
          <Button
            className="w-1/2"
            disabled={
              createOrderMutation.isPending ||
              !(captchaToken || isManualPayment)
            }
            onClick={onSubmit}
            size="checkout"
            type="button"
            variant="store-primary"
          >
            {createOrderMutation.isPending ? "Memproses..." : "Bayar"}
          </Button>
        </div>
      </div>
    </div>
  );
}
