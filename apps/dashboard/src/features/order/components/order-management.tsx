import { trpc } from "@/shared/lib/trpc";
import { OrderDetailDialog } from "./order-detail-dialog";
import { OrderFilters } from "./order-filters";
import {
  initialOrderListState,
  type OrderListState,
} from "../types/order.types";
import { OrdersTable } from "./orders-table";
import { PaginationControls } from "./pagination-controls";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export function OrderManagement() {
  const [orderListState, setOrderListState] = useState<OrderListState>(
    initialOrderListState
  );
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

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

  const filteredOrders = listQuery.data?.orders ?? [];

  const totalPages = listQuery.data?.pagination.totalPages ?? 1;

  return (
    <div className="space-y-4" id="order-management">
      <OrderFilters onPatch={patchOrderListState} state={orderListState} />

      <OrdersTable
        isLoading={listQuery.isLoading}
        onOpenDetail={setSelectedOrderId}
        orders={filteredOrders}
      />

      <PaginationControls
        currentPage={listQuery.data?.pagination.page ?? page}
        onNext={() =>
          patchOrderListState({ page: Math.min(totalPages, page + 1) })
        }
        onPrev={() => patchOrderListState({ page: Math.max(1, page - 1) })}
        page={page}
        totalPages={totalPages}
      />

      <OrderDetailDialog
        onOpenChange={(open) => {
          if (!open) {
            setSelectedOrderId(null);
          }
        }}
        selectedOrderId={selectedOrderId}
      />
    </div>
  );
}
