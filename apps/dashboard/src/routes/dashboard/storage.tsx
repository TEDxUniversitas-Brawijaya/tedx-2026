import { StorageUploadButton } from "@/features/storage/components/storage-upload-button";
import { StorageTableContainer } from "@/features/storage/containers/storage-table-container";
import { canAccess, RESOURCES } from "@/shared/lib/permissions";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/storage")({
  component: RouteComponent,
  beforeLoad: ({ context }) => {
    const { user } = context;

    if (!canAccess(user.role, RESOURCES.STORAGE)) {
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
        <h1 className="font-semibold text-lg md:text-xl">Storage & CDN</h1>
        <StorageUploadButton />
      </div>

      <StorageTableContainer />
    </div>
  );
}
