import { Button } from "@tedx-2026/ui/components/button";
import { CheckIcon } from "lucide-react";
import { useTicketCheckoutStore } from "../../stores/use-ticket-checkout-store";

export function TicketSuccessStep() {
  const { closeCheckout } = useTicketCheckoutStore();

  return (
    <div className="flex max-h-[80vh] flex-col items-center justify-center py-6 text-center sm:py-12">
      <div className="absolute top-0 right-0 h-48 w-48 opacity-20 transition-opacity hover:opacity-100" />

      <CheckIcon
        className="h-16 w-16 text-white sm:h-24 sm:w-24"
        strokeWidth={3}
      />

      <div className="max-w-md space-y-4 px-2 sm:space-y-6 sm:px-4">
        <p className="font-sans-2 text-sm text-white leading-relaxed sm:text-base">
          Pembayaran kamu sedang diproses. Silakan menunggu konfirmasi
          selanjutnya melalui email.
        </p>
        <p className="font-sans-2 text-sm text-white leading-relaxed sm:text-base">
          Jangan lupa cek folder Spam, Promotions, atau Updates untuk memastikan
          kamu tidak melewatkan informasi penting dari kami.
        </p>
        <p className="font-sans-2 text-sm text-white leading-relaxed sm:text-base">
          Kami tidak sabar menyambut ceritamu dan membangun rumah kita bersama
          di TEDxUniversitas Brawijaya 2026!
        </p>
      </div>

      <div className="mt-6 w-full max-w-sm sm:mt-12">
        <Button
          className="w-full"
          onClick={closeCheckout}
          size="checkout"
          variant="store-primary"
        >
          Tutup
        </Button>
      </div>
    </div>
  );
}
