import { trpc } from "@/shared/lib/trpc";
import type {
  getOrderByIdOutputSchema,
  listOrdersOutputSchema,
} from "@tedx-2026/api/schemas/order";
import type { infer as zInfer } from "zod";
import {
  IconChevronLeft,
  IconChevronRight,
  IconSearch,
} from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@tedx-2026/ui/components/badge";
import { Button } from "@tedx-2026/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@tedx-2026/ui/components/dialog";
import { Input } from "@tedx-2026/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@tedx-2026/ui/components/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@tedx-2026/ui/components/table";
import { useMemo, useState } from "react";

type ListOrdersOutput = zInfer<typeof listOrdersOutputSchema>;
type GetOrderByIdOutput = zInfer<typeof getOrderByIdOutputSchema>;
type ListOrder = ListOrdersOutput["orders"][number];
type OrderDetail = GetOrderByIdOutput;
type OrderType = ListOrder["type"];
type OrderStatus = ListOrder["status"];

const statusVariant = (status: string) => {
  if (status === "paid") {
    return "default" as const;
  }

  if (status === "pending_payment" || status === "pending_verification") {
    return "secondary" as const;
  }

  if (status === "refund_requested") {
    return "outline" as const;
  }

  if (status === "expired" || status === "refunded") {
    return "destructive" as const;
  }

  return "outline" as const;
};

const formatDate = (value: string | null) => {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("id-ID", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
    timeZoneName: "short",
  }).format(new Date(value));
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
};

const isWithinDateRange = (
  createdAt: string,
  startDate: string,
  endDate: string
) => {
  if (startDate === "" && endDate === "") {
    return true;
  }

  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) {
    return false;
  }

  const parseUtcBoundary = (yyyyMmDd: string, boundary: "start" | "end") => {
    const parts = yyyyMmDd.split("-");
    if (parts.length !== 3) {
      return null;
    }

    const [yearString, monthString, dayString] = parts as [
      string,
      string,
      string,
    ];

    const year = Number(yearString);
    const month = Number(monthString);
    const day = Number(dayString);

    if (
      Number.isNaN(year) ||
      Number.isNaN(month) ||
      Number.isNaN(day) ||
      yearString.length !== 4 ||
      monthString.length !== 2 ||
      dayString.length !== 2
    ) {
      return null;
    }

    return boundary === "start"
      ? new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0))
      : new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));
  };

  if (startDate) {
    const start = parseUtcBoundary(startDate, "start");
    if (!start) {
      return false;
    }

    if (date < start) {
      return false;
    }
  }

  if (endDate) {
    const end = parseUtcBoundary(endDate, "end");
    if (!end) {
      return false;
    }

    if (date > end) {
      return false;
    }
  }

  return true;
};

