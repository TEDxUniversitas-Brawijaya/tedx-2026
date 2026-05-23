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
import { MerchPickupFilters } from "../components/merch-pickup-filters";
import { MerchPickupPaginationControls } from "../components/merch-pickup-pagination-controls";
import { MerchPickupTable } from "../components/merch-pickup-table";
import { useMerchPickupFilterStore } from "../stores/use-merch-pickup-filter-store";

export function MerchPickupTableContainer() {
  const {
    filter: { limit, page, search, status },
  } = useMerchPickupFilterStore();

  const listQuery = useQuery(
    trpc.admin.merchPickup.list.queryOptions({
      page,
      limit,
      status: status === "all" ? undefined : status,
      search: search.trim() || undefined,
    })
  );

  if (listQuery.isLoading) {
    return (
      <div className="space-y-4">
        <div className="rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Buyer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Order Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="h-20 text-center" colSpan={6}>
                  Loading merch pickup orders...
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  if (listQuery.error) {
    return (
      <Alert className="w-full" variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load merch pickup orders: {listQuery.error.message}
        </AlertDescription>
      </Alert>
    );
  }

  if (!listQuery.data) {
    return (
      <Alert className="w-full" variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Failed to load merch pickup orders.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <MerchPickupFilters />
      <MerchPickupTable orders={listQuery.data.orders} />
      <MerchPickupPaginationControls
        total={listQuery.data.pagination.total}
        totalPages={listQuery.data.pagination.totalPages}
      />
    </div>
  );
}
