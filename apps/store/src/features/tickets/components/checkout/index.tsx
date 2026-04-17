import Chandelier from "@/assets/imgs/chandelier-1.png";
import { Dialog, DialogContent } from "@tedx-2026/ui/components/dialog";
import { useTicketCheckoutStore } from "../../stores/use-ticket-checkout-store";
import { isManualPayment } from "../../configs/payment";
import { TicketCheckoutProgress } from "./ticket-checkout-progress";
import { TicketIdentificationStep } from "./ticket-identification-step";
import { TicketManualPaymentStep } from "./ticket-manual-payment-step";
import { TicketPaymentStep } from "./ticket-payment-step";
import { TicketSelectionStep } from "./ticket-selection-step";
import { TicketSuccessStep } from "./ticket-success-step";
import { TicketSummaryStep } from "./ticket-summary-step";

export const TicketCheckoutModal = () => {
  const { isCheckoutOpen, closeCheckout, checkoutStep } =
    useTicketCheckoutStore();

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) {
          closeCheckout();
        }
      }}
      open={isCheckoutOpen}
    >
      <DialogContent className="max-h-[92vh] max-w-[90%] overflow-hidden rounded-3xl border-none bg-black p-0 text-white shadow-[0_0_100px_2px_rgba(255,149,0,0.25)] *:data-[slot=dialog-close]:z-20 *:data-[slot=dialog-close]:bg-transparent *:data-[slot=dialog-close]:text-white md:w-full md:max-w-lg">
        <img
          alt="chandelier"
          aria-hidden="true"
          className="pointer-events-none absolute -top-15 -right-15 z-1 w-44 opacity-30 md:w-56"
          height={300}
          src={Chandelier}
          width={150}
        />
        <div className="relative z-2 w-full p-4 sm:p-8">
          {checkoutStep !== "selection" && checkoutStep !== "success" && (
            <TicketCheckoutProgress
              compact={checkoutStep === "payment"}
              currentStep={checkoutStep}
            />
          )}
          <div className="flex max-h-[80vh] flex-col">
            <div className="no-scrollbar overflow-x-hidden overflow-y-scroll px-1 pb-2 sm:px-2 sm:pb-3">
              <TicketCheckoutContent />
            </div>
          </div>
        </div>
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
    if (isManualPayment) {
      return <TicketManualPaymentStep />;
    }

    if (!order) {
      throw new Error("Trying to access payment step but didn't find order");
    }

    return <TicketPaymentStep />;
  }

  if (checkoutStep === "success") {
    return <TicketSuccessStep />;
  }

  return null;
};
