import { trpc } from "@/shared/lib/trpc";
import { useQuery } from "@tanstack/react-query";
import { OrderDetailDialogContent } from "../components/order-detail/order-detail-dialog-content";

type OrderDetailDialogContainerProps = {
  orderId: string;
};

export function OrderDetailDialogContainer({
  orderId,
}: OrderDetailDialogContainerProps) {
  const detailQuery = useQuery({
    ...trpc.admin.order.getById.queryOptions({ orderId }),
  });

  if (detailQuery.isLoading) {
    return <div>Loading...</div>;
  }

  if (detailQuery.error) {
    return <div>Error: {detailQuery.error.message}</div>;
  }

  if (!detailQuery.data) {
    return <div>No detail found.</div>;
  }

  return <OrderDetailDialogContent order={detailQuery.data} />;
}
