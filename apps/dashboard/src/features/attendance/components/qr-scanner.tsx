import { IconCamera, IconCameraOff, IconQrcode } from "@tabler/icons-react";
import { Button } from "@tedx-2026/ui/components/button";
import { Input } from "@tedx-2026/ui/components/input";
import { Scanner, type IDetectedBarcode } from "@yudiel/react-qr-scanner";
import { useState } from "react";

type QrScannerProps = {
  disabled: boolean;
  onDetect: (qrCode: string) => void;
};

export function QrScanner({ disabled, onDetect }: QrScannerProps) {
  const [error, setError] = useState<string | null>(null);
  const [manualCode, setManualCode] = useState("");
  const [scanning, setScanning] = useState(disabled);

  const handleScan = (detectedCodes: IDetectedBarcode[]) => {
    const rawValue = detectedCodes[0]?.rawValue.trim();

    if (rawValue) {
      onDetect(rawValue);
    }
  };

  return (
    <div
      className="grid gap-4 rounded-xl border bg-card p-4 lg:grid-cols-[minmax(0,1fr)_18rem]"
      id="attendance-scanner"
    >
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-semibold text-base">QR Check-In</h2>
            <p className="text-muted-foreground text-sm">
              Scan a ticket QR or enter its code manually.
            </p>
          </div>
          <Button
            disabled={disabled}
            onClick={() => {
              setError(null);
              setScanning((value) => !value);
            }}
            variant={scanning ? "outline" : "default"}
          >
            {scanning ? <IconCameraOff /> : <IconCamera />}
            {scanning ? "Stop Camera" : "Start Camera"}
          </Button>
        </div>

        {error && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-destructive text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-2">
          <div className="relative flex-1">
            <IconQrcode className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9"
              disabled={disabled}
              onChange={(event) => setManualCode(event.target.value)}
              onKeyDown={(event) => {
                if (!disabled && event.key === "Enter" && manualCode.trim()) {
                  onDetect(manualCode.trim());
                  setManualCode("");
                }
              }}
              placeholder="Paste QR code"
              value={manualCode}
            />
          </div>
          <Button
            disabled={disabled || !manualCode.trim()}
            onClick={() => {
              onDetect(manualCode.trim());
              setManualCode("");
            }}
          >
            Check In
          </Button>
        </div>
      </div>

      <div className="aspect-video overflow-hidden rounded-lg bg-muted lg:aspect-square">
        {scanning ? (
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
              setScanning(false);
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
    </div>
  );
}
