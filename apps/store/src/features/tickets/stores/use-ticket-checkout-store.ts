import { create } from "zustand";
import { progressSteps } from "../lib/steps";
import type { TicketCheckoutStep } from "../types/checkout";
import type {
  TicketBuyer,
  TicketOrder,
  TicketProduct,
  TicketTab,
} from "../types/ticket";

type TicketCheckoutStore = {
  activeTab: TicketTab;
  setActiveTab: (tab: TicketTab) => void;

  isCheckoutOpen: boolean;
  checkoutStep: TicketCheckoutStep;
  selectedProduct: TicketProduct | null;
  quantity: number;

  buyer: TicketBuyer | null;
  order: TicketOrder | null;
  isOrderDetailOpen: boolean;

  openCheckout: (product: TicketProduct) => void;
  closeCheckout: () => void;
  onNextStep: () => void;
  onPrevStep: () => void;
  /**
   * Directly set the current step. Use with caution, as it does not perform any validation or checks.
   */
  setStep: (step: TicketCheckoutStep) => void;
  setQuantity: (qty: number) => void;
  setBuyer: (buyer: TicketBuyer) => void;
  setOrder: (order: TicketOrder) => void;
  openOrderDetail: () => void;
  closeOrderDetail: () => void;
};

export const useTicketCheckoutStore = create<TicketCheckoutStore>(
  (set, get) => ({
    activeTab: "regular",
    setActiveTab: (tab) => set({ activeTab: tab }),

    isCheckoutOpen: false,
    checkoutStep: "identification",
    selectedProduct: null,
    quantity: 1,

    buyer: null,
    order: null,
    isOrderDetailOpen: false,

    openCheckout: (product) =>
      set({
        isCheckoutOpen: true,
        checkoutStep: "identification",
        selectedProduct: product,
        quantity: 1,
        buyer: null,
        order: null,
      }),
    closeCheckout: () =>
      set({
        isCheckoutOpen: false,
        checkoutStep: "identification",
        selectedProduct: null,
        quantity: 1,
        buyer: null,
      }),
    onNextStep: () => {
      const { checkoutStep, closeCheckout } = get();
      const nextStep = progressSteps[checkoutStep].next;
      if (nextStep === null) {
        closeCheckout();
        return;
      }

      set({ checkoutStep: nextStep });
    },
    onPrevStep: () => {
      const { checkoutStep, closeCheckout } = get();
      const prevStep = progressSteps[checkoutStep].prev;
      if (prevStep === null) {
        closeCheckout();
        return;
      }

      set({ checkoutStep: prevStep });
    },
    setStep: (step) => set({ checkoutStep: step }),
    setQuantity: (qty) => {
      const product = get().selectedProduct;
      const maxByStock =
        product && product.stock !== null ? Math.min(5, product.stock) : 5;
      const normalized = Math.max(1, Math.min(qty, Math.max(1, maxByStock)));
      set({ quantity: normalized });
    },
    setBuyer: (buyer) => set({ buyer }),
    setOrder: (order) => set({ order }),
    openOrderDetail: () => set({ isOrderDetailOpen: true }),
    closeOrderDetail: () => set({ isOrderDetailOpen: false }),
  })
);
