import { create } from "zustand";
import type { OrderStatus, OrderType } from "../types/order";

type OrderFilterStoreState = {
  filter: {
    type: "all" | OrderType;
    status: "all" | OrderStatus;
    search: string;
    sortBy: "createdAt" | "totalPrice" | "status";
    sortOrder: "asc" | "desc";
    page: number;
    limit: number;
  };

  onChangeType: (type: "all" | OrderType) => void;
  onChangeStatus: (status: "all" | OrderStatus) => void;
  onChangeSearch: (search: string) => void;
  onChangeSortBy: (sortBy: "createdAt" | "totalPrice" | "status") => void;
  onChangeSortOrder: (sortOrder: "asc" | "desc") => void;
  onChangePage: (page: number) => void;
  onChangeLimit: (limit: number) => void;

  resetfilter: () => void;
};

const initialFilter: OrderFilterStoreState["filter"] = {
  type: "all",
  status: "all",
  search: "",
  sortBy: "createdAt",
  sortOrder: "desc",
  page: 1,
  limit: 10,
};

export const useOrderFilterStore = create<OrderFilterStoreState>((set) => ({
  filter: initialFilter,
  onChangeType: (type) =>
    set((state) => ({
      filter: {
        ...state.filter,
        type,
        page: 1, // Reset to first page on filter change
      },
    })),
  onChangeStatus: (status) =>
    set((state) => ({
      filter: {
        ...state.filter,
        status,
        page: 1, // Reset to first page on filter change
      },
    })),
  onChangeSearch: (search) =>
    set((state) => ({
      filter: {
        ...state.filter,
        search,
        page: 1, // Reset to first page on filter change
      },
    })),
  onChangeSortBy: (sortBy) =>
    set((state) => ({
      filter: {
        ...state.filter,
        sortBy,
      },
    })),
  onChangeSortOrder: (sortOrder) =>
    set((state) => ({
      filter: {
        ...state.filter,
        sortOrder,
      },
    })),
  onChangePage: (page) =>
    set((state) => ({
      filter: {
        ...state.filter,
        page,
      },
    })),
  onChangeLimit: (limit) =>
    set((state) => ({
      filter: {
        ...state.filter,
        limit,
        page: 1, // Reset to first page on limit change
      },
    })),
  resetfilter: () => {
    set({ filter: initialFilter });
  },
}));
