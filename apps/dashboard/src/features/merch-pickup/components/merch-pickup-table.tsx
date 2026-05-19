import { queryClient } from "@/shared/lib/query-client";
import { trpc } from "@/shared/lib/trpc";
import { IconCircleCheck, IconPackage } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@tedx-2026/ui/components/alert-dialog";
import { Badge } from "@tedx-2026/ui/components/badge";
import { Button } from "@tedx-2026/ui/components/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@tedx-2026/ui/components/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@tedx-2026/ui/components/tooltip";
import { useState } from "react";
import { toast } from "sonner";
import type { MerchPickupOrder } from "../types/merch-pickup";
import { formatItemsSummary, formatMerchPickupDate } from "../utils/formatter";

type MerchPickupTableProps = {
  orders: MerchPickupOrder[];
};

export function MerchPickupTable({ orders }: MerchPickupTableProps) {
  const [pendingOrderId, setPendingOrderId] = useState<string | null>(null);

  const markPickedUpMutation = useMutation(
    trpc.admin.merchPickup.markPickedUp.mutationOptions()
  );

  const pendingOrder = orders.find((o) => o.orderId === pendingOrderId) ?? null;

  const handleConfirm = () => {
    if (!pendingOrderId) {
      return;
    }

    markPickedUpMutation.mutate(
      { orderId: pendingOrderId },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: trpc.admin.merchPickup.list.queryKey(),
          });
          toast.success("Order marked as picked up");
          setPendingOrderId(null);
        },
        onError: (error) => {
          toast.error(error.message);
          setPendingOrderId(null);
        },
      }
    );
  };

  return (
    <>
      <div
        className="overflow-hidden rounded-xl border"
        id="merch-pickup-table"
      >
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
            {orders.length === 0 && (
              <TableRow>
                <TableCell className="h-20 text-center" colSpan={6}>
                  No merch orders found.
                </TableCell>
              </TableRow>
            )}

            {orders.map((order) => {
              const pickedUp = order.pickedUpAt !== null;
              const itemsSummary = formatItemsSummary(order.items);

              return (
                <TableRow key={order.orderId}>
                  <TableCell className="font-mono text-xs">
                    {order.orderId}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{order.buyerName}</div>
                    <div className="text-muted-foreground text-xs">
                      {order.buyerEmail}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[200px]">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="block w-full truncate text-left">
                          {itemsSummary}
                        </TooltipTrigger>
                        <TooltipContent>{itemsSummary}</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell>
                    {formatMerchPickupDate(order.createdAt)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={pickedUp ? "default" : "outline"}>
                      {pickedUp && <IconCircleCheck />}
                      {pickedUp ? "Picked Up" : "Pending Pickup"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {pickedUp ? (
                      <span className="text-muted-foreground text-xs">
                        {formatMerchPickupDate(order.pickedUpAt)}
                      </span>
                    ) : (
                      <Button
                        disabled={markPickedUpMutation.isPending}
                        onClick={() => setPendingOrderId(order.orderId)}
                        size="sm"
                      >
                        <IconPackage /> Mark as Picked Up
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <AlertDialog
        onOpenChange={(open) => {
          if (!open) {
            setPendingOrderId(null);
          }
        }}
        open={pendingOrderId !== null}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia>
              <IconPackage />
            </AlertDialogMedia>
            <AlertDialogTitle>Mark as Picked Up?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingOrder
                ? `Confirm that ${pendingOrder.buyerName} has received their merch order ${pendingOrder.orderId}.`
                : "Confirm this merch order has been picked up."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={markPickedUpMutation.isPending}
              onClick={handleConfirm}
            >
              Mark as Picked Up
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
