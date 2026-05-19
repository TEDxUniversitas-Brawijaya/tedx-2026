import { create } from "zustand";
import type { MerchPickupStatus } from "../types/merch-pickup";

type MerchPickupFilterStoreState = {
  filter: {
    status: "all" | MerchPickupStatus;
    search: string;
    page: number;
    limit: number;
  };

  onChangeStatus: (status: "all" | MerchPickupStatus) => void;
  onChangeSearch: (search: string) => void;
  onChangePage: (page: number) => void;
  onChangeLimit: (limit: number) => void;
};

const initialFilter: MerchPickupFilterStoreState["filter"] = {
  status: "all",
  search: "",
  page: 1,
  limit: 20,
};

export const useMerchPickupFilterStore = create<MerchPickupFilterStoreState>(
  (set) => ({
    filter: initialFilter,
    onChangeStatus: (status) =>
      set((state) => ({ filter: { ...state.filter, status, page: 1 } })),
    onChangeSearch: (search) =>
      set((state) => ({ filter: { ...state.filter, search, page: 1 } })),
    onChangePage: (page) =>
      set((state) => ({ filter: { ...state.filter, page } })),
    onChangeLimit: (limit) =>
      set((state) => ({ filter: { ...state.filter, limit, page: 1 } })),
  })
);
