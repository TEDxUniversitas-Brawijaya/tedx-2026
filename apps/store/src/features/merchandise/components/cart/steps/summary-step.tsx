import { DialogHeader, DialogTitle } from "@tedx-2026/ui/components/dialog";
import { Button } from "@tedx-2026/ui/components/button";
import { createNanoIdWithPrefix } from "@tedx-2026/utils";
import { useCartStore } from "@/features/merchandise/store/cart-store";
import { useCreateMerchOrderMutation } from "@/features/merchandise/hooks/use-create-merch-order-mutation";
import type { CheckoutStep } from "@/features/merchandise/types/types";
import type { CheckoutForm } from "../";

type SummaryStepProps = {
  form: CheckoutForm;
  onMoveStep: (step: CheckoutStep) => void;
  onNext: () => void;
};

export function SummaryStep({ form, onMoveStep, onNext }: SummaryStepProps) {
  const { items, getTotalPrice, setOrder } = useCartStore();
  const total = getTotalPrice();
  const createOrderMutation = useCreateMerchOrderMutation({
    onSuccess: (data) => {
      setOrder({
        orderId: data.orderId,
        status: data.status,
        items: items.map((item) => {
          const variants = item.selectedVariantIds
            .map((variantId) =>
              item.variants?.find((variant) => variant.id === variantId)
            )
            .filter(
              (
                variant
              ): variant is { id: string; label: string; type: string } =>
                variant !== undefined
            )
            .map((variant) => ({
              label: variant.label,
              type: variant.type,
            }));

          return {
            snapshotName: item.name,
            quantity: item.quantity,
            unitPrice: item.price,
            snapshotVariants: variants.length > 0 ? variants : undefined,
          };
        }),
        totalPrice: data.totalPrice,
        paymentMethod: data.paymentMethod,
        payment: data.payment,
      });
      onNext();
    },
  });

  const handleSubmitOrder = () => {
    createOrderMutation.mutate({
      fullName: form.getFieldValue("fullName"),
      email: form.getFieldValue("email"),
      phone: form.getFieldValue("phone"),
      address: form.getFieldValue("address"),
      items: items.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        variantIds: item.selectedVariantIds,
      })),
      captchaToken: "dummy-captcha",
      idempotencyKey: createNanoIdWithPrefix("idemp"),
    });
  };

  return (
    <div className="flex max-h-[80vh] flex-col">
      <DialogHeader>
        <DialogTitle className="font-serif-2 text-xl">Summary</DialogTitle>
      </DialogHeader>

      <div className="mt-6 max-h-80 space-y-6 overflow-y-auto pr-2 [scrollbar-color:rgba(224,224,224,0.35)_transparent] [scrollbar-width:thin] sm:max-h-96 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/30 hover:[&::-webkit-scrollbar-thumb]:bg-white/45 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-1">
        <div className="rounded-2xl">
          <div className="mb-4 flex items-center justify-between">
            <h5 className="font-sans-2 text-white text-xs">
              Informasi Pembelian
            </h5>
            <button
              className="font-sans-2 text-gray-2 text-xs underline hover:cursor-pointer"
              onClick={() => onMoveStep("cart")}
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
                  {item.variants?.find(
                    (v) => v.id === item.selectedVariantIds[0]
                  )?.label && (
                    <p className="font-sans-2 text-gray-2 text-sm">
                      Size:{" "}
                      {
                        item.variants?.find(
                          (v) => v.id === item.selectedVariantIds[0]
                        )?.label
                      }
                    </p>
                  )}
                </div>
                <p className="shrink-0 font-sans-2 text-base text-gray-2">
                  {(item.price * item.quantity).toLocaleString("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  })}
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
              onClick={() => onMoveStep("identification")}
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
              <span
                className="font-sans-2 text-sm text-white"
                style={{ textAlign: "right" }}
              >
                {form.getFieldValue("fullName")}
              </span>
            </div>
            <div className="flex items-start justify-between border-white/5 border-b pb-4">
              <span className="font-sans-2 text-gray-2 text-sm">Email</span>
              <span
                className="max-w-50 truncate font-sans-2 text-sm text-white"
                style={{ textAlign: "right" }}
              >
                {form.getFieldValue("email")}
              </span>
            </div>
            <div className="flex items-start justify-between border-white/5 border-b pb-4">
              <span className="font-sans-2 text-gray-2 text-sm">No. Telp</span>
              <span
                className="font-sans-2 text-sm text-white"
                style={{ textAlign: "right" }}
              >
                {form.getFieldValue("phone")}
              </span>
            </div>
            <div className="flex items-start justify-between pt-2">
              <span className="shrink-0 font-sans-2 text-gray-2 text-sm">
                Alamat
              </span>
              <span
                className="max-w-62.5 pl-4 font-sans-2 text-sm text-white"
                style={{ textAlign: "right" }}
              >
                {form.getFieldValue("address")}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 z-10 mt-4 border-white/10 border-t bg-black pt-4 font-sans-2 sm:mt-6 sm:pt-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <p className="text-gray-2 text-sm sm:text-base">Harga Total</p>
            <p className="text-gray-2 text-sm sm:text-base">
              {total.toLocaleString("id-ID", {
                style: "currency",
                currency: "IDR",
              })}
            </p>
          </div>
          <Button
            className="w-1/2"
            disabled={createOrderMutation.isPending}
            onClick={handleSubmitOrder}
            size="checkout"
            variant="primary"
          >
            {createOrderMutation.isPending ? "Memproses..." : "Bayar"}
          </Button>
        </div>
      </div>
    </div>
  );
}
