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
  const [hasAcceptedPolicy, setHasAcceptedPolicy] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const orderInfoQuery = useQuery({
    ...trpc.refund.getOrderInfo.queryOptions({
      refundToken,
    }),
    enabled: hasAcceptedPolicy,
  });

  const form = useRefundRequestForm({
    refundToken,
    paymentMethod: orderInfoQuery.data?.paymentMethod ?? "manual",
    onSuccess: () => {
      setHasSubmitted(true);
    },
  });

  if (!hasAcceptedPolicy) {
    return <RefundPolicyScreen onContinue={() => setHasAcceptedPolicy(true)} />;
  }

  if (orderInfoQuery.isLoading) {
    return <RefundRequestFormSkeleton />;
  }

  if (orderInfoQuery.error) {
    const errorMessage = orderInfoQuery.error.message;
    return (
      <RefundErrorState
        code={getErrorCode(errorMessage)}
        message={errorMessage}
      />
    );
  }

  if (!orderInfoQuery.data) {
    return (
      <RefundErrorState
        code="UNKNOWN"
        message="Order data is not available for this refund token."
      />
    );
  }

  if (hasSubmitted) {
    return <RefundSuccessState />;
  }

  return <RefundRequestForm form={form} orderInfo={orderInfoQuery.data} />;
}
