import chandelier from "@/assets/imgs/chandelier-1.png";
import textureBlack from "@/assets/imgs/texture-black.png";
import { Button } from "@tedx-2026/ui/components/button";

type RefundSuccessStateProps = {
  onClose: () => void;
};

export function RefundSuccessState({ onClose }: RefundSuccessStateProps) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4 sm:p-6">
      <div className="relative w-full max-w-107.5 overflow-clip rounded-3xl border border-white/10 bg-[#262626]/90 p-6 text-white shadow-[0_0_65px_rgba(255,149,0,0.25)] backdrop-blur-sm sm:p-7">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: `url(${textureBlack})`,
            backgroundPosition: "center",
            backgroundRepeat: "repeat",
            backgroundSize: "cover",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,102,20,0.08)_5%,rgba(0,0,0,0.95)_70%)]"
        />

        <img
          alt="chandelier"
          aria-hidden
          className="pointer-events-none absolute -top-14 -right-16 w-48 opacity-25"
          height={256}
          src={chandelier}
          width={256}
        />

        <div className="relative z-2 flex min-h-105 flex-col items-center justify-center text-center">
          <p className="text-7xl leading-none">
            <svg
              fill="none"
              height="45"
              viewBox="0 0 75 55"
              width="65"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>checklist</title>
              <path
                d="M25.8875 54.6135L0 28.726L6.47188 22.2542L25.8875 41.6698L67.5573 0L74.0292 6.47188L25.8875 54.6135Z"
                fill="white"
              />
            </svg>
          </p>
          <h1 className="mt-8 font-serif-2 text-xl leading-none">
            Terima Kasih
          </h1>
          <p className="mt-5 max-w-70 font-medium font-sans-2 text-gray-200 text-xs leading-relaxed">
            Pengajuan pengembalian dana kamu sedang kami proses. Silakan
            menunggu informasi selanjutnya melalui email
            TEDxUniversitasBrawijaya.
          </p>
          <Button
            className="mt-8 w-full rounded-lg"
            onClick={onClose}
            type="button"
            variant="store-primary"
          >
            Tutup
          </Button>
        </div>
      </div>
    </div>
  );
}
