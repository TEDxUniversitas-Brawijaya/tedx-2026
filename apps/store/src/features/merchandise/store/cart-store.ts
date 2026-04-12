import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Product } from "../types/product";
import type { CheckoutStep } from "../types/checkout";
import type {
  CartItem,
  OrderPayment,
  OrderPaymentMethod,
  OrderSnapshotItem,
  OrderStatus,
  SetOrderPayload,
} from "../types/cart";

type CartStore = {
  items: CartItem[];
  addItem: (
    product: Product,
    quantity?: number,
    variantIds?: string[],
    bundleProductIds?: string[]
  ) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  updateVariant: (
    productId: string,
    variantIndex: number,
    variantId: string
  ) => void;
  clearCart: () => void;
  getTotalPrice: () => number;

  orderId: string | null;
  orderStatus: OrderStatus | null;
  orderItems: OrderSnapshotItem[];
  orderTotalPrice: number;
  orderPaymentMethod: OrderPaymentMethod | null;
  orderPayment: OrderPayment | null;
  orderCreatedAt: string | null;
  orderPaidAt: string | null;
  setOrder: (order: SetOrderPayload) => void;
  clearOrder: () => void;

  isModalOpen: boolean;
  activeProduct: Product | null;
  editingItemId: string | null;
  currentStep: CheckoutStep;
  openSelection: (product: Product, mode?: "edit") => void;
  setStep: (step: CheckoutStep) => void;
  updateItem: (
    productId: string,
    quantity: number,
    variantIds: string[],
    bundleProductIds?: string[]
  ) => void;
  closeModal: () => void;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isModalOpen: false,
      activeProduct: null,
      editingItemId: null,
      currentStep: "cart",

      addItem: (
        product: Product,
        quantity = 1,
        variantIds?: string[],
        bundleProductIds?: string[]
      ) => {
        const { items } = get();
        const existingItem = items.find((item) => item.id === product.id);

        const selectedVariantIds =
          variantIds ??
          (product.variants?.[0]?.id ? [product.variants[0].id] : []);
        if (existingItem) {
          set({
            items: items.map((item) =>
              item.id === product.id
                ? {
                    ...item,
                    quantity: item.quantity + quantity,
                    selectedVariantIds: variantIds ?? item.selectedVariantIds,
                    selectedBundleProductIds:
                      bundleProductIds ?? item.selectedBundleProductIds,
                  }
                : item
            ),
          });
        } else {
          set({
            items: [
              ...items,
              {
                ...product,
                quantity,
                selectedVariantIds,
                selectedBundleProductIds: bundleProductIds,
              } as CartItem,
            ],
          });
        }
      },
      removeItem: (productId: string) => {
        set({
          items: get().items.filter((item) => item.id !== productId),
        });
      },
      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.id === productId ? { ...item, quantity } : item
          ),
        });
      },
      updateVariant: (
        productId: string,
        variantIndex: number,
        variantId: string
      ) => {
        set({
          items: get().items.map((item) => {
            if (item.id === productId) {
              const newVariants = [...item.selectedVariantIds];
              newVariants[variantIndex] = variantId;
              return { ...item, selectedVariantIds: newVariants };
            }
            return item;
          }),
        });
      },
      clearCart: () => set({ items: [] }),
      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },

      orderId: null,
      orderStatus: null,
      orderItems: [],
      orderTotalPrice: 0,
      orderPaymentMethod: null,
      orderPayment: null,
      orderCreatedAt: null,
      orderPaidAt: null,
      setOrder: (order) => {
        let derivedPaymentMethod = order.paymentMethod ?? null;

        if (!derivedPaymentMethod && order.payment) {
          if ("uploadUrl" in order.payment) {
            derivedPaymentMethod = "manual";
          } else {
            derivedPaymentMethod = "midtrans";
          }
        }

        set({
          orderId: order.orderId,
          orderStatus: order.status ?? null,
          orderItems: order.items ?? [],
          orderTotalPrice: order.totalPrice,
          orderPaymentMethod: derivedPaymentMethod,
          orderPayment: order.payment ?? null,
          orderCreatedAt: order.createdAt ?? null,
          orderPaidAt: order.paidAt ?? null,
        });
      },
      clearOrder: () => {
        set({
          orderId: null,
          orderStatus: null,
          orderItems: [],
          orderTotalPrice: 0,
          orderPaymentMethod: null,
          orderPayment: null,
          orderCreatedAt: null,
          orderPaidAt: null,
        });
      },

      // Modal Actions
      openSelection: (product: Product, mode) => {
        set({
          isModalOpen: true,
          activeProduct: product,
          editingItemId: mode === "edit" ? product.id : null,
          currentStep: "selection",
        });
      },
      setStep: (step) => set({ currentStep: step }),
      updateItem: (productId, quantity, variantIds, bundleProductIds) => {
        set({
          items: get().items.map((item) =>
            item.id === productId
              ? {
                  ...item,
                  quantity,
                  selectedVariantIds: variantIds,
                  selectedBundleProductIds: bundleProductIds,
                }
              : item
          ),
        });
      },
      closeModal: () => {
        set({
          isModalOpen: false,
          activeProduct: null,
          editingItemId: null,
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
