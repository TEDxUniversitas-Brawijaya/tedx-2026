import { CheckoutModal } from "../components/cart";
import { CartStep } from "../components/cart/steps/cart-step";
import { IdentificationStep } from "../components/cart/steps/identification-step";
import { ManualPaymentStep } from "../components/cart/steps/manual-payment-step";
import { PaymentStep } from "../components/cart/steps/payment-step";
import { SelectionStep } from "../components/cart/steps/selection-step";
import { SuccessStep } from "../components/cart/steps/success-step";
import { SummaryStep } from "../components/cart/steps/summary-step";
import { isManualPayment } from "../configs/payment";
import { useCartStore } from "../stores/use-cart-store";

export const CheckoutModalContainer = () => {
  return (
    <CheckoutModal>
      <CheckoutModalContent />
    </CheckoutModal>
  );
};

const CheckoutModalContent = () => {
  const { currentStep, order, buyer, selectedItem } = useCartStore();

  if (currentStep === "selection") {
    if (!selectedItem) {
      throw new Error(
        "Trying to access selection step but didn't find active product"
      );
    }

    return <SelectionStep selectedItem={selectedItem} />;
  }

  if (currentStep === "cart") {
    return <CartStep />;
  }

  if (currentStep === "identification") {
    return <IdentificationStep />;
  }

  if (currentStep === "summary") {
    if (!buyer) {
      throw new Error(
        "Trying to access summary step but buyer information is missing"
      );
    }

    return <SummaryStep buyer={buyer} />;
  }

  if (currentStep === "payment") {
    if (isManualPayment) {
      return <ManualPaymentStep />;
    }

    if (!order) {
      throw new Error(
        "Trying to access regular payment step but didn't find order"
      );
    }

    if (order.qrisUrl === null) {
      throw new Error(
        "Trying to access regular payment step but didn't find qrisUrl in response"
      );
    }

    return (
      <PaymentStep
        // There is unusual type error when we directly pass `order` even though it has the correct type.
        order={{
          totalPrice: order.totalPrice,
          orderId: order.orderId,
          qrisUrl: order.qrisUrl,
          expiresAt: order.expiresAt,
        }}
      />
    );
  }

  return <SuccessStep />;
};
