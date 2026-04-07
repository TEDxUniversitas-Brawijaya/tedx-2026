import { useCopyToClipboard } from "@/shared/hooks/use-copy-to-clipboard";
import { queryClient } from "@/shared/lib/query-client";
import { trpc } from "@/shared/lib/trpc";
import {
  IconCopy,
  IconCopyCheck,
  IconDownload,
  IconExternalLink,
  IconTrash,
} from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@tedx-2026/ui/components/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@tedx-2026/ui/components/table";

function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) {
    return "0 Bytes";
  }
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Number.parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
}

type FileData = {
  key: string;
  url: string;
  size: number;
  uploadedAt: Date;
};

type StorageTableProps = {
  files: FileData[];
};

export function StorageTable({ files }: StorageTableProps) {
  const [copiedText, copyToClipboard] = useCopyToClipboard();
  const deleteFileMutation = useMutation(
    trpc.fileRouter.deleteFile.mutationOptions()
  );

  const handleDownload = async (url: string, filename: string) => {
    const response = await fetch(url);
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = objectUrl;
    a.download = filename.split("/").pop() || "download";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(objectUrl);
  };

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Key</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Uploaded At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.length === 0 && (
            <TableRow>
              <TableCell className="h-24 text-center" colSpan={4}>
                No files found.
              </TableCell>
            </TableRow>
          )}
          {files.map((file) => (
            <TableRow key={file.key}>
              <TableCell
                className="max-w-50 truncate font-medium"
                title={file.key}
              >
                {file.key}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatBytes(file.size)}
              </TableCell>
              <TableCell className="whitespace-nowrap text-muted-foreground">
                {file.uploadedAt
                  ? new Intl.DateTimeFormat("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }).format(new Date(file.uploadedAt))
                  : "-"}
              </TableCell>
              <TableCell className="space-x-2 whitespace-nowrap text-right">
                <Button
                  onClick={() => copyToClipboard(file.url)}
                  size="icon-sm"
                  title="Copy URL"
                  variant="outline"
                >
                  {copiedText === file.url ? <IconCopyCheck /> : <IconCopy />}
                </Button>
                <Button
                  onClick={() => window.open(file.url, "_blank")}
                  size="icon-sm"
                  title="Preview"
                  variant="outline"
                >
                  <IconExternalLink />
                </Button>
                <Button
                  onClick={() => handleDownload(file.url, file.key)}
                  size="icon-sm"
                  title="Download"
                  variant="outline"
                >
                  <IconDownload />
                </Button>
                <Button
                  disabled={deleteFileMutation.isPending}
                  onClick={() => {
                    deleteFileMutation.mutate([file.key], {
                      onSuccess: () => {
                        queryClient.invalidateQueries({
                          queryKey: trpc.fileRouter.getAllFiles.queryKey(),
                        });
                      },
                    });
                  }}
                  size="icon-sm"
                  title="Delete"
                  variant="destructive"
                >
                  <IconTrash />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
