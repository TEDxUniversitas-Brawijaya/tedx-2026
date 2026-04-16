import { Button } from "@tedx-2026/ui/components/button";
import { Input } from "@tedx-2026/ui/components/input";
import { Textarea } from "@tedx-2026/ui/components/textarea";
import { useState } from "react";
import chandalier from "@/assets/imgs/chandelier-1.png";
import textureBlack from "@/assets/imgs/texture-black.png";
import type { useRefundRequestForm } from "../hooks/use-refund-request-form";
import type { RefundOrderInfo } from "../types";

type RefundRequestFormProps = {
  orderInfo: RefundOrderInfo;
  form: ReturnType<typeof useRefundRequestForm>;
};

export function RefundRequestForm({ orderInfo, form }: RefundRequestFormProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  return (
    <section className="relative min-h-screen overflow-hidden px-4 py-36 sm:px-6 lg:px-8">
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

      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-4xl items-center justify-center">
        <div className="relative w-full max-w-107.5 overflow-clip rounded-3xl border border-white/10 bg-[#262626]/90 p-6 text-white shadow-[0_0_65px_rgba(255,149,0,0.25)] backdrop-blur-sm sm:p-7">
          <img
            alt="chandalier"
            aria-hidden
            className="pointer-events-none absolute -top-14 -right-18 w-56 opacity-25"
            height={256}
            src={chandalier}
            width={256}
          />
          <header className="relative z-2 pr-2 sm:pr-10">
            <h1 className="font-serif-2 text-2xl leading-none">Form Refund</h1>
            <p className="mt-3 font-medium font-sans-2 text-gray-300 text-xs italic">
              Silakan isi data pada formulir di bawah ini dengan benar. Pastikan
              semua informasi sesuai dengan data awal yang kamu gunakan saat
              melakukan pembelian tiket.
            </p>
          </header>
          <form
            className="relative z-2 mt-5 space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              setIsConfirmOpen(true);
            }}
          >
            <div className="space-y-2">
              <label className="font-sans-2 text-sm" htmlFor="reason">
                Alasan Pembatalan <span className="text-red-500">*</span>
              </label>
              <Textarea
                className="min-h-[90px] rounded-lg border-white/15 bg-white/90 text-black placeholder:text-gray-500"
                id="reason"
                onChange={(event) => form.setReason(event.target.value)}
                placeholder="Ex : Pergantian Jadwal Tiket"
                required
                rows={3}
                value={form.reason}
              />
            </div>

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

            {form.isManualPayment ? (
              <div className="space-y-2">
                <label className="font-sans-2 text-sm" htmlFor="paymentProof">
                  Bukti Pembayaran <span className="text-red-500">*</span>
                </label>
                <Input
                  accept="image/*"
                  className="h-9 rounded-lg border-white/15 bg-white/90 text-black"
                  id="paymentProof"
                  onChange={(event) =>
                    form.setPaymentProof(event.target.files?.[0] ?? null)
                  }
                  required
                  type="file"
                />
                {form.paymentProof ? (
                  <p className="font-sans-2 text-[11px] text-gray-300">
                    File dipilih: {form.paymentProof.name}
                  </p>
                ) : null}
              </div>
            ) : null}

            <div className="space-y-2">
              <label className="font-sans-2 text-sm" htmlFor="bankName">
                Nama Bank <span className="text-red-500">*</span>
              </label>
              <Input
                className="h-9 rounded-lg border-white/15 bg-white/90 text-black placeholder:text-gray-500"
                id="bankName"
                onChange={(event) => form.setBankName(event.target.value)}
                placeholder="Ex : BNI"
                required
                value={form.bankName}
              />
            </div>

            <div className="space-y-2">
              <label
                className="font-sans-2 text-sm"
                htmlFor="bankAccountNumber"
              >
                Nomor Rekening Bank <span className="text-red-500">*</span>
              </label>
              <Input
                className="h-9 rounded-lg border-white/15 bg-white/90 text-black placeholder:text-gray-500"
                id="bankAccountNumber"
                onChange={(event) =>
                  form.setBankAccountNumber(event.target.value)
                }
                placeholder="Ex : 17238694"
                required
                value={form.bankAccountNumber}
              />
            </div>

            <div className="space-y-2">
              <label
                className="font-sans-2 text-sm"
                htmlFor="bankAccountHolder"
              >
                Nama Pemilik Rekening <span className="text-red-500">*</span>
              </label>
              <Input
                className="h-9 rounded-lg border-white/15 bg-white/90 text-black placeholder:text-gray-500"
                id="bankAccountHolder"
                onChange={(event) =>
                  form.setBankAccountHolder(event.target.value)
                }
                placeholder="Ex : John Doe"
                required
                value={form.bankAccountHolder}
              />
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <Button
                className="w-full rounded-lg border-red-500/90 bg-transparent text-white hover:bg-red-500/10"
                onClick={() => {
                  window.history.back();
                }}
                type="button"
                variant="outline"
              >
                Kembali
              </Button>
              <Button
                className="w-full rounded-lg"
                disabled={form.isSubmitDisabled}
                type="submit"
                variant="store-primary"
              >
                {form.isSubmitting ? "Submitting..." : "Lanjutkan"}
              </Button>
            </div>
          </form>

          {isConfirmOpen ? (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
              <div className="w-full max-w-md rounded-2xl border border-white/20 bg-black p-6 shadow-2xl">
                <h2 className="font-serif-2 text-2xl">Confirm submission</h2>
                <p className="mt-2 font-sans-2 text-gray-2 text-sm">
                  Submit this refund request? You cannot edit it after
                  submission.
                </p>

                <div className="mt-6 flex items-center justify-end gap-3">
                  <Button
                    disabled={form.isSubmitting}
                    onClick={() => setIsConfirmOpen(false)}
                    type="button"
                    variant="outline"
                  >
                    Cancel
                  </Button>
                  <Button
                    disabled={form.isSubmitting || form.isSubmitDisabled}
                    onClick={async () => {
                      setIsConfirmOpen(false);
                      await form.submitRequest();
                    }}
                    type="button"
                    variant="store-primary"
                  >
                    {form.isSubmitting ? "Submitting..." : "Confirm"}
                  </Button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
