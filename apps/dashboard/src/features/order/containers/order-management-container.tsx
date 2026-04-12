import { OrderManagement } from "../components/order-management";
import { initialOrderListState, type OrderListState } from "../types/order";
import { trpc } from "@/shared/lib/trpc";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export function OrderManagementContainer() {
  const [orderListState, setOrderListState] = useState<OrderListState>(
    initialOrderListState
  );

  const { limit, page, search, sortBy, sortOrder, status, type } =
    orderListState;

  const patchOrderListState = (patch: Partial<OrderListState>) => {
    setOrderListState((prev) => ({
      ...prev,
      ...patch,
    }));
  };

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
      onPatch={patchOrderListState}
      onPrev={() => patchOrderListState({ page: Math.max(1, page - 1) })}
      orders={orders}
      state={orderListState}
      totalPages={totalPages}
    />
  );
}
