import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@tedx-2026/ui/components/dialog";
import { useTicketCheckoutStore } from "../../stores/use-ticket-checkout-store";
import { TicketIdentificationStep } from "./ticket-identification-step";
import { TicketPaymentStep } from "./ticket-payment-step";
import { TicketSelectionStep } from "./ticket-selection-step";
import { TicketSummaryStep } from "./ticket-summary-step";

export const TicketCheckoutModal = () => {
  const { isCheckoutOpen, closeCheckout } = useTicketCheckoutStore();

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) {
          closeCheckout();
        }
      }}
      open={isCheckoutOpen}
    >
      <DialogContent className="max-h-[90vh] max-w-[90vw] overflow-y-auto rounded-3xl border-none bg-black p-6 text-white md:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-serif-2 text-xl">
            Checkout Ticket
          </DialogTitle>
        </DialogHeader>
        <TicketCheckoutContent />
      </DialogContent>
    </Dialog>
  );
};

const TicketCheckoutContent = () => {
  const { checkoutStep, selectedProduct, buyer, order } =
    useTicketCheckoutStore();

  if (checkoutStep === "selection") {
    if (!selectedProduct) {
      throw new Error(
        "Trying to access selection step but didn't find active product"
      );
    }

    return <TicketSelectionStep />;
  }

  if (checkoutStep === "identification") {
    return <TicketIdentificationStep />;
  }

  if (checkoutStep === "summary") {
    if (!buyer) {
      throw new Error(
        "Trying to access summary step but buyer information is missing"
      );
    }

    return <TicketSummaryStep />;
  }

  if (checkoutStep === "payment") {
    if (!order) {
      throw new Error("Trying to access payment step but didn't find order");
    }

    return <TicketPaymentStep />;
  }

  return null;
};
