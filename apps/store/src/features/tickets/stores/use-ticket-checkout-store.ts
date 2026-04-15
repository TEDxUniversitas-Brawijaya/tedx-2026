// Checkout store: central zustand state for ticket tab, selection, buyer, and order flow.
import { create } from "zustand";
import type {
  TicketBuyer,
  TicketOrder,
  TicketProduct,
  TicketTab,
} from "../types/ticket";

export type TicketCheckoutStep =
  | "selection"
  | "identification"
  | "summary"
  | "payment";

type TicketCheckoutStore = {
  activeTab: TicketTab;
  setActiveTab: (tab: TicketTab) => void;

  isCheckoutOpen: boolean;
  checkoutStep: TicketCheckoutStep;
  selectedProduct: TicketProduct | null;
  quantity: number;
  selectedBundleItemId?: string;

  buyer: TicketBuyer | null;
  order: TicketOrder | null;
  isOrderDetailOpen: boolean;

  openCheckout: (product: TicketProduct) => void;
  closeCheckout: () => void;
  setCheckoutStep: (step: TicketCheckoutStep) => void;
  setQuantity: (qty: number) => void;
  setSelectedBundleItemId: (id: string | undefined) => void;
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
    checkoutStep: "selection",
    selectedProduct: null,
    quantity: 1,
    selectedBundleItemId: undefined,

    buyer: null,
    order: null,
    isOrderDetailOpen: false,

    openCheckout: (product) =>
      set({
        isCheckoutOpen: true,
        checkoutStep: "selection",
        selectedProduct: product,
        quantity: 1,
        selectedBundleItemId: undefined,
        buyer: null,
        order: null,
      }),
    closeCheckout: () =>
      set({
        isCheckoutOpen: false,
        checkoutStep: "selection",
        selectedProduct: null,
        quantity: 1,
        selectedBundleItemId: undefined,
        buyer: null,
      }),
    setCheckoutStep: (step) => set({ checkoutStep: step }),
    setQuantity: (qty) => {
      const product = get().selectedProduct;
      const maxByStock =
        product && product.stock !== null ? Math.min(5, product.stock) : 5;
      const normalized = Math.max(1, Math.min(qty, Math.max(1, maxByStock)));
      set({ quantity: normalized });
    },
    setSelectedBundleItemId: (id) => set({ selectedBundleItemId: id }),
    setBuyer: (buyer) => set({ buyer }),
    setOrder: (order) => set({ order }),
    openOrderDetail: () => set({ isOrderDetailOpen: true }),
    closeOrderDetail: () => set({ isOrderDetailOpen: false }),
  })
);
