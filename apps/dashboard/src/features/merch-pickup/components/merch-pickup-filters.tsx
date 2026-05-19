import { IconSearch } from "@tabler/icons-react";
import { Input } from "@tedx-2026/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@tedx-2026/ui/components/select";
import { useEffect, useState } from "react";
import { useMerchPickupFilterStore } from "../stores/use-merch-pickup-filter-store";

const statusItems = [
  { label: "All Statuses", value: "all" },
  { label: "Picked Up", value: "picked_up" },
  { label: "Not Picked Up", value: "not_picked_up" },
];

const rowsPerPageItems = [
  { label: "20 rows", value: "20" },
  { label: "50 rows", value: "50" },
  { label: "100 rows", value: "100" },
];

export function MerchPickupFilters() {
  const {
    filter: { limit, search, status },
    onChangeLimit,
    onChangeSearch,
    onChangeStatus,
  } = useMerchPickupFilterStore();
  const [searchValue, setSearchValue] = useState(search);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      onChangeSearch(searchValue);
    }, 250);

    return () => window.clearTimeout(timeout);
  }, [onChangeSearch, searchValue]);

  return (
    <div className="rounded-xl border bg-card p-4" id="merch-pickup-filters">
      <div className="grid gap-3 md:grid-cols-3">
        <div className="space-y-1.5 md:col-span-1">
          <label
            className="font-medium text-muted-foreground text-xs"
            htmlFor="merch-pickup-search"
          >
            Search
          </label>
          <div className="relative">
            <IconSearch className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9"
              id="merch-pickup-search"
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Search name, email, or order ID"
              value={searchValue}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label
            className="font-medium text-muted-foreground text-xs"
            htmlFor="merch-pickup-status"
          >
            Status
          </label>
          <Select
            items={statusItems}
            onValueChange={(value) => {
              if (value) {
                onChangeStatus(value);
              }
            }}
            value={status}
          >
            <SelectTrigger className="w-full" id="merch-pickup-status">
              <SelectValue />
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

        <div className="space-y-1.5">
          <label
            className="font-medium text-muted-foreground text-xs"
            htmlFor="merch-pickup-rows"
          >
            Rows
          </label>
          <Select
            items={rowsPerPageItems}
            onValueChange={(value) => {
              if (value) {
                onChangeLimit(Number(value));
              }
            }}
            value={String(limit)}
          >
            <SelectTrigger className="w-full" id="merch-pickup-rows">
              <SelectValue />
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
