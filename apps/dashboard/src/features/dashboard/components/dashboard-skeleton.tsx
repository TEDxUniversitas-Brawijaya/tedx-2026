import { Skeleton } from "@tedx-2026/ui/components/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-6 p-4 lg:p-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-7 w-32" />
        <Skeleton className="h-8 w-24" />
      </div>

      <div className="flex flex-col gap-3">
        <Skeleton className="h-5 w-36" />
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Skeleton className="h-5 w-36" />
        <Skeleton className="h-40 rounded-xl" />
      </div>

      <div className="flex flex-col gap-3">
        <Skeleton className="h-5 w-36" />
        <Skeleton className="h-40 rounded-xl" />
      </div>
    </div>
  );
}
