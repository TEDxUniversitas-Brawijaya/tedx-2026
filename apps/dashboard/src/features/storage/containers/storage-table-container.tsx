import { trpc } from "@/shared/lib/trpc";
import { useQuery } from "@tanstack/react-query";
import { StorageTable } from "../components/storage-table";

export function StorageTableContainer() {
  const filesQuery = useQuery(trpc.file.getAllFiles.queryOptions());

  if (filesQuery.isLoading) {
    return <div>Loading...</div>;
  }

  if (filesQuery.error) {
    return <div>Error: {filesQuery.error.message}</div>;
  }

  if (!filesQuery.data) {
    return <div>No files found.</div>;
  }

  return <StorageTable files={filesQuery.data} />;
}
