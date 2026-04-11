import { OrderManagement } from "@/features/order/components/order-management";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/orders")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-col gap-4 p-4 lg:p-6">
      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-lg md:text-xl">Order Management</h1>
      </div>
      <OrderManagement />
    </div>
  );
}
