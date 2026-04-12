import { OrderManagement } from "../components/order-management";
import {
  useOrderFilterStore,
  type OrderFilterStoreState,
} from "../stores/use-order-filter-store";
import { trpc } from "@/shared/lib/trpc";
import { useQuery } from "@tanstack/react-query";

export function OrderManagementContainer() {
  const orderListState = useOrderFilterStore(
    (state: OrderFilterStoreState) => state.orderListState
  );
  const patchOrderListState = useOrderFilterStore(
    (state: OrderFilterStoreState) => state.patchOrderListState
  );

  const { limit, page, search, sortBy, sortOrder, status, type } =
    orderListState;

  const listQuery = useQuery(
    trpc.admin.order.list.queryOptions({
      page,
      limit,
      type: type === "all" ? undefined : type,
      status: status === "all" ? undefined : status,
      search: search.trim() || undefined,
      sortBy,
      sortOrder,
    })
  );

  if (listQuery.isLoading) {
    return <div>Loading orders...</div>;
  }

  if (listQuery.error) {
    return <div>Error: {listQuery.error.message}</div>;
  }

  const orders = listQuery.data?.orders ?? [];
  const totalPages = listQuery.data?.pagination.totalPages ?? 1;

  return (
    <OrderManagement
      currentPage={listQuery.data?.pagination.page ?? page}
      onNext={() =>
        patchOrderListState({ page: Math.min(totalPages, page + 1) })
      }
      onPrev={() => patchOrderListState({ page: Math.max(1, page - 1) })}
      orders={orders}
      totalPages={totalPages}
    />
  );
}
