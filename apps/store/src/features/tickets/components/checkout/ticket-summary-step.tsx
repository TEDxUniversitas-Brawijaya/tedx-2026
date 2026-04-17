import { Button } from "@tedx-2026/ui/components/button";
import { DialogHeader, DialogTitle } from "@tedx-2026/ui/components/dialog";
import { formatIdrCurrency } from "../../lib/formatter";

type TicketSummaryStepProps = {
  buyer: {
    buyerName: string;
    buyerEmail: string;
    phone: string;
    buyerInstansi: string;
  };
  selectedProduct: {
    name: string;
    description: string | null;
    price: number;
  };
  quantity: number;
  onPrevStep: () => void;
  onNextStep: () => void;
};

export const TicketSummaryStep = ({
  buyer,
  selectedProduct,
  quantity,
  onPrevStep,
  onNextStep,
}: TicketSummaryStepProps) => {
  return (
    <div className="flex max-h-[80vh] flex-col">
      <DialogHeader className="text-left">
        <DialogTitle className="font-normal font-serif-2 text-2xl text-gray-2 sm:text-3xl">
          Quick Summary
        </DialogTitle>
      </DialogHeader>

      <div className="no-scrollbar mt-6 flex-1 space-y-8 overflow-x-hidden overflow-y-scroll pr-2">
        {/* Informasi Pembelian */}
        <div>
          <h5 className="mb-4 font-sans-2 text-gray-2 text-xs">
            Informasi Pembelian
          </h5>
          <div className="space-y-4 font-sans-2 text-sm">
            <div className="flex items-start justify-between gap-4 border-white/10 border-b pb-4">
              <span className="shrink-0 text-gray-2">Tiket yang Dibeli</span>
              <span className="max-w-[60%] text-right font-bold text-gray-2">
                {selectedProduct.name}
                {selectedProduct.description &&
                  ` (${selectedProduct.description})`}
              </span>
            </div>
            <div className="flex items-start justify-between gap-4 border-white/10 border-b pb-4">
              <span className="text-gray-2">Jumlah Tiket</span>
              <span className="text-right font-bold text-gray-2">
                {quantity}
              </span>
            </div>
            <div className="flex items-start justify-between gap-4 border-white/10 border-b pb-4">
              <span className="text-gray-2">Harga</span>
              <span className="text-right font-bold text-gray-2">
                {formatIdrCurrency(selectedProduct.price)} (x{quantity})
              </span>
            </div>
            <div className="flex items-start justify-between gap-4 py-2">
              <span className="text-gray-2">Total</span>
              <span className="text-right font-bold text-gray-2">
                {formatIdrCurrency(selectedProduct.price * quantity)}
              </span>
            </div>
          </div>
        </div>

        {/* Identitas */}
        <div>
          <h5 className="mb-4 font-bold font-sans-2 text-gray-2 text-xs">
            Identitas
          </h5>
          <div className="space-y-4 font-sans-2 text-sm">
            <div className="flex items-start justify-between border-white/5 border-b pb-4">
              <span className="text-gray-2">Nama Lengkap</span>
              <span className="text-right font-bold text-gray-2">
                {buyer.buyerName}
              </span>
            </div>
            <div className="flex items-start justify-between border-white/5 border-b pb-4">
              <span className="text-gray-2">Email</span>
              <span className="max-w-50 truncate text-right font-bold text-gray-2">
                {buyer.buyerEmail}
              </span>
            </div>
            <div className="flex items-start justify-between border-white/5 border-b pb-4">
              <span className="text-gray-2">No. Telp</span>
              <span className="text-right font-bold text-gray-2">
                {buyer.phone}
              </span>
            </div>
            <div className="flex items-start justify-between pt-2">
              <span className="shrink-0 text-gray-2">Institusi</span>
              <span className="max-w-62.5 pl-4 text-right font-bold text-gray-2">
                {buyer.buyerInstansi}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex gap-4">
        <Button
          className="flex-1"
          onClick={onPrevStep}
          size="checkout"
          variant="store-secondary"
        >
          Kembali
        </Button>
        <Button
          className="flex-1"
          onClick={onNextStep}
          size="checkout"
          variant="store-primary"
        >
          Lanjutkan
        </Button>
      </div>
    </div>
  );
};
