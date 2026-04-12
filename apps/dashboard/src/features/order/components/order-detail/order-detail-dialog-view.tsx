import { OrderDetailContent } from "./order-detail-content";
import { OrderPaymentVerificationActions } from "../order-payment-verification-actions";
import { OrderRefundActions } from "../order-refund-actions";
import { Button } from "@tedx-2026/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@tedx-2026/ui/components/dialog";

type OrderDetailDialogViewProps = {
  canProcessRequestedRefund: boolean;
  canVerifyPayment: boolean;
  errorMessage: string | null;
  hasDetail: boolean;
  isLoading: boolean;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  orderId: string;
};

export function OrderDetailDialogView({
  canProcessRequestedRefund,
  canVerifyPayment,
  errorMessage,
  hasDetail,
  isLoading,
  onOpenChange,
  open,
  orderId,
}: OrderDetailDialogViewProps) {
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogTrigger>
        <Button size="sm" variant="outline">
          Detail
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[88dvh] overflow-y-auto sm:max-w-6xl">
        <DialogHeader>
          <DialogTitle>Order Detail</DialogTitle>
          <DialogDescription>
            Buyer info, snapshot items, payment details, and timestamps.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div id="order-detail-loading">Loading detail...</div>
        ) : null}
        {errorMessage ? (
          <div className="text-destructive" id="order-detail-error">
            {errorMessage}
          </div>
        ) : null}

        {hasDetail ? <OrderDetailContent /> : null}

        {canVerifyPayment ? (
          <OrderPaymentVerificationActions orderId={orderId} />
        ) : null}

        {canProcessRequestedRefund ? (
          <OrderRefundActions orderId={orderId} />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
