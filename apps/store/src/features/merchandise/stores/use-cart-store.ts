import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { progressSteps, type CheckoutStep } from "../lib/steps";
import type { Buyer, CartItem, Order } from "../types/cart";

type CartStore = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  updateItem: (itemId: string, updates: CartItem) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  getTotalPrice: () => number;

  buyer: Buyer | null;
  setBuyer: (buyer: Buyer) => void;

  paymentProof: File | null;
  setPaymentProof: (file: File | null) => void;

  order: Order | null;
  setOrder: (order: Order) => void;

  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;

  currentStep: CheckoutStep;
  onNextStep: () => void;
  onPrevStep: () => void;
  /**
   * Directly set the current step. Use with caution, as it does not perform any validation or checks.
   */
  setStep: (step: CheckoutStep) => void;

  // Item that is currently being selected in the selection step.
  selectedItem: CartItem | null;
  setSelectedItem: (item: CartItem) => void;
  selectionStepMode: "add" | "edit";
  openSelectionStep: (item: CartItem, mode: "add" | "edit") => void;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const { items, updateQuantity, onNextStep } = get();

        const existingItem = items.find((i) => {
          if (item.type === "merch_regular") {
            const haveSameProduct = i.id === item.id;
            const haveSameVariants =
              JSON.stringify(i.selectedVariants) ===
              JSON.stringify(item.selectedVariants);

            return haveSameProduct && haveSameVariants;
          }

          if (item.type === "merch_bundle") {
            const haveSameBundle = i.id === item.id;
            const haveSameBundleProducts =
              JSON.stringify(i.selectedBundleProducts) ===
              JSON.stringify(item.selectedBundleProducts);

            return haveSameBundle && haveSameBundleProducts;
          }

          return false;
        });
        if (existingItem) {
          updateQuantity(
            existingItem.itemId,
            existingItem.quantity + item.quantity
          );
          return;
        }

        set({
          items: [...items, item],
        });
        onNextStep();
      },
      updateItem: (itemId, updates) => {
        const { onNextStep, items } = get();

        set({
          items: items.map((item) =>
            item.itemId === itemId ? { ...item, ...updates } : item
          ),
        });
        onNextStep();
      },
      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          set({
            items: get().items.filter((item) => item.itemId !== itemId),
          });
          return;
        }

        set({
          items: get().items.map((item) =>
            item.itemId === itemId ? { ...item, quantity } : item
          ),
        });
      },
      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },

      buyer: null,
      setBuyer: (buyer) => {
        set({
          buyer,
        });
      },

      paymentProof: null,
      setPaymentProof: (file) => {
        set({
          paymentProof: file,
        });
      },

      order: null,
      setOrder: (order) => {
        set({
          order,
        });
      },

      isModalOpen: false,
      setIsModalOpen: (open) => {
        const { currentStep } = get();

        // Reset to cart step when closing the modal from selection step and remove selected item to prevent confusion when reopening the modal
        if (currentStep === "selection" && !open) {
          set({ currentStep: "cart", selectedItem: null });
        }

        set({
          isModalOpen: open,
        });
      },

      currentStep: "cart",
      onNextStep: () => {
        const { currentStep, setIsModalOpen } = get();
        const nextStep = progressSteps[currentStep].next;
        if (nextStep === null) {
          setIsModalOpen(false);

          // Reset
          set({
            currentStep: "cart",
            selectedItem: null,
            buyer: null,
            order: null,
            paymentProof: null,
            items: [],
          });

          return;
        }

        set({ currentStep: nextStep });
      },
      onPrevStep: () => {
        const { currentStep, setIsModalOpen } = get();
        const prevStep = progressSteps[currentStep].prev;
        if (prevStep === null) {
          setIsModalOpen(false);
          return;
        }

        set({ currentStep: prevStep });
      },
      setStep: (step) => {
        set({ currentStep: step });
      },

      selectedItem: null,
      selectionStepMode: "add",
      setSelectedItem: (item) => {
        set({ selectedItem: item });
      },
      openSelectionStep: (item, mode) => {
        set({
          selectedItem: item,
          selectionStepMode: mode,
          currentStep: "selection",
          isModalOpen: true,
        });
      },
    }),
    {
      name: "tedx-cart-storage",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
);
