import { MerchPickupFilters } from "@/features/merch-pickup/components/merch-pickup-filters";
import { MerchPickupTableContainer } from "@/features/merch-pickup/containers/merch-pickup-table-container";
import { canAccess, RESOURCES } from "@/shared/lib/permissions";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/merch-pickup")({
  component: RouteComponent,
  beforeLoad: ({ context }) => {
    const { user } = context;

    if (!canAccess(user.role, RESOURCES.MERCH_PICKUP)) {
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
      <div>
        <h1 className="font-semibold text-lg md:text-xl">Merch Pickup</h1>
        <p className="text-muted-foreground text-sm">
          Mark paid merch orders as picked up.
        </p>
      </div>
      <div className="space-y-4">
        <MerchPickupFilters />
        <MerchPickupTableContainer />
      </div>
    </div>
  );
}
