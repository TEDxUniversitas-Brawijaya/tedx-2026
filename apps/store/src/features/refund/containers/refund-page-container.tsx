import { trpc } from "@/shared/lib/trpc";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { RefundErrorState } from "../components/refund-error-state";
import { RefundPolicyScreen } from "../components/refund-policy-screen";
import { RefundRequestForm } from "../components/refund-request-form";
import { RefundRequestFormSkeleton } from "../components/refund-request-form-skeleton";
import { RefundSuccessState } from "../components/refund-success-state";
import { useRefundRequestForm } from "../hooks/use-refund-request-form";
import type { RefundErrorCode } from "../types";

type RefundPageContainerProps = {
  refundToken: string;
};

const getErrorCode = (message: string): RefundErrorCode => {
  if (message.includes("INVALID_REFUND_TOKEN")) {
    return "INVALID_REFUND_TOKEN";
  }
  if (message.includes("ORDER_NOT_REFUNDABLE")) {
    return "ORDER_NOT_REFUNDABLE";
  }
  if (message.includes("REFUND_DEADLINE_PASSED")) {
    return "REFUND_DEADLINE_PASSED";
  }
  if (message.includes("REFUND_ALREADY_REQUESTED")) {
    return "REFUND_ALREADY_REQUESTED";
  }

  return "UNKNOWN";
};

export function RefundPageContainer({ refundToken }: RefundPageContainerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const orderInfoQuery = useQuery({
    ...trpc.refund.getOrderInfo.queryOptions({
      refundToken,
    }),
    enabled: isDialogOpen,
  });

  const form = useRefundRequestForm({
    refundToken,
    paymentMethod: orderInfoQuery.data?.paymentMethod ?? "manual",
    onSuccess: () => {
      setHasSubmitted(true);
    },
  });

  if (isDialogOpen && !hasSubmitted && orderInfoQuery.error) {
    return (
      <RefundErrorState
        code={getErrorCode(orderInfoQuery.error.message)}
        message={orderInfoQuery.error.message}
      />
    );
  }

  if (
    isDialogOpen &&
    !hasSubmitted &&
    !orderInfoQuery.data &&
    !orderInfoQuery.isLoading
  ) {
    return (
      <RefundErrorState
        code="UNKNOWN"
        message="Order data is not available for this refund token."
      />
    );
  }

  return (
    <>
      <RefundPolicyScreen
        onContinue={() => {
          setHasSubmitted(false);
          setIsDialogOpen(true);
        }}
      />

      {isDialogOpen && !hasSubmitted && orderInfoQuery.isLoading ? (
        <RefundRequestFormSkeleton />
      ) : null}

      {isDialogOpen && !hasSubmitted && orderInfoQuery.data ? (
        <RefundRequestForm
          form={form}
          onClose={() => setIsDialogOpen(false)}
          orderInfo={orderInfoQuery.data}
        />
      ) : null}

      {isDialogOpen && hasSubmitted ? (
        <RefundSuccessState onClose={() => setIsDialogOpen(false)} />
      ) : null}
    </>
  );
}
