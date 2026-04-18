import { Button } from "@tedx-2026/ui/components/button";
import { DialogHeader, DialogTitle } from "@tedx-2026/ui/components/dialog";
import { Field, FieldError, FieldGroup } from "@tedx-2026/ui/components/field";
import { useStore } from "@tanstack/react-form";
import { useId } from "react";
import { useTicketManualPaymentForm } from "../../hooks/use-ticket-manual-payment-form";
import { useTicketCheckoutStore } from "../../stores/use-ticket-checkout-store";

export function TicketManualPaymentStep() {
  const { setStep } = useTicketCheckoutStore();
  const fileInputId = useId();
  const form = useTicketManualPaymentForm();

  const paymentProof = useStore(
    form.store,
    (state) => state.values.paymentProof
  );

  return (
    <div className="flex max-h-[80vh] min-h-0 flex-col overflow-hidden font-sans-2">
      <DialogHeader>
        <DialogTitle className="font-serif-2 text-base sm:text-lg">
          Payment
        </DialogTitle>
      </DialogHeader>

      <div className="no-scrollbar mt-1 min-h-0 flex-1 space-y-2 overflow-y-auto pr-1 pb-3">
        <div className="flex justify-center pt-0.5 pb-0 sm:pt-1 sm:pb-0.5">
          <div className="relative w-full max-w-44 overflow-hidden rounded-2xl bg-white p-2 shadow-2xl sm:max-w-52 sm:p-2.5">
            <img
              alt="QRIS"
              className="mx-auto h-auto w-full object-contain"
              height={360}
              src="/qris.png"
              width={360}
            />
          </div>
        </div>
      </div>

      <div className="mt-auto space-y-3 bg-black pt-2.5 pb-2 sm:pb-3">
        <div className="space-y-2">
          <span className="block font-sans-2 text-sm text-white">
            Bukti Pembayaran<span className="text-[#FF1818]">*</span>
          </span>

          <div className="flex h-11 items-center overflow-hidden rounded-lg border border-white/10 bg-white text-black sm:h-12">
            <label
              className="flex h-full cursor-pointer items-center border-black/10 border-r px-4 text-neutral-500 text-sm hover:bg-neutral-50"
              htmlFor={fileInputId}
            >
              Upload
            </label>
            <span className="overflow-hidden text-ellipsis whitespace-nowrap px-4 text-black text-sm">
              {paymentProof?.name ?? "Belum ada file"}
            </span>
          </div>

          <form
            id="ticket-order-form"
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <FieldGroup>
              <form.Field name="paymentProof">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field>
                      <input
                        accept="image/*"
                        aria-invalid={isInvalid}
                        className="sr-only"
                        id={fileInputId}
                        name={field.name}
                        onBlur={field.handleBlur}
                        onChange={(e) => {
                          const files = e.target.files;
                          if (!files || files.length === 0) {
                            return;
                          }

                          const [file] = files;
                          form.setFieldValue("paymentProof", file ?? null);
                        }}
                        type="file"
                      />
                      {isInvalid && (
                        <FieldError
                          className="pl-1 text-[#FF1818] text-xs"
                          errors={field.state.meta.errors}
                        />
                      )}
                    </Field>
                  );
                }}
              </form.Field>
            </FieldGroup>
          </form>
        </div>

        <div className="flex gap-2 sm:gap-3">
          <Button
            className="flex-1"
            onClick={() => setStep("summary")}
            size="checkout"
            variant="store-secondary"
          >
            Kembali
          </Button>

          <form.Subscribe>
            {() => (
              <Button
                className="flex-1"
                disabled={form.isSubmitting}
                form="ticket-order-form"
                size="checkout"
                type="submit"
                variant="store-primary"
              >
                {form.isSubmitting
                  ? "Mengupload..."
                  : "Upload Bukti Pembayaran"}
              </Button>
            )}
          </form.Subscribe>
        </div>
      </div>
    </div>
  );
}
