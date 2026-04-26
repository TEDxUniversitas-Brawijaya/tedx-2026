import { IconCamera, IconCameraOff, IconQrcode } from "@tabler/icons-react";
import { Button } from "@tedx-2026/ui/components/button";
import { Input } from "@tedx-2026/ui/components/input";
import jsQR from "jsqr";
import { useEffect, useRef, useState } from "react";

type QrScannerProps = {
  disabled: boolean;
  onDetect: (qrCode: string) => void;
};

export function QrScanner({ disabled, onDetect }: QrScannerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const lastDetectedRef = useRef("");
  const [error, setError] = useState<string | null>(null);
  const [manualCode, setManualCode] = useState("");
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    if (!scanning) {
      return;
    }

    let cancelled = false;
    let timeoutId: number | null = null;

    const start = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }

        const scan = () => {
          const video = videoRef.current;
          const canvas = canvasRef.current;
          const context = canvas?.getContext("2d", {
            willReadFrequently: true,
          });

          if (cancelled || !video || !canvas || !context) {
            return;
          }

          try {
            if (
              video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA &&
              video.videoWidth > 0 &&
              video.videoHeight > 0
            ) {
              canvas.width = video.videoWidth;
              canvas.height = video.videoHeight;
              context.drawImage(video, 0, 0, canvas.width, canvas.height);

              const imageData = context.getImageData(
                0,
                0,
                canvas.width,
                canvas.height
              );
              const code = jsQR(
                imageData.data,
                imageData.width,
                imageData.height,
                {
                  inversionAttempts: "dontInvert",
                }
              );
              const rawValue = code?.data.trim();

              if (rawValue && rawValue !== lastDetectedRef.current) {
                lastDetectedRef.current = rawValue;
                onDetect(rawValue);
                setScanning(false);
              }
            }
          } catch {
            setError("Unable to read QR code from the camera feed.");
          }

          timeoutId = window.setTimeout(scan, 250);
        };

        scan();
      } catch {
        setError("Camera permission is unavailable.");
        setScanning(false);
      }
    };

    start();

    return () => {
      cancelled = true;
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
      for (const track of streamRef.current?.getTracks() ?? []) {
        track.stop();
      }
      streamRef.current = null;
    };
  }, [onDetect, scanning]);

  useEffect(() => {
    if (disabled && scanning) {
      setScanning(false);
    }
  }, [disabled, scanning]);

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
              onChange={(event) => setManualCode(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && manualCode.trim()) {
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
        <video
          className="h-full w-full object-cover"
          muted
          playsInline
          ref={videoRef}
        />
        <canvas className="hidden" ref={canvasRef} />
      </div>
    </div>
  );
}
