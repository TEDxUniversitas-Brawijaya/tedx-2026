import { AttendanceFilters } from "@/features/attendance/components/attendance-filters";
import { AttendanceTableContainer } from "@/features/attendance/containers/attendance-table-container";
import { canAccess, RESOURCES } from "@/shared/lib/permissions";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/attendance")({
  component: RouteComponent,
  beforeLoad: ({ context }) => {
    const { user } = context;

    if (!canAccess(user.role, RESOURCES.ATTENDANCE)) {
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
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-semibold text-lg md:text-xl">
            Attendance Management
          </h1>
          <p className="text-muted-foreground text-sm">
            Event-day check-in queue control.
          </p>
        </div>
      </div>

      <AttendanceFilters />
      <AttendanceTableContainer />
    </div>
  );
}
