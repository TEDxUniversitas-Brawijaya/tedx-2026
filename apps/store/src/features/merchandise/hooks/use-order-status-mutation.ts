import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/shared/lib/query-client";
import { trpc } from "@/shared/lib/trpc";
import { useCartStore } from "../store/cart-store";

const fetchOrderStatus = (orderId: string) =>
  queryClient.fetchQuery(trpc.merch.getOrderStatus.queryOptions({ orderId }));

type OrderStatusOutput = Awaited<ReturnType<typeof fetchOrderStatus>>;

type UseOrderStatusMutationOptions = {
  onOrderSynced?: () => void;
};

export const useOrderStatusMutation = (
  options: UseOrderStatusMutationOptions = {}
) => {
  const { orderId, setOrder } = useCartStore();

  return useMutation<OrderStatusOutput, Error, void>({
    mutationFn: () => {
      if (!orderId) {
        throw new Error("Order ID is missing");
      }

      return fetchOrderStatus(orderId);
    },
    onSuccess: (data) => {
      setOrder({
        orderId: data.orderId,
        status: data.status,
        items: data.items,
        totalPrice: data.totalPrice,
        createdAt: data.createdAt,
        paidAt: data.paidAt,
      });
      options.onOrderSynced?.();
    },
  });
};
