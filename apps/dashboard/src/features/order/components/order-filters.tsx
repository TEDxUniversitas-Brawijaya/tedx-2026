import type { OrderListState, OrderStatus, OrderType } from "../types/order";
import { IconSearch } from "@tabler/icons-react";
import { Input } from "@tedx-2026/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@tedx-2026/ui/components/select";

type OrderFiltersProps = {
  state: OrderListState;
  onPatch: (patch: Partial<OrderListState>) => void;
};

export function OrderFilters({ state, onPatch }: OrderFiltersProps) {
  return (
    <div
      className="rounded-xl border bg-card p-4"
      id="order-management-filters"
    >
      <div
        className="grid gap-3 md:grid-cols-2 lg:grid-cols-4"
        id="order-management-filter-grid"
      >
        <div className="space-y-1.5" id="order-management-search-container">
          <label
            className="font-medium text-muted-foreground text-xs"
            htmlFor="order-management-search"
          >
            Search
          </label>
          <div className="relative">
            <IconSearch className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9"
              id="order-management-search"
              onChange={(event) => {
                onPatch({
                  page: 1,
                  search: event.target.value,
                });
              }}
              placeholder="Search by name, email, order ID"
              value={state.search}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label
            className="font-medium text-muted-foreground text-xs"
            htmlFor="order-management-filter-type"
          >
            Type
          </label>
          <Select
            onValueChange={(value) => {
              if (value === null) {
                return;
              }

              onPatch({
                page: 1,
                type: value as "all" | OrderType,
              });
            }}
            value={state.type}
          >
            <SelectTrigger className="w-full" id="order-management-filter-type">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="ticket">ticket</SelectItem>
              <SelectItem value="merch">merch</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <label
            className="font-medium text-muted-foreground text-xs"
            htmlFor="order-management-filter-status"
          >
            Status
          </label>
          <Select
            onValueChange={(value) => {
              if (value === null) {
                return;
              }

              onPatch({
                page: 1,
                status: value as "all" | OrderStatus,
              });
            }}
            value={state.status}
          >
            <SelectTrigger
              className="w-full"
              id="order-management-filter-status"
            >
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending_payment">pending_payment</SelectItem>
              <SelectItem value="pending_verification">
                pending_verification
              </SelectItem>
              <SelectItem value="paid">paid</SelectItem>
              <SelectItem value="expired">expired</SelectItem>
              <SelectItem value="refund_requested">refund_requested</SelectItem>
              <SelectItem value="refunded">refunded</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div
        className="mt-3 grid items-end gap-3 md:grid-cols-2 lg:grid-cols-3"
        id="order-management-sort-grid"
      >
        <div className="space-y-1.5">
          <label
            className="font-medium text-muted-foreground text-xs"
            htmlFor="order-management-sort-by"
          >
            Sort By
          </label>
          <Select
            onValueChange={(value) => {
              if (value === null) {
                return;
              }

              onPatch({
                sortBy: value as "createdAt" | "totalPrice" | "status",
              });
            }}
            value={state.sortBy}
          >
            <SelectTrigger className="w-full" id="order-management-sort-by">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt">createdAt</SelectItem>
              <SelectItem value="totalPrice">totalPrice</SelectItem>
              <SelectItem value="status">status</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <label
            className="font-medium text-muted-foreground text-xs"
            htmlFor="order-management-sort-order"
          >
            Sort Order
          </label>
          <Select
            onValueChange={(value) => {
              if (value === null) {
                return;
              }

              onPatch({
                sortOrder: value as "asc" | "desc",
              });
            }}
            value={state.sortOrder}
          >
            <SelectTrigger className="w-full" id="order-management-sort-order">
              <SelectValue placeholder="Sort order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">asc</SelectItem>
              <SelectItem value="desc">desc</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <label
            className="font-medium text-muted-foreground text-xs"
            htmlFor="order-management-rows-per-page"
          >
            Rows Per Page
          </label>
          <Select
            onValueChange={(value) => {
              if (value === null) {
                return;
              }

              onPatch({
                limit: Number(value),
                page: 1,
              });
            }}
            value={String(state.limit)}
          >
            <SelectTrigger
              className="w-full"
              id="order-management-rows-per-page"
            >
              <SelectValue placeholder="Rows per page" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 rows</SelectItem>
              <SelectItem value="10">10 rows</SelectItem>
              <SelectItem value="20">20 rows</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
