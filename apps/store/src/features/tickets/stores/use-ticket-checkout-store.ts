import { create } from "zustand";
import { progressSteps } from "../lib/steps";
import type { CartItem, TicketCheckoutStep } from "../types/checkout";
import type { TicketBuyer, TicketOrder, TicketTab } from "../types/ticket";

type TicketCheckoutStore = {
  activeTab: TicketTab;
  setActiveTab: (tab: TicketTab) => void;

  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  checkoutStep: TicketCheckoutStep;
  selectedProduct: CartItem | null;
  quantity: number;

  buyer: TicketBuyer | null;
  order: TicketOrder | null;

  openCheckout: (product: CartItem) => void;
  onNextStep: () => void;
  onPrevStep: () => void;

  setStep: (step: TicketCheckoutStep) => void;
  setQuantity: (qty: number) => void;
  setBuyer: (buyer: TicketBuyer) => void;
  setOrder: (order: TicketOrder) => void;

  setSelectedProduct: (product: CartItem | null) => void;
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

      if (nextStep === "choose_bundle_item") {
        const product = get().selectedProduct;
        if (!product) {
          throw new Error(
            "Trying to access choose bundle item step but didn't find active product"
          );
        }

        const hasMerchItem = product.bundleItems?.some(
          (item) => item.type === "merchandise"
        );

        if (
          product.bundleItems === null ||
          product.bundleItems.length === 0 ||
          !hasMerchItem
        ) {
          // If bundleItems is null or empty, skip the choose_bundle_item step
          set({ checkoutStep: "summary" });
          return;
        }
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

      if (prevStep === "choose_bundle_item") {
        const product = get().selectedProduct;
        if (!product) {
          throw new Error(
            "Trying to access choose bundle item step but didn't find active product"
          );
        }

        const hasMerchItem = product.bundleItems?.some(
          (item) => item.type === "merchandise"
        );

        if (
          product.bundleItems === null ||
          product.bundleItems.length === 0 ||
          !hasMerchItem
        ) {
          // If bundleItems is null or empty, skip the choose_bundle_item step
          set({ checkoutStep: "identification" });
          return;
        }
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
    setSelectedProduct: (product) => set({ selectedProduct: product }),
  })
);
