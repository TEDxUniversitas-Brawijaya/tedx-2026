import { Footer } from "@/shared/components/footer";
import { Navbar } from "@/shared/components/navbar";
import { NotFoundPage } from "@/shared/components/not-found";
import { trpc } from "@/shared/lib/trpc";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { RefundPolicyScreen } from "../components/refund-policy-screen";
import { RefundDialog } from "../components/refund-dialog";

type RefundPageContainerProps = {
  refundToken: string;
};

export function RefundPageContainer({ refundToken }: RefundPageContainerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const orderInfoQuery = useQuery({
    ...trpc.refund.getOrderInfo.queryOptions({
      refundToken,
    }),
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
      <RefundPolicyScreen onContinue={() => setIsDialogOpen(true)} />

      <RefundDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        refundToken={refundToken}
      />

      <Footer />
    </main>
  );
}
