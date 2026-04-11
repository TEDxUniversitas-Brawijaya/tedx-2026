import { trpc } from "@/shared/lib/trpc";
import { OrderDetailContent } from "./order-detail-content";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@tedx-2026/ui/components/dialog";

type OrderDetailDialogProps = {
  onOpenChange: (open: boolean) => void;
  selectedOrderId: string | null;
};

export function OrderDetailDialog({
  onOpenChange,
  selectedOrderId,
}: OrderDetailDialogProps) {
  const detailQuery = useQuery({
    ...trpc.admin.order.getById.queryOptions({
      orderId: selectedOrderId ?? "TDX-260401-A1B2C",
    }),
    enabled: selectedOrderId !== null,
  });

  return (
    <Dialog onOpenChange={onOpenChange} open={selectedOrderId !== null}>
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
