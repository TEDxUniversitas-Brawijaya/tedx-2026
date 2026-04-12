import { Button } from "@tedx-2026/ui/components/button";
import { DialogHeader, DialogTitle } from "@tedx-2026/ui/components/dialog";
import {
  formatCountdownClock,
  formatIdrCurrency,
} from "../../../lib/order-management-utils";
import type { PaymentStepViewProps } from "../../../types/order-step";

const paymentContentClassName =
  "mt-3 min-h-0 flex-1 space-y-2.5 overflow-y-hidden [@media(max-height:900px)]:overflow-y-auto pr-1 sm:space-y-3 sm:pr-2 [scrollbar-color:rgba(224,224,224,0.35)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/30 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-white/45";

export function PaymentStep({
  isCheckingStatus,
  onCheckStatus,
  orderId,
  qrisUrl,
  timeLeftSeconds,
  totalPrice,
}: PaymentStepViewProps) {
  return (
    <div className="flex min-h-0 flex-col overflow-hidden font-sans-2 sm:h-[94vh] sm:max-h-[84vh]">
      <DialogHeader>
        <DialogTitle className="font-serif-2 text-lg sm:text-xl">
          Payment
        </DialogTitle>
      </DialogHeader>

      <div className={paymentContentClassName}>
        <div className="flex items-center justify-between border-gray-2 border-b pb-3">
          <span className="font-sans-2 text-gray-2 text-sm">Total</span>
          <span className="font-sans-2 text-base text-gray-2 sm:text-lg">
            {formatIdrCurrency(totalPrice)}
          </span>
        </div>
        <div className="flex items-center justify-between border-gray-2 border-b pb-3">
          <span className="font-sans-2 text-gray-2 text-sm">Order ID</span>
          <span className="font-sans-2 text-gray-2 text-sm sm:text-base">
            {orderId ?? "-"}
          </span>
        </div>

        <div className="pt-1">
          <p className="text-center font-sans-2 text-base text-gray-2 sm:text-lg">
            Bayar dalam {formatCountdownClock(timeLeftSeconds)}
          </p>
        </div>

        <div className="flex justify-center pt-1 pb-0 sm:pt-1.5 sm:pb-0.5">
          <div className="relative w-full max-w-44 overflow-hidden rounded-2xl bg-white p-2 shadow-2xl sm:max-w-52 sm:p-2.5">
            <img
              alt="QRIS"
              className="mx-auto h-auto w-full object-contain"
              height={360}
              src={qrisUrl}
              width={360}
            />
          </div>
        </div>
      </div>

      <div className="mt-auto bg-black pt-2.5 pb-2 sm:pb-3">
        <Button
          className="w-full"
          disabled={!orderId || isCheckingStatus}
          onClick={onCheckStatus}
          size="checkout"
          variant="primary"
        >
          {isCheckingStatus ? "Memeriksa..." : "Cek Status Pembayaran"}
        </Button>
      </div>
    </div>
  );
}
