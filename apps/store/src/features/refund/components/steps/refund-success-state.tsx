import { Button } from "@tedx-2026/ui/components/button";

type RefundSuccessStateProps = {
  onClose: () => void;
};

export function RefundSuccessState({ onClose }: RefundSuccessStateProps) {
  return (
    <div className="flex min-h-110 flex-col items-center justify-center space-y-9 text-center">
      <p className="text-7xl leading-none">
        <svg
          fill="none"
          height="55"
          viewBox="0 0 75 55"
          width="75"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>checklist</title>
          <path
            d="M25.8875 54.6135L0 28.726L6.47188 22.2542L25.8875 41.6698L67.5573 0L74.0292 6.47188L25.8875 54.6135Z"
            fill="white"
          />
        </svg>
      </p>

      <h2 className="font-serif-2 text-[26px] text-white leading-[0.8]">
        Terima Kasih
      </h2>

      <p className="max-w-sm font-sans-2 text-gray-300 text-sm italic">
        Pengajuan pengembalian dana kamu sedang kami proses. Silakan menunggu
        informasi selanjutnya melalui email TEDxUniversitasBrawijaya.
      </p>

      <Button
        className="w-full rounded-lg"
        onClick={onClose}
        variant="store-primary"
      >
        Tutup
      </Button>
    </div>
  );
}
