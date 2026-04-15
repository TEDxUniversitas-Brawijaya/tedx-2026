import { Button } from "@tedx-2026/ui/components/button";
import { formatIdrCurrency } from "../../lib/formatter";
import { useTicketCheckoutStore } from "../../stores/use-ticket-checkout-store";

export const TicketPaymentStep = () => {
  const { order, closeCheckout, openOrderDetail } = useTicketCheckoutStore();

  if (!order) {
    return null;
  }

  const isQrisPayment = order.status === "pending_payment";

  return (
    <div className="space-y-4" id="ticket-checkout-payment">
      <div className="rounded-xl border border-white/10 bg-white/5 p-4 font-sans-2 text-sm">
        <p>Order ID: {order.orderId}</p>
        <p>Status: {order.status}</p>
        <p>Total: {formatIdrCurrency(order.totalPrice)}</p>
        <p>Batas pembayaran: {new Date(order.expiresAt).toLocaleString()}</p>
      </div>

      {isQrisPayment ? (
        <img
          alt="QRIS"
          className="mx-auto w-56 rounded-xl bg-white p-2"
          height={224}
          src={(order.payment as { qrisUrl: string }).qrisUrl}
          width={224}
        />
      ) : (
        <a
          className="block rounded-xl border border-white/20 p-3 text-center font-sans-2 text-sm text-white underline"
          href={(order.payment as { uploadUrl: string }).uploadUrl}
          rel="noreferrer"
          target="_blank"
        >
          Buka link upload bukti bayar
        </a>
      )}

      <Button
        className="w-full"
        onClick={() => {
          closeCheckout();
          openOrderDetail();
        }}
        variant="store-primary"
      >
        Lihat Detail Pesanan
      </Button>
    </div>
  );
};
