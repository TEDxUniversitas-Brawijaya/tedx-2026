import { StorageUploadButton } from "@/features/storage/components/storage-upload-button";
import { StorageTableContainer } from "@/features/storage/containers/storage-table-container";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/storage")({
  component: RouteComponent,
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
