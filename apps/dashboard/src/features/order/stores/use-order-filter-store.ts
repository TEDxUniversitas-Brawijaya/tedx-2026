import { create } from "zustand";
import { initialOrderListState, type OrderListState } from "../types/order";

type OrderFilterStoreState = {
  orderListState: OrderListState;
  patchOrderListState: (patch: Partial<OrderListState>) => void;
  resetOrderListState: () => void;
};

export type { OrderFilterStoreState };

export const useOrderFilterStore = create<OrderFilterStoreState>((set) => ({
  orderListState: initialOrderListState,
  patchOrderListState: (patch: Partial<OrderListState>) => {
    set((state) => ({
      orderListState: {
        ...state.orderListState,
        ...patch,
      },
    }));
  },
  resetOrderListState: () => {
    set({ orderListState: initialOrderListState });
  },
}));
