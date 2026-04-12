import { trpc } from "@/shared/lib/trpc";
import { OrderDetailContent } from "../components/order-detail-content";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@tedx-2026/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@tedx-2026/ui/components/dialog";
import { useState } from "react";

type OrderDetailDialogContainerProps = {
  orderId: string;
};

export function OrderDetailDialogContainer({
  orderId,
}: OrderDetailDialogContainerProps) {
  const [open, setOpen] = useState(false);

  const detailQuery = useQuery({
    ...trpc.admin.order.getById.queryOptions({ orderId }),
    enabled: open,
  });

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          Detail
        </Button>
      </DialogTrigger>
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
  );
}
