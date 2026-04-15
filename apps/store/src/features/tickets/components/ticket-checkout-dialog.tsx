// Checkout dialog presenter: renders selection, identification, summary, and payment steps.
import { formatIdrCurrency } from "@/features/merchandise/lib/formatter";
import { Button } from "@tedx-2026/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@tedx-2026/ui/components/dialog";
import { MinusIcon, PlusIcon } from "lucide-react";
import type { TicketCheckoutStep } from "../types/checkout";
import type { TicketBuyer, TicketOrder, TicketProduct } from "../types/ticket";
import { TicketIdentificationStep } from "./ticket-identification-step";

export type TicketBundleOption = {
  id: string;
  label: string;
};

export type TicketCheckoutDialogProps = {
  isOpen: boolean;
  step: TicketCheckoutStep;
  product: TicketProduct | null;
  quantity: number;
  selectedBundleItemId?: string;
  bundleOptions: TicketBundleOption[];
  buyer: TicketBuyer | null;
  order: TicketOrder | null;
  isSubmitting: boolean;
  onOpenChange: (open: boolean) => void;
  onIncrease: () => void;
  onDecrease: () => void;
  onBundleSelect: (id: string) => void;
  onNextFromSelection: () => void;
  onBackToSelection: () => void;
  onBuyerSubmit: (buyer: TicketBuyer) => void;
  onBackToIdentification: () => void;
  onCreateOrder: () => void;
  onOpenOrderDetail: () => void;
};

export const TicketCheckoutDialog = ({
  isOpen,
  step,
  product,
  quantity,
  selectedBundleItemId,
  bundleOptions,
  buyer,
  order,
  isSubmitting,
  onOpenChange,
  onIncrease,
  onDecrease,
  onBundleSelect,
  onNextFromSelection,
  onBackToSelection,
  onBuyerSubmit,
  onBackToIdentification,
  onCreateOrder,
  onOpenOrderDetail,
}: TicketCheckoutDialogProps) => {
  if (!product) {
    return null;
  }

  const maxQty =
    product.stock === null ? 5 : Math.min(5, Math.max(1, product.stock));

  return (
    <Dialog onOpenChange={onOpenChange} open={isOpen}>
      <DialogContent className="max-h-[90vh] max-w-[90vw] overflow-y-auto rounded-3xl border-none bg-black p-6 text-white md:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-serif-2 text-xl">
            Checkout Ticket
          </DialogTitle>
        </DialogHeader>

        {step === "selection" && (
          <div className="space-y-5" id="ticket-checkout-selection">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <h4 className="font-serif-2 text-lg">{product.name}</h4>
              <p className="mt-1 font-sans-2 text-sm text-white/75">
                {product.stock === null
                  ? "Stok tak terbatas"
                  : `Sisa stok: ${product.stock}`}
              </p>
              <p className="mt-3 font-sans-2 text-lg">
                {formatIdrCurrency(product.price)}
              </p>
            </div>

            <div>
              <p className="font-sans-2 text-sm">Jumlah tiket (max {maxQty})</p>
              <div className="mt-2 inline-flex items-center gap-4 rounded-full border border-white/20 px-4 py-2">
                <button onClick={onDecrease} type="button">
                  <MinusIcon size={18} />
                </button>
                <span className="w-6 text-center font-sans-2">{quantity}</span>
                <button onClick={onIncrease} type="button">
                  <PlusIcon size={18} />
                </button>
              </div>
            </div>

            {bundleOptions.length > 0 && (
              <div className="space-y-2">
                <p className="font-sans-2 text-sm">Pilih item bundling</p>
                {bundleOptions.map((option) => (
                  <label
                    className="flex cursor-pointer items-center gap-2"
                    key={option.id}
                  >
                    <input
                      checked={selectedBundleItemId === option.id}
                      name="bundle-option"
                      onChange={() => onBundleSelect(option.id)}
                      type="radio"
                    />
                    <span className="font-sans-2 text-sm">{option.label}</span>
                  </label>
                ))}
              </div>
            )}

            <Button
              className="w-full"
              onClick={onNextFromSelection}
              variant="store-primary"
            >
              Lanjutkan
            </Button>
          </div>
        )}

        {step === "identification" && (
          <TicketIdentificationStep
            buyer={buyer}
            onBack={onBackToSelection}
            onSubmit={onBuyerSubmit}
          />
        )}

        {step === "summary" && buyer && (
          <div className="space-y-5" id="ticket-checkout-summary">
            <div className="space-y-2 rounded-xl border border-white/10 bg-white/5 p-4 font-sans-2 text-sm">
              <p>Nama: {buyer.buyerName}</p>
              <p>Email: {buyer.buyerEmail}</p>
              <p>Telepon: {buyer.buyerPhone}</p>
              <p>Instansi: {buyer.buyerInstansi}</p>
              <p>
                Produk: {product.name} x{quantity}
              </p>
              {selectedBundleItemId && (
                <p>Bundle pilihan: {selectedBundleItemId}</p>
              )}
            </div>
            <div className="flex items-center justify-between">
              <p className="font-sans-2 text-sm">Total</p>
              <p className="font-sans-2 text-lg">
                {formatIdrCurrency(product.price * quantity)}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                className="flex-1"
                onClick={onBackToIdentification}
                variant="store-secondary"
              >
                Kembali
              </Button>
              <Button
                className="flex-1"
                disabled={isSubmitting}
                onClick={onCreateOrder}
                variant="store-primary"
              >
                {isSubmitting ? "Memproses..." : "Bayar"}
              </Button>
            </div>
          </div>
        )}

        {step === "payment" && order && (
          <div className="space-y-4" id="ticket-checkout-payment">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 font-sans-2 text-sm">
              <p>Order ID: {order.orderId}</p>
              <p>Status: {order.status}</p>
              <p>Total: {formatIdrCurrency(order.totalPrice)}</p>
              <p>
                Batas pembayaran: {new Date(order.expiresAt).toLocaleString()}
              </p>
            </div>

            {"qrisUrl" in order.payment ? (
              <img
                alt="QRIS"
                className="mx-auto w-56 rounded-xl bg-white p-2"
                height={224}
                src={order.payment.qrisUrl}
                width={224}
              />
            ) : (
              <a
                className="block rounded-xl border border-white/20 p-3 text-center font-sans-2 text-sm text-white underline"
                href={order.payment.uploadUrl}
                rel="noreferrer"
                target="_blank"
              >
                Buka link upload bukti bayar
              </a>
            )}

            <Button
              className="w-full"
              onClick={onOpenOrderDetail}
              variant="store-primary"
            >
              Lihat Detail Pesanan
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
