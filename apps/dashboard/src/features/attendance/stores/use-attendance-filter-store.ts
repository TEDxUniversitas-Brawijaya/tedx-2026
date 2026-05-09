import { create } from "zustand";
import type { AttendanceStatus, EventDay } from "../types/attendance";

type AttendanceFilterStoreState = {
  filter: {
    eventDay: "all" | EventDay;
    status: "all" | AttendanceStatus;
    search: string;
    sortBy: "checkedInAt" | "buyerName" | "eventDay";
    sortOrder: "asc" | "desc";
    page: number;
    limit: number;
  };

  onChangeEventDay: (eventDay: "all" | EventDay) => void;
  onChangeStatus: (status: "all" | AttendanceStatus) => void;
  onChangeSearch: (search: string) => void;
  onChangeSortBy: (sortBy: "checkedInAt" | "buyerName" | "eventDay") => void;
  onChangeSortOrder: (sortOrder: "asc" | "desc") => void;
  onChangePage: (page: number) => void;
  onChangeLimit: (limit: number) => void;
};

const initialFilter: AttendanceFilterStoreState["filter"] = {
  eventDay: "all",
  status: "all",
  search: "",
  sortBy: "checkedInAt",
  sortOrder: "desc",
  page: 1,
  limit: 20,
};

export const useAttendanceFilterStore = create<AttendanceFilterStoreState>(
  (set) => ({
    filter: initialFilter,
    onChangeEventDay: (eventDay) =>
      set((state) => ({
        filter: {
          ...state.filter,
          eventDay,
          page: 1,
        },
      })),
    onChangeStatus: (status) =>
      set((state) => ({
        filter: {
          ...state.filter,
          status,
          page: 1,
        },
      })),
    onChangeSearch: (search) =>
      set((state) => ({
        filter: {
          ...state.filter,
          search,
          page: 1,
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
          page: 1,
        },
      })),
  })
);
