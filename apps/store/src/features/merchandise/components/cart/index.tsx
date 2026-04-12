import { useForm } from "@tanstack/react-form";
import { ShoppingCart } from "lucide-react";
import Chandelier from "@/assets/imgs/chandelier-1.png";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@tedx-2026/ui/components/dialog";
import { useCartStore } from "../../store/cart-store";
import { CheckoutProgress } from "./checkout-progress";
import { CartStep } from "./steps/cart-step";
import { IdentificationStep } from "./steps/identification-step";
import { PaymentStepManual } from "./steps/payment-step-manual";
import { PaymentStep } from "./steps/payment-step";
import {
  type CheckoutFormData,
  type CheckoutStep,
  checkoutSchema,
} from "../../types/types";
import { SummaryStep } from "./steps/summary-step";
import { SuccessStep } from "./steps/success-step";
import { SelectionStep } from "./steps/selection-step";

const useCheckoutForm = (onSubmit: () => void) =>
  useForm({
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
    } satisfies CheckoutFormData,
    validators: {
      onSubmit: checkoutSchema,
    },
    onSubmit,
  });

export type CheckoutForm = ReturnType<typeof useCheckoutForm>;

export function CheckoutModal() {
  const {
    items,
    isModalOpen,
    closeModal,
    currentStep,
    setStep,
    orderPayment,
    orderPaymentMethod,
  } = useCartStore();

  const isManualPayment =
    orderPaymentMethod === "manual" ||
    (!orderPaymentMethod &&
      Boolean(orderPayment && "uploadUrl" in orderPayment));

  const form = useCheckoutForm(() => setStep("summary"));

  return (
    <Dialog
      onOpenChange={(open) => {
        if (open) {
          setStep("cart");
          return;
        }

        closeModal();
      }}
      open={isModalOpen}
    >
      <DialogTrigger
        render={
          <button
            className="relative flex cursor-pointer items-center rounded-lg border-2 border-[#1A1A1A] p-2 transition-colors hover:bg-black/5"
            onClick={() => {
              setStep("cart");
              useCartStore.setState({ isModalOpen: true });
            }}
            type="button"
          >
            <ShoppingCart />
            {items.length > 0 && (
              <span className="absolute -top-2 -right-2 flex aspect-square h-5 w-5 items-center justify-center rounded-full bg-[#FF1818] text-[10px] text-white">
                {items.reduce((acc, item) => acc + item.quantity, 0)}
              </span>
            )}
          </button>
        }
      />
      <DialogContent className="max-h-[92vh] w-[calc(100%-2rem)] max-w-[20rem] overflow-hidden rounded-3xl border-none bg-black p-0 text-white shadow-[0_0_100px_2px_rgba(255,149,0,0.25)] *:data-[slot=dialog-close]:z-20 *:data-[slot=dialog-close]:bg-transparent *:data-[slot=dialog-close]:text-white sm:w-full sm:max-w-lg">
        <img
          alt="chandelier"
          aria-hidden="true"
          className="k pointer-events-none absolute -top-15 -right-15 z-1 w-44 opacity-30 md:w-56"
          height={100}
          src={Chandelier}
          width={100}
        />
        <div className="relative z-2 w-full p-4 sm:p-8">
          {currentStep !== "selection" && currentStep !== "success" && (
            <CheckoutProgress
              compact={currentStep === "payment"}
              currentStep={currentStep}
            />
          )}

          {currentStep === "selection" && <SelectionStep />}

          {currentStep === "cart" && (
            <CartStep onNext={() => setStep("identification")} />
          )}

          {currentStep === "identification" && (
            <IdentificationStep form={form} onBack={() => setStep("cart")} />
          )}

          {currentStep === "summary" && (
            <SummaryStep
              form={form}
              onMoveStep={(step: CheckoutStep) => setStep(step)}
              onNext={() => setStep("payment")}
            />
          )}

          {currentStep === "payment" &&
            (isManualPayment ? (
              <PaymentStepManual onNext={() => setStep("success")} />
            ) : (
              <PaymentStep onNext={() => setStep("success")} />
            ))}

          {currentStep === "success" && <SuccessStep />}
        </div>
      </DialogContent>
    </Dialog>
  );
}
