import { Button } from "@tedx-2026/ui/components/button";

type RefundSuccessStateProps = {
  onClose: () => void;
};

export function RefundSuccessState({ onClose }: RefundSuccessStateProps) {
  return (
    <div className="flex min-h-105 flex-col items-center justify-center text-center">
      <p className="text-7xl leading-none">
        <svg
          aria-label="Success Icon"
          fill="none"
          height="45"
          role="img"
          viewBox="0 0 75 55"
          width="65"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M32.8462 55.0003L0 26.2309C1.19658 24.3506 2.39316 22.4702 3.58974 20.5899C12.5641 28.6241 21.5385 36.6583 30.5128 44.6925L69.8291 0L74.188 5.47L32.8462 55.0003Z"
            fill="white"
          />
        </svg>
      </p>

      <h2 className="mt-8 font-serif-2 text-[26px] text-white/50 leading-[0.8]">
        REFUND DIPROSES
      </h2>

      <p className="mt-6 max-w-sm font-sans-2 text-gray-300 text-sm italic">
        Silahkan cek email yang kamu gunakan secara berkala untuk update info
        pembatalan ya! Jika mengalami kendala silahkan hubungi instagram kami.
      </p>

      <Button
        className="mt-8 w-full rounded-lg"
        onClick={onClose}
        variant="store-primary"
      >
        Tutup
      </Button>
    </div>
  );
}
