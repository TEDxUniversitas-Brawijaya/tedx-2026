import { IconSearch } from "@tabler/icons-react";
import { Input } from "@tedx-2026/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@tedx-2026/ui/components/select";
import { useOrderFilterStore } from "../stores/use-order-filter-store";

const typeItems = [
  { label: "All Types", value: "all" },
  { label: "Ticket", value: "ticket" },
  { label: "Merch", value: "merch" },
];

const statusItems = [
  { label: "All Statuses", value: "all" },
  { label: "Pending Payment", value: "pending_payment" },
  { label: "Pending Verification", value: "pending_verification" },
  { label: "Paid", value: "paid" },
  { label: "Expired", value: "expired" },
  { label: "Refund Requested", value: "refund_requested" },
  { label: "Refunded", value: "refunded" },
];

const sortByItems = [
  { label: "Created At", value: "createdAt" },
  { label: "Total Price", value: "totalPrice" },
  { label: "Status", value: "status" },
];

const sortOrderItems = [
  { label: "Ascending", value: "asc" },
  { label: "Descending", value: "desc" },
];

const rowsPerPageItems = [
  { label: "5 rows", value: "5" },
  { label: "10 rows", value: "10" },
  { label: "20 rows", value: "20" },
];

export function OrderFilters() {
  const {
    filter: { limit, search, sortBy, sortOrder, status, type },

    onChangeSearch,
    onChangeLimit,
    onChangeSortBy,
    onChangeSortOrder,
    onChangeStatus,
    onChangeType,
  } = useOrderFilterStore();

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
                onChangeSearch(event.target.value);
              }}
              placeholder="Search by name, email, order ID"
              value={search}
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
            items={typeItems}
            onValueChange={(value) => {
              if (value === null) {
                return;
              }

              onChangeType(value);
            }}
            value={type}
          >
            <SelectTrigger className="w-full" id="order-management-filter-type">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              {typeItems.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
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
            items={statusItems}
            onValueChange={(value) => {
              if (value === null) {
                return;
              }

              onChangeStatus(value);
            }}
            value={status}
          >
            <SelectTrigger
              className="w-full"
              id="order-management-filter-status"
            >
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              {statusItems.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
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
            items={sortByItems}
            onValueChange={(value) => {
              if (value === null) {
                return;
              }

              onChangeSortBy(value);
            }}
            value={sortBy}
          >
            <SelectTrigger className="w-full" id="order-management-sort-by">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sortByItems.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
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
            items={sortOrderItems}
            onValueChange={(value) => {
              if (value === null) {
                return;
              }

              onChangeSortOrder(value);
            }}
            value={sortOrder}
          >
            <SelectTrigger className="w-full" id="order-management-sort-order">
              <SelectValue placeholder="Sort order" />
            </SelectTrigger>
            <SelectContent>
              {sortOrderItems.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
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
            items={rowsPerPageItems}
            onValueChange={(value) => {
              if (value === null) {
                return;
              }

              onChangeLimit(Number(value));
            }}
            value={String(limit)}
          >
            <SelectTrigger
              className="w-full"
              id="order-management-rows-per-page"
            >
              <SelectValue placeholder="Rows per page" />
            </SelectTrigger>
            <SelectContent>
              {rowsPerPageItems.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
