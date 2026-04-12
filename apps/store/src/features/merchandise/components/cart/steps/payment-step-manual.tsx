import { Button } from "@tedx-2026/ui/components/button";
import { DialogHeader, DialogTitle } from "@tedx-2026/ui/components/dialog";
import { formatIdrCurrency } from "../../../lib/order-management-utils";
import type { PaymentManualStepViewProps } from "../../../types/order-step";

const manualPaymentContentClassName =
  "mt-1 min-h-0 flex-1 space-y-2 overflow-y-auto pr-1 pb-3 sm:space-y-2.5 sm:pr-2 sm:pb-4 [scrollbar-color:rgba(224,224,224,0.35)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/30 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-white/45";

export function PaymentStepManual({
  canUploadProof,
  fileInputId,
  isCheckingStatus,
  onBack,
  onCheckStatus,
  onFileChange,
  onUploadProof,
  orderId,
  selectedFileName,
  totalPrice,
  uploadUrl,
}: PaymentManualStepViewProps) {
  return (
    <div className="flex max-h-[80vh] min-h-0 flex-col overflow-hidden font-sans-2">
      <DialogHeader>
        <DialogTitle className="font-serif-2 text-base sm:text-lg">
          Payment
        </DialogTitle>
      </DialogHeader>

      <div className={manualPaymentContentClassName}>
        <div className="flex w-full items-center justify-between border-gray-2/40 border-b pb-2">
          <span className="font-sans-2 text-gray-2 text-sm">Total</span>
          <span className="font-sans-2 text-base text-white sm:text-lg">
            {formatIdrCurrency(totalPrice)}
          </span>
        </div>
        <div className="flex w-full items-center justify-between border-gray-2/40 border-b pb-2">
          <span className="font-sans-2 text-gray-2 text-sm">Order ID</span>
          <span className="font-sans-2 text-sm text-white sm:text-base">
            {orderId ?? "-"}
          </span>
        </div>

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

      <div className="mt-auto bg-black pt-2.5 pb-2 sm:pb-3">
        {uploadUrl ? (
          <div className="space-y-3">
            <div className="space-y-2">
              <label
                className="block font-sans-2 text-sm text-white"
                htmlFor={fileInputId}
              >
                Bukti Pembayaran<span className="text-red-2">*</span>
              </label>

              <div className="flex h-11 items-center overflow-hidden rounded-lg border border-gray-2/40 bg-white text-black">
                <label
                  className="h-full px-4"
                  htmlFor={fileInputId}
                  style={{
                    alignItems: "center",
                    borderRight: "1px solid rgb(212 212 212)",
                    color: "rgb(115 115 115)",
                    cursor: "pointer",
                    display: "flex",
                    fontSize: "0.875rem",
                  }}
                >
                  Upload
                </label>
                <span
                  className="px-4"
                  style={{
                    color: "rgb(115 115 115)",
                    fontSize: "0.875rem",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {selectedFileName ?? "Belum ada file"}
                </span>
              </div>

              <input
                accept="image/*,.pdf"
                className="sr-only"
                id={fileInputId}
                onChange={onFileChange}
                type="file"
              />
            </div>

            <div className="flex gap-2 sm:gap-3">
              <Button
                className="w-2/5"
                onClick={onBack}
                size="checkout"
                variant="ghost-white"
              >
                Kembali
              </Button>

              <Button
                className="w-3/5"
                disabled={!canUploadProof}
                onClick={onUploadProof}
                size="checkout"
                type="button"
                variant="primary"
              >
                Upload Bukti Pembayaran
              </Button>
            </div>
          </div>
        ) : (
          <Button
            className="w-full"
            disabled={!orderId || isCheckingStatus}
            onClick={onCheckStatus}
            size="checkout"
            variant="primary"
          >
            {isCheckingStatus ? "Memeriksa..." : "Cek Status Pembayaran"}
          </Button>
        )}
      </div>
    </div>
  );
}
