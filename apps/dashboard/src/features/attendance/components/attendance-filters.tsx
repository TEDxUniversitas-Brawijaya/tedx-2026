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
import { useAttendanceFilterStore } from "../stores/use-attendance-filter-store";

const eventDayItems = [
  { label: "All Event Days", value: "all" },
  { label: "Propa 3 Day 1", value: "propa3_day1" },
  { label: "Propa 3 Day 2", value: "propa3_day2" },
  { label: "Main Event", value: "main_event" },
];

const statusItems = [
  { label: "All Statuses", value: "all" },
  { label: "Checked In", value: "checked_in" },
  { label: "Not Checked In", value: "not_checked_in" },
];

const sortByItems = [
  { label: "Checked In At", value: "checkedInAt" },
  { label: "Buyer Name", value: "buyerName" },
  { label: "Event Day", value: "eventDay" },
];

const sortOrderItems = [
  { label: "Ascending", value: "asc" },
  { label: "Descending", value: "desc" },
];

const rowsPerPageItems = [
  { label: "20 rows", value: "20" },
  { label: "50 rows", value: "50" },
  { label: "100 rows", value: "100" },
];

export function AttendanceFilters() {
  const {
    filter: { eventDay, limit, search, sortBy, sortOrder, status },
    onChangeEventDay,
    onChangeLimit,
    onChangeSearch,
    onChangeSortBy,
    onChangeSortOrder,
    onChangeStatus,
  } = useAttendanceFilterStore();
  const [searchValue, setSearchValue] = useState(search);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      onChangeSearch(searchValue);
    }, 250);

    return () => window.clearTimeout(timeout);
  }, [onChangeSearch, searchValue]);

  return (
    <div className="rounded-xl border bg-card p-4" id="attendance-filters">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <div className="space-y-1.5 md:col-span-2">
          <label
            className="font-medium text-muted-foreground text-xs"
            htmlFor="attendance-search"
          >
            Search
          </label>
          <div className="relative">
            <IconSearch className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9"
              id="attendance-search"
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Search buyer name or email"
              value={searchValue}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label
            className="font-medium text-muted-foreground text-xs"
            htmlFor="attendance-event-day"
          >
            Event Day
          </label>
          <Select
            items={eventDayItems}
            onValueChange={(value) => {
              if (value) {
                onChangeEventDay(value);
              }
            }}
            value={eventDay}
          >
            <SelectTrigger className="w-full" id="attendance-event-day">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {eventDayItems.map((item) => (
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
            htmlFor="attendance-status"
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
            <SelectTrigger className="w-full" id="attendance-status">
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
            htmlFor="attendance-rows"
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
            <SelectTrigger className="w-full" id="attendance-rows">
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

      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <div className="space-y-1.5">
          <label
            className="font-medium text-muted-foreground text-xs"
            htmlFor="attendance-sort-by"
          >
            Sort By
          </label>
          <Select
            items={sortByItems}
            onValueChange={(value) => {
              if (value) {
                onChangeSortBy(value);
              }
            }}
            value={sortBy}
          >
            <SelectTrigger className="w-full" id="attendance-sort-by">
              <SelectValue />
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
            htmlFor="attendance-sort-order"
          >
            Sort Order
          </label>
          <Select
            items={sortOrderItems}
            onValueChange={(value) => {
              if (value) {
                onChangeSortOrder(value);
              }
            }}
            value={sortOrder}
          >
            <SelectTrigger className="w-full" id="attendance-sort-order">
              <SelectValue />
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
      </div>
    </div>
  );
}
