import { trpc } from "@/shared/lib/trpc";
import { useQuery } from "@tanstack/react-query";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@tedx-2026/ui/components/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@tedx-2026/ui/components/table";
import { OrderPaginationControls } from "../components/order-pagination-controls";
import { OrdersTable } from "../components/orders-table";
import { useOrderFilterStore } from "../stores/use-order-filter-store";

export function OrdersTableContainer() {
  const {
    filter: { limit, page, search, sortBy, sortOrder, status, type },
  } = useOrderFilterStore();

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

  if (listQuery.isLoading) {
    return (
      <div className="rounded-xl border" id="order-management-table-wrapper">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Created At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="text-center" colSpan={5}>
                Loading orders...
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }

  if (listQuery.error) {
    return (
      <Alert className="w-full" variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load orders: {listQuery.error.message}
        </AlertDescription>
      </Alert>
    );
  }

  if (!listQuery.data) {
    return (
      <Alert className="w-full" variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Failed to load orders.</AlertDescription>
      </Alert>
    );
  }

  return (
    <>
      <OrdersTable orders={listQuery.data.orders} />
      <OrderPaginationControls
        totalPages={listQuery.data.pagination.totalPages}
      />
    </>
  );
}
