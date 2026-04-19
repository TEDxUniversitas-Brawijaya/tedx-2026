import chandelier from "@/assets/imgs/chandelier-1.png";
import { trpc } from "@/shared/lib/trpc";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
} from "@tedx-2026/ui/components/dialog";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useRefundRequestForm } from "../hooks/use-refund-request-form";
import { RefundRequestForm } from "./steps/refund-request-form";
import { RefundRequestFormSkeleton } from "./steps/refund-request-form-skeleton";

export function RefundDialog({
  refundToken,
  isOpen,
  onOpenChange,
}: {
  refundToken: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const orderInfoQuery = useQuery({
    ...trpc.refund.getOrderInfo.queryOptions({
      refundToken,
    }),
    enabled: isOpen,
  });

  const form = useRefundRequestForm({
    refundToken,
    paymentMethod: orderInfoQuery.data?.paymentMethod ?? "manual",
    onSuccess: () => {
      setHasSubmitted(true);
    },
  });

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!(open || form.isSubmitting)) {
          onOpenChange(open);
          if (!open) {
            setTimeout(() => setHasSubmitted(false), 300);
          }
        }
      }}
      open={isOpen}
    >
      <DialogOverlay className="bg-black/20 supports-backdrop-filter:backdrop-blur-none!" />
      <DialogContent
        className="max-h-[92vh] w-[calc(100%-2rem)] max-w-107.5 overflow-y-auto overflow-x-hidden rounded-3xl border border-white/10 bg-[#262626]/90 p-6 text-white shadow-[0_0_65px_rgba(255,149,0,0.45)] backdrop-blur-sm *:data-[slot=dialog-close]:z-20 *:data-[slot=dialog-close]:bg-transparent *:data-[slot=dialog-close]:text-white sm:max-w-107.5 sm:p-7 md:w-full"
        showCloseButton={false}
      >
        <img
          alt="chandelier"
          aria-hidden
          className="pointer-events-none absolute -top-14 -right-18 w-56 opacity-25"
          height={256}
          src={chandelier}
          width={256}
        />

        <div className="relative z-2">
          {orderInfoQuery.isLoading && <RefundRequestFormSkeleton />}
          {!orderInfoQuery.isLoading && orderInfoQuery.data && (
            <RefundRequestForm
              form={form}
              isSuccess={hasSubmitted}
              onClose={() => onOpenChange(false)}
              orderInfo={orderInfoQuery.data}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
