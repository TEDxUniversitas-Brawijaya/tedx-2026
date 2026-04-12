import { create } from "zustand";
import type { OrderDetail } from "../types/order";

type OrderDetailStoreState = {
  orderDetail: OrderDetail | null;
  setOrderDetail: (orderDetail: OrderDetail) => void;
  clearOrderDetail: () => void;
};

export type { OrderDetailStoreState };

export const useOrderDetailStore = create<OrderDetailStoreState>((set) => ({
  orderDetail: null,
  setOrderDetail: (orderDetail) => {
    set({ orderDetail });
  },
  clearOrderDetail: () => {
    set({ orderDetail: null });
  },
}));
