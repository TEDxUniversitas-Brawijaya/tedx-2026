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
import { AttendanceFilters } from "../components/attendance-filters";
import { AttendancePaginationControls } from "../components/attendance-pagination-controls";
import { AttendanceTable } from "../components/attendance-table";
import { useAttendanceFilterStore } from "../stores/use-attendance-filter-store";

export function AttendanceTableContainer() {
  const {
    filter: { eventDay, limit, page, search, sortBy, sortOrder, status },
  } = useAttendanceFilterStore();

  const listQuery = useQuery(
    trpc.admin.attendance.list.queryOptions({
      page,
      limit,
      eventDay: eventDay === "all" ? undefined : eventDay,
      status: status === "all" ? undefined : status,
      search: search.trim() || undefined,
      sortBy,
      sortOrder,
    })
  );

  if (listQuery.isLoading) {
    return (
      <div className="space-y-4">
        <div className="rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Buyer</TableHead>
                <TableHead>Event Day</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Checked In At</TableHead>
                <TableHead>Order ID</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="h-20 text-center" colSpan={6}>
                  Loading attendance...
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
          Failed to load attendance: {listQuery.error.message}
        </AlertDescription>
      </Alert>
    );
  }

  if (!listQuery.data) {
    return (
      <Alert className="w-full" variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Failed to load attendance.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <AttendanceFilters />
      <AttendanceTable tickets={listQuery.data.tickets} />
      <AttendancePaginationControls
        totalPages={listQuery.data.pagination.totalPages}
      />
    </div>
  );
}
