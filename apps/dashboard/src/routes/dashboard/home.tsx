import { DashboardSkeleton } from "@/features/dashboard/components/dashboard-skeleton";
import { MerchProductsTable } from "@/features/dashboard/components/merch-products-table";
import { PendingActionsSection } from "@/features/dashboard/components/pending-actions-section";
import { TicketProductsTable } from "@/features/dashboard/components/ticket-products-table";
import { trpc } from "@/shared/lib/trpc";
import { IconRefresh } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@tedx-2026/ui/components/alert";
import { Button } from "@tedx-2026/ui/components/button";
import { cn } from "@tedx-2026/ui/lib/utils";

export const Route = createFileRoute("/dashboard/home")({
  component: RouteComponent,
});

function RouteComponent() {
  const dashboardQuery = useQuery(
    trpc.admin.analytics.dashboard.queryOptions({})
  );

  const handleRefresh = () => {
    dashboardQuery.refetch();
  };

  if (dashboardQuery.isLoading) {
    return <DashboardSkeleton />;
  }

  if (dashboardQuery.error || !dashboardQuery.data) {
    return (
      <div className="p-4 lg:p-6">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {dashboardQuery.error?.message ?? "Failed to load dashboard data."}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const {
    pendingVerificationsCount,
    refundRequestedCount,
    ticketProducts,
    merchProducts,
  } = dashboardQuery.data;

  return (
    <div className="flex flex-col gap-6 p-4 lg:p-6">
      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-lg md:text-xl">Dashboard</h1>
        <Button
          disabled={dashboardQuery.isFetching}
          onClick={handleRefresh}
          size="sm"
          variant="outline"
        >
          <IconRefresh
            className={cn(
              "size-4",
              dashboardQuery.isFetching && "animate-spin"
            )}
          />
          Refresh
        </Button>
      </div>

      <PendingActionsSection
        pendingVerificationsCount={pendingVerificationsCount}
        refundRequestedCount={refundRequestedCount}
      />

      <TicketProductsTable products={ticketProducts} />

      <MerchProductsTable products={merchProducts} />
    </div>
  );
}
