import { Footer } from "@/shared/components/footer";
import { Navbar } from "@/shared/components/navbar";
import { NotFoundPage } from "@/shared/components/not-found";
import { trpc } from "@/shared/lib/trpc";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { RefundPolicyScreen } from "../components/refund-policy-screen";
import { RefundRequestForm } from "../components/refund-request-form";
import { RefundRequestFormSkeleton } from "../components/refund-request-form-skeleton";
import { RefundSuccessState } from "../components/refund-success-state";
import { useRefundRequestForm } from "../hooks/use-refund-request-form";

type RefundPageContainerProps = {
  refundToken: string;
};

export function RefundPageContainer({ refundToken }: RefundPageContainerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const orderInfoQuery = useQuery({
    ...trpc.refund.getOrderInfo.queryOptions({
      refundToken,
    }),
  });

  const form = useRefundRequestForm({
    refundToken,
    paymentMethod: orderInfoQuery.data?.paymentMethod ?? "manual",
    onSuccess: () => {
      setHasSubmitted(true);
    },
  });

  if (
    orderInfoQuery.error ||
    !(orderInfoQuery.isLoading || orderInfoQuery.data)
  ) {
    return <NotFoundPage />;
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
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
      <Footer />
    </main>
  );
}
