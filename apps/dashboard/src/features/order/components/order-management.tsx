import { OrderFilters } from "./order-filters";
import type { ListOrder, OrderListState } from "../types/order";
import { OrdersTable } from "./orders-table";
import { PaginationControls } from "./pagination-controls";
import type { ReactNode } from "react";

type OrderManagementProps = {
  currentPage: number;
  onNext: () => void;
  onPatch: (patch: Partial<OrderListState>) => void;
  onPrev: () => void;
  orders: ListOrder[];
  renderState?: ReactNode;
  state: OrderListState;
  totalPages: number;
};

export function OrderManagement({
  currentPage,
  onNext,
  onPatch,
  onPrev,
  orders,
  renderState,
  state,
  totalPages,
}: OrderManagementProps) {
  const { page } = state;

  return (
    <div className="space-y-4" id="order-management">
      <OrderFilters onPatch={onPatch} state={state} />

      {renderState ?? <OrdersTable orders={orders} />}

      <PaginationControls
        currentPage={currentPage}
        onNext={onNext}
        onPrev={onPrev}
        page={page}
        totalPages={totalPages}
      />
    </div>
  );
}
