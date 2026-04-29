import { queryClient } from "@/shared/lib/query-client";
import { trpc } from "@/shared/lib/trpc";
import { IconCamera, IconCameraOff, IconQrcode } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@tedx-2026/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@tedx-2026/ui/components/dialog";
import { Scanner, type IDetectedBarcode } from "@yudiel/react-qr-scanner";
import { useState } from "react";
import { toast } from "sonner";

export function QrScanner() {
  const [error, setError] = useState<string | null>(null);
  const [hasCameraAccess, setHasCameraAccess] = useState(false);

  const checkInMutation = useMutation(
    trpc.admin.attendance.checkIn.mutationOptions()
  );

  const handleScan = (detectedCodes: IDetectedBarcode[]) => {
    const rawValue = detectedCodes[0]?.rawValue.trim();

    if (!rawValue) {
      return;
    }

    checkInMutation.mutate(
      { qrCode: rawValue },
      {
        onError: (error) => {
          toast.error(error.message);
        },
        onSuccess: (ticket) => {
          queryClient.invalidateQueries({
            queryKey: trpc.admin.attendance.list.queryKey(),
          });
          toast.success(`${ticket.buyerName} checked in`);
        },
      }
    );
  };

  return (
    <Dialog>
      <DialogTrigger render={<Button />}>
        <IconQrcode />
        Open QR Scanner
      </DialogTrigger>
      <DialogContent>
        <div className="space-y-4" id="attendance-scanner">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold text-base">QR Check-In</h2>
              <p className="text-muted-foreground text-sm">Scan a ticket QR.</p>
            </div>

            {error && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-destructive text-sm">
                {error}
              </div>
            )}
          </div>

          <div className="aspect-video overflow-hidden rounded-lg bg-muted lg:aspect-square">
            {hasCameraAccess ? (
              <Scanner
                allowMultiple={false}
                classNames={{
                  container: "h-full w-full",
                  video: "h-full w-full object-cover",
                }}
                components={{
                  finder: true,
                  onOff: false,
                  torch: false,
                  zoom: false,
                }}
                constraints={{ facingMode: "environment" }}
                formats={["qr_code"]}
                onError={() => {
                  setError("Camera permission is unavailable.");
                  setHasCameraAccess(false);
                }}
                onScan={handleScan}
                scanDelay={250}
                sound={false}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-muted-foreground text-sm">
                Camera is off
              </div>
            )}
          </div>

          <Button
            className="w-full"
            onClick={async () => {
              const res = await navigator.permissions.query({ name: "camera" });
              if (res.state === "prompt") {
                setError("Camera permission is required to scan QR codes.");
                setHasCameraAccess(false);
              } else if (res.state === "denied") {
                setError(
                  "Camera permission is denied. Please enable it in your browser settings."
                );
                setHasCameraAccess(false);
              } else {
                setError(null);
                setHasCameraAccess(true);
              }
            }}
            variant={hasCameraAccess ? "outline" : "default"}
          >
            {hasCameraAccess ? <IconCameraOff /> : <IconCamera />}
            {hasCameraAccess ? "Stop Camera" : "Start Camera"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
