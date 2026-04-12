import { OrderFilters } from "./order-filters";
import type { ListOrder } from "../types/order";
import { OrdersTable } from "./orders-table";
import { PaginationControls } from "./pagination-controls";
import type { ReactNode } from "react";

type OrderManagementProps = {
  currentPage: number;
  onNext: () => void;
  onPrev: () => void;
  orders: ListOrder[];
  renderState?: ReactNode;
  totalPages: number;
};

export function OrderManagement({
  currentPage,
  onNext,
  onPrev,
  orders,
  renderState,
  totalPages,
}: OrderManagementProps) {
  return (
    <div className="space-y-4" id="order-management">
      <OrderFilters />

      {renderState ?? <OrdersTable orders={orders} />}

      <PaginationControls
        currentPage={currentPage}
        onNext={onNext}
        onPrev={onPrev}
        totalPages={totalPages}
      />
    </div>
  );
}
