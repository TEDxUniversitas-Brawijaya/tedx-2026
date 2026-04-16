import chandelier from "@/assets/imgs/chandelier-1.png";
import textureBlack from "@/assets/imgs/texture-black.png";

const SkeletonLine = ({ className }: { className: string }) => (
  <div className={`animate-pulse rounded-md bg-white/20 ${className}`} />
);

export function RefundRequestFormSkeleton() {
  return (
    <section className="relative min-h-screen overflow-hidden px-4 py-36 sm:px-6 lg:px-8">
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

      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-4xl items-center justify-center">
        <div className="relative w-full max-w-107.5 overflow-clip rounded-3xl border border-white/10 bg-[#262626]/90 p-6 text-white shadow-[0_0_65px_rgba(255,149,0,0.25)] backdrop-blur-sm sm:p-7">
          <img
            alt="chandelier"
            aria-hidden
            className="pointer-events-none absolute -top-14 -right-18 w-56 opacity-25"
            height={256}
            src={chandelier}
            width={256}
          />

          <header className="relative z-2 pr-2 sm:pr-10">
            <SkeletonLine className="h-7 w-40" />
            <SkeletonLine className="mt-3 h-3 w-full" />
            <SkeletonLine className="mt-2 h-3 w-[90%]" />
            <SkeletonLine className="mt-2 h-3 w-[72%]" />
          </header>

          <div className="relative z-2 mt-5 space-y-4">
            <div className="space-y-2">
              <SkeletonLine className="h-4 w-36" />
              <SkeletonLine className="h-22.5 w-full rounded-lg" />
            </div>

            <div className="space-y-2">
              <SkeletonLine className="h-4 w-32" />
              <SkeletonLine className="h-9 w-full rounded-lg" />
            </div>

            <div className="space-y-2">
              <SkeletonLine className="h-4 w-32" />
              <SkeletonLine className="h-9 w-full rounded-lg" />
            </div>

            <div className="space-y-2">
              <SkeletonLine className="h-4 w-44" />
              <SkeletonLine className="h-9 w-full rounded-lg" />
            </div>

            <div className="space-y-2">
              <SkeletonLine className="h-4 w-44" />
              <SkeletonLine className="h-9 w-full rounded-lg" />
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <SkeletonLine className="h-10 w-full rounded-lg" />
              <SkeletonLine className="h-10 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
