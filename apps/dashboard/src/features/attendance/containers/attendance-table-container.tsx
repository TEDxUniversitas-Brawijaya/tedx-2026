import { queryClient } from "@/shared/lib/query-client";
import { trpc } from "@/shared/lib/trpc";
import { useMutation, useQuery } from "@tanstack/react-query";
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
import { useCallback } from "react";
import { toast } from "sonner";
import { AttendancePaginationControls } from "../components/attendance-pagination-controls";
import { AttendanceTable } from "../components/attendance-table";
import { QrScanner } from "../components/qr-scanner";
import { useAttendanceFilterStore } from "../stores/use-attendance-filter-store";
import type { AttendanceStatus } from "../types/attendance";

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
  const checkInMutation = useMutation(
    trpc.admin.attendance.checkIn.mutationOptions()
  );
  const updateStatusMutation = useMutation(
    trpc.admin.attendance.updateStatus.mutationOptions()
  );
  const isUpdating =
    checkInMutation.isPending || updateStatusMutation.isPending;

  const invalidateAttendance = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: trpc.admin.attendance.list.queryKey(),
    });
  }, []);

  const handleCheckIn = useCallback(
    (qrCode: string) => {
      checkInMutation.mutate(
        { qrCode },
        {
          onError: (error) => {
            toast.error(error.message);
          },
          onSuccess: (ticket) => {
            invalidateAttendance();
            toast.success(`${ticket.buyerName} checked in`);
          },
        }
      );
    },
    [checkInMutation, invalidateAttendance]
  );

  const handleUpdateStatus = useCallback(
    (ticketId: string, nextStatus: AttendanceStatus) => {
      updateStatusMutation.mutate(
        { ticketId, status: nextStatus },
        {
          onError: (error) => {
            toast.error(error.message);
          },
          onSuccess: (result) => {
            invalidateAttendance();
            toast.success(result.message);
          },
        }
      );
    },
    [invalidateAttendance, updateStatusMutation]
  );

  if (listQuery.isLoading) {
    return (
      <div className="space-y-4">
        <QrScanner disabled={true} onDetect={handleCheckIn} />
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
      <QrScanner disabled={isUpdating} onDetect={handleCheckIn} />
      <AttendanceTable
        isUpdating={isUpdating}
        onCheckIn={handleCheckIn}
        onUpdateStatus={handleUpdateStatus}
        tickets={listQuery.data.tickets}
      />
      <AttendancePaginationControls
        totalPages={listQuery.data.pagination.totalPages}
      />
    </div>
  );
}
