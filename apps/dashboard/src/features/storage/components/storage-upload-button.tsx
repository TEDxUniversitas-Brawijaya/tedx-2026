import { queryClient } from "@/shared/lib/query-client";
import { trpc } from "@/shared/lib/trpc";
import { IconCloudUpload } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@tedx-2026/ui/components/button";
import { useRef } from "react";
import { toast } from "sonner";

export function StorageUploadButton() {
  const uploadFileMutation = useMutation(
    trpc.fileRouter.uploadFile.mutationOptions()
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    uploadFileMutation.mutate(formData, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.fileRouter.getAllFiles.queryKey(),
        });
      },
      onError: (error) => {
        toast.error("Failed to upload file", {
          description: error.message,
        });
      },
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div>
      <input
        className="hidden"
        onChange={handleUpload}
        ref={fileInputRef}
        type="file"
      />
      <Button
        disabled={uploadFileMutation.isPending}
        onClick={() => fileInputRef.current?.click()}
      >
        <IconCloudUpload />
        {uploadFileMutation.isPending ? "Uploading..." : "Upload File"}
      </Button>
    </div>
  );
}