export function OrderManagement() {
  const [type, setType] = useState<"all" | OrderType>("all");
  const [status, setStatus] = useState<"all" | OrderStatus>("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"createdAt" | "totalPrice" | "status">(
    "createdAt"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const listQuery = useQuery(
    trpc.admin.order.list.queryOptions({
      page,
      limit,
      type: type === "all" ? undefined : type,
      status: status === "all" ? undefined : status,
      search: search.trim() || undefined,
      sortBy,
      sortOrder,
    })
  );

  const detailQuery = useQuery({
    ...trpc.admin.order.getById.queryOptions({
      orderId: selectedOrderId ?? "TDX-260401-A1B2C",
    }),
    enabled: selectedOrderId !== null,
  });

  const filteredOrders = useMemo(() => {
    const rows = listQuery.data?.orders ?? [];

    return rows.filter((order) =>
      isWithinDateRange(order.createdAt, startDate, endDate)
    );
  }, [endDate, listQuery.data?.orders, startDate]);

  const totalPages = listQuery.data?.pagination.totalPages ?? 1;

  return (
    <div className="space-y-4" id="order-management">
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
                  setPage(1);
                  setSearch(event.target.value);
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
              onValueChange={(value) => {
                if (value === null) {
                  return;
                }

                setPage(1);
                setType(value as "all" | OrderType);
              }}
              value={type}
            >
              <SelectTrigger
                className="w-full"
                id="order-management-filter-type"
              >
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

                setPage(1);
                setStatus(value as "all" | OrderStatus);
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
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending_payment">pending_payment</SelectItem>
                <SelectItem value="pending_verification">
                  pending_verification
                </SelectItem>
                <SelectItem value="paid">paid</SelectItem>
                <SelectItem value="expired">expired</SelectItem>
                <SelectItem value="refund_requested">
                  refund_requested
                </SelectItem>
                <SelectItem value="refunded">refunded</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div
            className="grid grid-cols-2 gap-2"
            id="order-management-date-range"
          >
            <div className="space-y-1.5">
              <label
                className="font-medium text-muted-foreground text-xs"
                htmlFor="order-management-date-start"
              >
                Start Date (UTC)
              </label>
              <Input
                id="order-management-date-start"
                onChange={(event) => {
                  setPage(1);
                  setStartDate(event.target.value);
                }}
                type="date"
                value={startDate}
              />
            </div>
            <div className="space-y-1.5">
              <label
                className="font-medium text-muted-foreground text-xs"
                htmlFor="order-management-date-end"
              >
                End Date (UTC)
              </label>
              <Input
                id="order-management-date-end"
                onChange={(event) => {
                  setPage(1);
                  setEndDate(event.target.value);
                }}
                type="date"
                value={endDate}
              />
            </div>
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

                setSortBy(value as "createdAt" | "totalPrice" | "status");
              }}
              value={sortBy}
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

                setSortOrder(value as "asc" | "desc");
              }}
              value={sortOrder}
            >
              <SelectTrigger
                className="w-full"
                id="order-management-sort-order"
              >
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

                setPage(1);
                setLimit(Number(value));
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
                <SelectItem value="5">5 rows</SelectItem>
                <SelectItem value="10">10 rows</SelectItem>
                <SelectItem value="20">20 rows</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="rounded-xl border" id="order-management-table-wrapper">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Buyer</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Paid At</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {listQuery.isLoading && (
              <TableRow>
                <TableCell className="h-16 text-center" colSpan={8}>
                  Loading orders...
                </TableCell>
              </TableRow>
            )}

            {!listQuery.isLoading &&
              listQuery.error &&
              filteredOrders.length === 0 && (
                <TableRow>
                  <TableCell className="h-16 text-center" colSpan={8}>
                    No orders found.
                  </TableCell>
                </TableRow>
              )}

            {filteredOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>
                  <div id={`order-${order.id}-buyer-name`}>
                    {order.buyerName}
                  </div>
                  <div
                    className="text-muted-foreground text-xs"
                    id={`order-${order.id}-buyer-email`}
                  >
                    {order.buyerEmail}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{order.type}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={statusVariant(order.status)}>
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell>{formatCurrency(order.totalPrice)}</TableCell>
                <TableCell>{formatDate(order.createdAt)}</TableCell>
                <TableCell>{formatDate(order.paidAt)}</TableCell>
                <TableCell className="text-right">
                  <Button
                    onClick={() => setSelectedOrderId(order.id)}
                    size="sm"
                    variant="outline"
                  >
                    Detail
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div
        className="flex items-center justify-between"
        id="order-management-pagination"
      >
        <p
          className="text-muted-foreground text-sm"
          id="order-management-pagination-text"
        >
          Page {listQuery.data?.pagination.page ?? page} of {totalPages}
        </p>
        <div
          className="flex items-center gap-2"
          id="order-management-pagination-actions"
        >
          <div className="flex flex-col items-center gap-1">
            <Button
              aria-label="Previous page"
              disabled={page <= 1}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              size="icon-sm"
              title="Previous page"
              variant="outline"
            >
              <IconChevronLeft />
            </Button>
            <span className="text-muted-foreground text-xs">Prev</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Button
              aria-label="Next page"
              disabled={page >= totalPages}
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              size="icon-sm"
              title="Next page"
              variant="outline"
            >
              <IconChevronRight />
            </Button>
            <span className="text-muted-foreground text-xs">Next</span>
          </div>
        </div>
      </div>

      <Dialog
        onOpenChange={(open) => {
          if (!open) {
            setSelectedOrderId(null);
          }
        }}
        open={selectedOrderId !== null}
      >
        <DialogContent className="max-h-[88dvh] overflow-y-auto sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Order Detail</DialogTitle>
            <DialogDescription>
              Buyer info, snapshot items, payment details, and timestamps.
            </DialogDescription>
          </DialogHeader>

          {detailQuery.isLoading && (
            <div id="order-detail-loading">Loading detail...</div>
          )}
          {detailQuery.error && (
            <div className="text-destructive" id="order-detail-error">
              {detailQuery.error.message}
            </div>
          )}

          {detailQuery.data && <OrderDetailContent order={detailQuery.data} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}

type OrderDetailContentProps = {
  order: OrderDetail;
};

function OrderDetailContent({ order }: OrderDetailContentProps) {
  return (
    <div className="space-y-4" id="order-detail-content">
      <div
        className="grid gap-2 rounded-lg border p-4 md:grid-cols-2"
        id="order-detail-buyer-info"
      >
        <p id="order-detail-buyer-name">
          <span className="font-medium" id="order-detail-buyer-name-label">
            Nama:
          </span>{" "}
          {order.buyerName}
        </p>
        <p id="order-detail-buyer-email">
          <span className="font-medium" id="order-detail-buyer-email-label">
            Email:
          </span>{" "}
          {order.buyerEmail}
        </p>
        <p id="order-detail-buyer-phone">
          <span className="font-medium" id="order-detail-buyer-phone-label">
            Phone:
          </span>{" "}
          {order.buyerPhone}
        </p>
        <p id="order-detail-buyer-college">
          <span className="font-medium" id="order-detail-buyer-college-label">
            Instansi:
          </span>{" "}
          {order.buyerCollege}
        </p>
      </div>

      <div className="rounded-lg border" id="order-detail-items">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Qty</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Variants</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {order.items.map((item) => (
              <TableRow key={item.id}>
                <TableCell id={`order-detail-item-${item.id}-name`}>
                  {item.snapshotName}
                </TableCell>
                <TableCell id={`order-detail-item-${item.id}-type`}>
                  {item.snapshotType}
                </TableCell>
                <TableCell id={`order-detail-item-${item.id}-quantity`}>
                  {item.quantity}
                </TableCell>
                <TableCell id={`order-detail-item-${item.id}-price`}>
                  {formatCurrency(item.snapshotPrice)}
                </TableCell>
                <TableCell>
                  <span id={`order-detail-item-${item.id}-variants`}>
                    {item.snapshotVariants?.length
                      ? item.snapshotVariants
                          .map((variant) => `${variant.type}: ${variant.label}`)
                          .join(", ")
                      : "-"}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div
        className="grid gap-2 rounded-lg border p-4 md:grid-cols-2"
        id="order-detail-payment-info"
      >
        <p id="order-detail-payment-method">
          <span className="font-medium" id="order-detail-payment-method-label">
            Payment Method:
          </span>{" "}
          {order.paymentMethod ?? "-"}
        </p>
        <p id="order-detail-midtrans-order-id">
          <span
            className="font-medium"
            id="order-detail-midtrans-order-id-label"
          >
            Midtrans Order ID:
          </span>{" "}
          {order.midtransOrderId ?? "-"}
        </p>
        <p id="order-detail-created-at">
          <span className="font-medium" id="order-detail-created-at-label">
            Created:
          </span>{" "}
          {formatDate(order.createdAt)}
        </p>
        <p id="order-detail-paid-at">
          <span className="font-medium" id="order-detail-paid-at-label">
            Paid:
          </span>{" "}
          {formatDate(order.paidAt)}
        </p>
        <p id="order-detail-expires-at">
          <span className="font-medium" id="order-detail-expires-at-label">
            Expires:
          </span>{" "}
          {formatDate(order.expiresAt)}
        </p>
        <p id="order-detail-status">
          <span className="font-medium" id="order-detail-status-label">
            Status:
          </span>{" "}
          {order.status}
        </p>
      </div>
    </div>
  );
}
