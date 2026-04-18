import { Button } from "@tedx-2026/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@tedx-2026/ui/components/dialog";
import { Input } from "@tedx-2026/ui/components/input";
import { Textarea } from "@tedx-2026/ui/components/textarea";
import { useState } from "react";
import chandelier from "@/assets/imgs/chandelier-1.png";
import textureBlack from "@/assets/imgs/texture-black.png";
import type { useRefundRequestForm } from "../hooks/use-refund-request-form";
import type { RefundOrderInfo } from "../types";

type RefundRequestFormProps = {
  orderInfo: RefundOrderInfo;
  form: ReturnType<typeof useRefundRequestForm>;
  onClose: () => void;
};

export function RefundRequestForm({
  orderInfo,
  form: { form: formHook, isManualPayment, isSubmitting },
  onClose,
}: RefundRequestFormProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!(open || isSubmitting)) {
          onClose();
        }
      }}
      open
    >
      <DialogContent
        className="relative max-h-[92vh] w-[calc(100%-2rem)] max-w-107.5 overflow-y-auto overflow-x-hidden rounded-3xl border border-white/10 bg-[#262626]/90 p-6 text-white shadow-[0_0_65px_rgba(255,149,0,0.25)] backdrop-blur-sm *:data-[slot=dialog-close]:z-20 *:data-[slot=dialog-close]:bg-transparent *:data-[slot=dialog-close]:text-white sm:max-w-107.5 sm:p-7 md:w-full"
        showCloseButton={false}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: `url(${textureBlack})`,
            backgroundPosition: "center",
            backgroundRepeat: "repeat",
            backgroundSize: "cover",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,102,20,0.08)_5%,rgba(0,0,0,0.95)_70%)]"
        />

        <img
          alt="chandelier"
          aria-hidden
          className="pointer-events-none absolute -top-14 -right-18 w-56 opacity-25"
          height={256}
          src={chandelier}
          width={256}
        />
        <DialogHeader className="relative z-2 pr-2 sm:pr-10">
          <DialogTitle className="font-serif-2 text-2xl leading-none">
            Form Refund
          </DialogTitle>
          <DialogDescription className="mt-3 font-medium font-sans-2 text-gray-300 text-xs italic">
            Silakan isi data pada formulir di bawah ini dengan benar. Pastikan
            semua informasi sesuai dengan data awal yang kamu gunakan saat
            melakukan pembelian tiket.
          </DialogDescription>
        </DialogHeader>
        <form
          className="relative z-2 mt-5 space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();
            setIsConfirmOpen(true);
          }}
        >
          <formHook.Field name="reason">
            {(field) => (
              <div className="space-y-2">
                <label className="font-sans-2 text-sm" htmlFor={field.name}>
                  Alasan Pembatalan <span className="text-red-500">*</span>
                </label>
                <Textarea
                  className="min-h-22.5 rounded-lg border-white/15 bg-white/90 text-black placeholder:text-gray-500"
                  id={field.name}
                  name={field.name}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  placeholder="Ex : Pergantian Jadwal Tiket"
                  required
                  rows={3}
                  value={field.state.value}
                />
              </div>
            )}
          </formHook.Field>

          <div className="space-y-2">
            <label className="font-sans-2 text-sm" htmlFor="paymentMethod">
              Metode Pembayaran <span className="text-red-500">*</span>
            </label>
            <Input
              className="pointer-events-none h-9 rounded-lg border-white/15 bg-white/90 text-black placeholder:text-gray-500"
              id="paymentMethod"
              readOnly
              value={orderInfo.paymentMethod}
            />
          </div>

          {isManualPayment ? (
            <formHook.Field name="paymentProof">
              {(field) => (
                <div className="space-y-2">
                  <label className="font-sans-2 text-sm" htmlFor={field.name}>
                    Bukti Pembayaran <span className="text-red-500">*</span>
                  </label>
                  <Input
                    accept="image/*"
                    className="h-9 rounded-lg border-white/15 bg-white/90 text-black"
                    id={field.name}
                    name={field.name}
                    onBlur={field.handleBlur}
                    onChange={(event) =>
                      field.handleChange(event.target.files?.[0] ?? null)
                    }
                    required
                    type="file"
                  />
                  {field.state.value ? (
                    <p className="font-sans-2 text-[11px] text-gray-300">
                      File dipilih: {field.state.value.name}
                    </p>
                  ) : null}
                </div>
              )}
            </formHook.Field>
          ) : null}

          <formHook.Field name="bankName">
            {(field) => (
              <div className="space-y-2">
                <label className="font-sans-2 text-sm" htmlFor={field.name}>
                  Nama Bank <span className="text-red-500">*</span>
                </label>
                <Input
                  className="h-9 rounded-lg border-white/15 bg-white/90 text-black placeholder:text-gray-500"
                  id={field.name}
                  name={field.name}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  placeholder="Ex : BNI"
                  required
                  value={field.state.value}
                />
              </div>
            )}
          </formHook.Field>

          <formHook.Field name="bankAccountNumber">
            {(field) => (
              <div className="space-y-2">
                <label className="font-sans-2 text-sm" htmlFor={field.name}>
                  Nomor Rekening Bank <span className="text-red-500">*</span>
                </label>
                <Input
                  className="h-9 rounded-lg border-white/15 bg-white/90 text-black placeholder:text-gray-500"
                  id={field.name}
                  name={field.name}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  placeholder="Ex : 17238694"
                  required
                  value={field.state.value}
                />
              </div>
            )}
          </formHook.Field>

          <formHook.Field name="bankAccountHolder">
            {(field) => (
              <div className="space-y-2">
                <label className="font-sans-2 text-sm" htmlFor={field.name}>
                  Nama Pemilik Rekening <span className="text-red-500">*</span>
                </label>
                <Input
                  className="h-9 rounded-lg border-white/15 bg-white/90 text-black placeholder:text-gray-500"
                  id={field.name}
                  name={field.name}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  placeholder="Ex : John Doe"
                  required
                  value={field.state.value}
                />
              </div>
            )}
          </formHook.Field>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <Button
              className="w-full rounded-lg border-red-500/90 bg-transparent text-white hover:bg-red-500/10"
              onClick={onClose}
              type="button"
              variant="outline"
            >
              Kembali
            </Button>
            <formHook.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
            >
              {([canSubmit, isFormSubmitting]) => (
                <Button
                  className="w-full rounded-lg"
                  disabled={!canSubmit || isFormSubmitting || isSubmitting}
                  type="submit"
                  variant="store-primary"
                >
                  {isSubmitting ? "Submitting..." : "Lanjutkan"}
                </Button>
              )}
            </formHook.Subscribe>
          </div>
        </form>

        {isConfirmOpen ? (
          <Dialog onOpenChange={setIsConfirmOpen} open>
            <DialogContent className="max-w-md rounded-2xl border border-white/20 bg-black p-6 text-white shadow-2xl *:data-[slot=dialog-close]:z-20 *:data-[slot=dialog-close]:bg-transparent *:data-[slot=dialog-close]:text-white">
              <DialogHeader>
                <DialogTitle className="font-serif-2 text-2xl text-white">
                  Confirm submission
                </DialogTitle>
                <DialogDescription className="mt-2 font-sans-2 text-gray-2 text-gray-400 text-sm">
                  Submit this refund request? You cannot edit it after
                  submission.
                </DialogDescription>
              </DialogHeader>

              <DialogFooter className="mt-6 flex items-center justify-end gap-3 sm:flex-row sm:justify-end">
                <Button
                  className="rounded-xl py-1 text-black"
                  disabled={isSubmitting}
                  onClick={() => setIsConfirmOpen(false)}
                  type="button"
                  variant="outline"
                >
                  Cancel
                </Button>
                <formHook.Subscribe
                  selector={(state) => [state.canSubmit, state.isSubmitting]}
                >
                  {([canSubmit, isFormSubmitting]) => (
                    <Button
                      disabled={!canSubmit || isFormSubmitting || isSubmitting}
                      onClick={async () => {
                        setIsConfirmOpen(false);
                        await formHook.handleSubmit();
                      }}
                      type="button"
                      variant="store-primary"
                    >
                      {isSubmitting ? "Submitting..." : "Confirm"}
                    </Button>
                  )}
                </formHook.Subscribe>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
