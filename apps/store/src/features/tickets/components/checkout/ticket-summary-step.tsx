import { Button } from "@tedx-2026/ui/components/button";
import { useTicketCreateOrderForm } from "../../hooks/use-ticket-create-order-form";
import { formatIdrCurrency } from "../../lib/formatter";
import { useTicketCheckoutStore } from "../../stores/use-ticket-checkout-store";

export const TicketSummaryStep = () => {
  const { buyer, selectedProduct, quantity, selectedBundleItemId, onPrevStep } =
    useTicketCheckoutStore();
  const { form, isPending } = useTicketCreateOrderForm();

  if (!(buyer && selectedProduct)) {
    return null;
  }

  return (
    <form
      className="space-y-5"
      id="ticket-summary-form"
      onSubmit={(event) => {
        event.preventDefault();
        form.handleSubmit();
      }}
    >
      <div className="space-y-2 rounded-xl border border-white/10 bg-white/5 p-4 font-sans-2 text-sm">
        <p>Nama: {buyer.buyerName}</p>
        <p>Email: {buyer.buyerEmail}</p>
        <p>Telepon: {buyer.phone}</p>
        <p>Instansi: {buyer.buyerInstansi}</p>
        <p>
          Produk: {selectedProduct.name} x{quantity}
        </p>
        {selectedBundleItemId && <p>Bundle pilihan: {selectedBundleItemId}</p>}
      </div>
      <div className="flex items-center justify-between">
        <p className="font-sans-2 text-sm">Total</p>
        <p className="font-sans-2 text-lg">
          {formatIdrCurrency(selectedProduct.price * quantity)}
        </p>
      </div>
      <div className="flex gap-2">
        <Button
          className="flex-1"
          onClick={onPrevStep}
          type="button"
          variant="store-secondary"
        >
          Kembali
        </Button>
        <Button
          className="flex-1"
          disabled={isPending}
          type="submit"
          variant="store-primary"
        >
          {isPending ? "Memproses..." : "Bayar"}
        </Button>
      </div>
    </form>
  );
};
