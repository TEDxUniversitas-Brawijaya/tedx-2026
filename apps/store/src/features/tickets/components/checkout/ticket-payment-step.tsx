import { useMemo } from "react";
import { trpc } from "@/shared/lib/trpc";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@tedx-2026/ui/components/button";
import { DialogHeader, DialogTitle } from "@tedx-2026/ui/components/dialog";
import { toast } from "sonner";
import { useCountdownSeconds } from "../../hooks/use-countdown-seconds";
import { formatCountdownClock, formatIdrCurrency } from "../../lib/formatter";

import { useTicketCheckoutStore } from "../../stores/use-ticket-checkout-store";

export const TicketPaymentStep = () => {
  const { onNextStep, closeCheckout, order } = useTicketCheckoutStore();

  const orderStatusQuery = useQuery(
    trpc.ticket.getOrderStatus.queryOptions(
      { orderId: order?.orderId ?? "" },
      { enabled: !!order }
    )
  );

  const durationInSeconds = useMemo(() => {
    if (!order?.expiresAt) {
      return 0;
    }
    return Math.max(
      0,
      Math.floor((new Date(order.expiresAt).getTime() - Date.now()) / 1000)
    );
  }, [order?.expiresAt]);

  const timeLeftSeconds = useCountdownSeconds(durationInSeconds);

  if (!order) {
    return null;
  }

  const onCheckStatus = async () => {
    const result = await orderStatusQuery.refetch();

    if (result.error) {
      toast.error("Gagal memeriksa status pembayaran. Silakan coba lagi.");
      return;
    }

    if (!result.data || result.data.status !== "paid") {
      toast.error("Pembayaran belum diterima. Pastikan Anda sudah membayar.");
      return;
    }

    onNextStep();
  };

  const isQrisPayment = order.status === "pending_payment" && order.qrisUrl;

  return (
    <div className="flex min-h-0 flex-col overflow-hidden font-sans-2 sm:h-[94vh] sm:max-h-[84vh]">
      <DialogHeader className="text-left">
        <DialogTitle className="font-serif-2 text-lg sm:text-xl">
          Payment
        </DialogTitle>
      </DialogHeader>

      <div
        className="no-scrollbar mt-3 min-h-0 flex-1 space-y-2.5 overflow-x-hidden overflow-y-scroll pr-1"
        id="ticket-checkout-payment"
      >
        <div className="flex items-center justify-between border-white/20 border-b pb-3">
          <span className="font-sans-2 text-[#E0E0E0] text-sm">Total</span>
          <span className="font-bold font-sans-2 text-base text-white sm:text-lg">
            {formatIdrCurrency(order.totalPrice)}
          </span>
        </div>
        <div className="flex items-center justify-between border-white/20 border-b pb-3">
          <span className="font-sans-2 text-[#E0E0E0] text-sm">Order ID</span>
          <span className="font-sans-2 text-sm text-white sm:text-base">
            {order.orderId}
          </span>
        </div>

        {order.status === "pending_payment" && (
          <div className="pt-1">
            <p className="text-center font-sans-2 text-[#E0E0E0] text-base sm:text-lg">
              Bayar dalam {formatCountdownClock(timeLeftSeconds)}
            </p>
          </div>
        )}

        <div className="flex justify-center pt-1 pb-0 sm:pt-1.5 sm:pb-0.5">
          {isQrisPayment ? (
            <div className="relative w-full max-w-44 overflow-hidden rounded-2xl bg-white p-2 shadow-2xl sm:max-w-52 sm:p-2.5">
              <img
                alt="QRIS"
                className="mx-auto h-auto w-full object-contain"
                height={360}
                src={order.qrisUrl ?? undefined}
                width={360}
              />
            </div>
          ) : (
            <div className="w-full text-center">
              <p className="mb-4 font-sans-2 text-[#E0E0E0] text-sm">
                Silakan lakukan pembayaran sesuai instruksi.
              </p>
              {order.uploadUrl && (
                <a
                  className="mx-auto block w-full max-w-sm rounded-xl border border-white/20 bg-white/5 p-4 font-sans-2 text-sm text-white hover:bg-white/10"
                  href={order.uploadUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  Buka link upload bukti bayar
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mt-auto bg-black pt-2.5 pb-2 sm:pb-3">
        {order.status === "pending_payment" ? (
          <Button
            className="w-full"
            disabled={orderStatusQuery.isFetching}
            onClick={onCheckStatus}
            size="checkout"
            variant="store-primary"
          >
            {orderStatusQuery.isFetching
              ? "Memeriksa..."
              : "Cek Status Pembayaran"}
          </Button>
        ) : (
          <Button
            className="w-full"
            onClick={closeCheckout}
            size="checkout"
            variant="store-primary"
          >
            Tutup
          </Button>
        )}
      </div>
    </div>
  );
};
