import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@tedx-2026/ui/components/dialog";

const SkeletonLine = ({ className }: { className: string }) => (
  <div className={`animate-pulse rounded-md bg-white/20 ${className}`} />
);

export function RefundRequestFormSkeleton() {
  return (
    <>
      <DialogHeader className="relative z-2 pr-2 sm:pr-10">
        <DialogTitle className="font-serif-2 text-2xl leading-none">
          Form Refund
        </DialogTitle>
        <DialogDescription className="mt-3 font-medium font-sans-2 text-gray-300 text-xs italic">
          Silakan isi data pada formulir di bawah ini dengan benar. Pastikan
          semua informasi sesuai dengan data awal yang kamu gunakan saat
          melakukan pembelian tiket.
        </DialogDescription>
      </DialogHeader>

      <div className="relative z-2 mt-5 space-y-4">
        {/* Alasan Pembatalan */}
        <div className="space-y-2">
          <SkeletonLine className="h-5 w-32" />
          <SkeletonLine className="min-h-22.5 w-full" />
        </div>

        {/* Metode Pembayaran */}
        <div className="space-y-2">
          <SkeletonLine className="h-5 w-40" />
          <SkeletonLine className="h-9 w-full" />
        </div>

        {/* Nama Bank */}
        <div className="space-y-2">
          <SkeletonLine className="h-5 w-24" />
          <SkeletonLine className="h-9 w-full" />
        </div>

        {/* Rekening & Pemilik */}
        <div className="space-y-2">
          <SkeletonLine className="h-5 w-44" />
          <SkeletonLine className="h-9 w-full" />
        </div>
        <div className="space-y-2">
          <SkeletonLine className="h-5 w-40" />
          <SkeletonLine className="h-9 w-full" />
        </div>

        {/* Buttons */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <SkeletonLine className="h-10 w-full" />
          <SkeletonLine className="h-10 w-full" />
        </div>
      </div>
    </>
  );
}
