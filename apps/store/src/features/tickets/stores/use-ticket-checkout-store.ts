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
  setIsCheckoutOpen: (open: boolean) => void;
  checkoutStep: TicketCheckoutStep;
  selectedProduct: TicketProduct | null;
  quantity: number;

  buyer: TicketBuyer | null;
  order: TicketOrder | null;

  openCheckout: (product: TicketProduct) => void;
  onNextStep: () => void;
  onPrevStep: () => void;

  setStep: (step: TicketCheckoutStep) => void;
  setQuantity: (qty: number) => void;
  setBuyer: (buyer: TicketBuyer) => void;
  setOrder: (order: TicketOrder) => void;
};

export const useTicketCheckoutStore = create<TicketCheckoutStore>(
  (set, get) => ({
    activeTab: "regular",
    setActiveTab: (tab) => set({ activeTab: tab }),

    isCheckoutOpen: false,
    setIsCheckoutOpen: (open) => set({ isCheckoutOpen: open }),

    checkoutStep: "identification",
    selectedProduct: null,
    quantity: 1,

    buyer: null,
    order: null,

    openCheckout: (product) =>
      set({
        isCheckoutOpen: true,
        checkoutStep: "identification",
        selectedProduct: product,
        quantity: 1,
        buyer: null,
        order: null,
      }),
    onNextStep: () => {
      const { checkoutStep, setIsCheckoutOpen } = get();
      const nextStep = progressSteps[checkoutStep].next;
      if (nextStep === null) {
        setIsCheckoutOpen(false);

        // reset
        set({
          checkoutStep: "identification",
          // selectedProduct: null, // For some reason it will throw error if we set selectedProduct to null here, need to investigate further --- IGNORE ---
          quantity: 1,
          buyer: null,
          order: null,
        });

        return;
      }

      set({ checkoutStep: nextStep });
    },
    onPrevStep: () => {
      const { checkoutStep, setIsCheckoutOpen } = get();
      const prevStep = progressSteps[checkoutStep].prev;
      if (prevStep === null) {
        setIsCheckoutOpen(false);
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
  })
);
