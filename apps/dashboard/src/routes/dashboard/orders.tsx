import { OrderFilters } from "@/features/order/components/order-filters";
import { OrdersTableContainer } from "@/features/order/containers/orders-table-container";
import { canAccess, RESOURCES } from "@/shared/lib/permissions";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/orders")({
  component: RouteComponent,
  beforeLoad: ({ context }) => {
    const { user } = context;

    if (!canAccess(user.role, RESOURCES.ORDER)) {
      redirect({
        to: "/dashboard/home",
        throw: true,
      });
    }
  },
});

function RouteComponent() {
  return (
    <div className="flex flex-col gap-4 p-4 lg:p-6">
      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-lg md:text-xl">Order Management</h1>
      </div>

      <div className="space-y-4">
        <OrderFilters />
        <OrdersTableContainer />
      </div>
    </div>
  );
}
