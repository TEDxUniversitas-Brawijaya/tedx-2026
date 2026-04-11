import { trpc } from "@/shared/lib/trpc";
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

type OrderType = "ticket" | "merch";
type OrderStatus =
  | "pending_payment"
  | "pending_verification"
  | "paid"
  | "expired"
  | "refund_requested"
  | "refunded";

type ListOrder = {
  id: string;
  type: OrderType;
  status: OrderStatus;
  buyerName: string;
  buyerEmail: string;
  totalPrice: number;
  createdAt: string;
  paidAt: string | null;
};

type OrderDetail = {
  id: string;
  type: OrderType;
  status: OrderStatus;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  buyerCollege: string;
  totalPrice: number;
  createdAt: string;
  paidAt: string | null;
  expiresAt: string | null;
  paymentMethod: "midtrans" | "manual" | null;
  midtransOrderId: string | null;
  proofImageUrl: string | null;
  items: {
    id: string;
    productId: string;
    quantity: number;
    snapshotName: string;
    snapshotPrice: number;
    snapshotType: string;
    snapshotVariants: { label: string; type: string }[] | null;
  }[];
};

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

  if (startDate) {
    const start = new Date(`${startDate}T00:00:00.000Z`);
    if (date < start) {
      return false;
    }
  }

  if (endDate) {
    const end = new Date(`${endDate}T23:59:59.999Z`);
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
    const rows = (listQuery.data?.orders ?? []) as ListOrder[];

    return rows.filter((order) =>
      isWithinDateRange(order.createdAt, startDate, endDate)
    );
  }, [endDate, listQuery.data?.orders, startDate]);

  const totalPages = listQuery.data?.pagination.totalPages ?? 1;

  return (
    <div className="space-y-4">
      <div className="rounded-xl border bg-card p-4">
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <div className="relative">
            <IconSearch className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9"
              onChange={(event) => {
                setPage(1);
                setSearch(event.target.value);
              }}
              placeholder="Search by name, email, order ID"
              value={search}
            />
          </div>

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
            <SelectTrigger>
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="ticket">ticket</SelectItem>
              <SelectItem value="merch">merch</SelectItem>
            </SelectContent>
          </Select>

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
            <SelectTrigger>
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

          <div className="grid grid-cols-2 gap-2">
            <Input
              onChange={(event) => {
                setPage(1);
                setStartDate(event.target.value);
              }}
              type="date"
              value={startDate}
            />
            <Input
              onChange={(event) => {
                setPage(1);
                setEndDate(event.target.value);
              }}
              type="date"
              value={endDate}
            />
          </div>
        </div>

        <div className="mt-3 grid gap-3 md:grid-cols-3">
          <Select
            onValueChange={(value) => {
              if (value === null) {
                return;
              }

              setSortBy(value as "createdAt" | "totalPrice" | "status");
            }}
            value={sortBy}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt">createdAt</SelectItem>
              <SelectItem value="totalPrice">totalPrice</SelectItem>
              <SelectItem value="status">status</SelectItem>
            </SelectContent>
          </Select>

          <Select
            onValueChange={(value) => {
              if (value === null) {
                return;
              }

              setSortOrder(value as "asc" | "desc");
            }}
            value={sortOrder}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sort order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">asc</SelectItem>
              <SelectItem value="desc">desc</SelectItem>
            </SelectContent>
          </Select>

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
            <SelectTrigger>
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

      <div className="rounded-xl border">
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

            {!listQuery.isLoading && filteredOrders.length === 0 && (
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
                  <div>{order.buyerName}</div>
                  <div className="text-muted-foreground text-xs">
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

      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          Page {listQuery.data?.pagination.page ?? page} of {totalPages}
        </p>
        <div className="flex items-center gap-2">
          <Button
            disabled={page <= 1}
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            size="icon-sm"
            variant="outline"
          >
            <IconChevronLeft />
          </Button>
          <Button
            disabled={page >= totalPages}
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            size="icon-sm"
            variant="outline"
          >
            <IconChevronRight />
          </Button>
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

          {detailQuery.isLoading && <div>Loading detail...</div>}
          {detailQuery.error && (
            <div className="text-destructive">{detailQuery.error.message}</div>
          )}

          {detailQuery.data && (
            <OrderDetailContent order={detailQuery.data as OrderDetail} />
          )}
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
    <div className="space-y-4">
      <div className="grid gap-2 rounded-lg border p-4 md:grid-cols-2">
        <p>
          <span className="font-medium">Nama:</span> {order.buyerName}
        </p>
        <p>
          <span className="font-medium">Email:</span> {order.buyerEmail}
        </p>
        <p>
          <span className="font-medium">Phone:</span> {order.buyerPhone}
        </p>
        <p>
          <span className="font-medium">Instansi:</span> {order.buyerCollege}
        </p>
      </div>

      <div className="rounded-lg border">
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
                <TableCell>{item.snapshotName}</TableCell>
                <TableCell>{item.snapshotType}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{formatCurrency(item.snapshotPrice)}</TableCell>
                <TableCell>
                  {item.snapshotVariants?.length
                    ? item.snapshotVariants
                        .map((variant) => `${variant.type}: ${variant.label}`)
                        .join(", ")
                    : "-"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="grid gap-2 rounded-lg border p-4 md:grid-cols-2">
        <p>
          <span className="font-medium">Payment Method:</span>{" "}
          {order.paymentMethod ?? "-"}
        </p>
        <p>
          <span className="font-medium">Midtrans Order ID:</span>{" "}
          {order.midtransOrderId ?? "-"}
        </p>
        <p>
          <span className="font-medium">Created:</span>{" "}
          {formatDate(order.createdAt)}
        </p>
        <p>
          <span className="font-medium">Paid:</span> {formatDate(order.paidAt)}
        </p>
        <p>
          <span className="font-medium">Expires:</span>{" "}
          {formatDate(order.expiresAt)}
        </p>
        <p>
          <span className="font-medium">Status:</span> {order.status}
        </p>
      </div>
    </div>
  );
}
