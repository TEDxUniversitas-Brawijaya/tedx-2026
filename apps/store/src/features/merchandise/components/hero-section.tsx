import { useIsMobile } from "@tedx-2026/ui/hooks/use-is-mobile";
import { useMemo } from "react";
import { useMerchScroll } from "../hooks/use-merch-scroll";

const heroImages = [
  "https://cdn.tedxuniversitasbrawijaya.com/merchandise/keychain/keychain-v1.png",
  "https://cdn.tedxuniversitasbrawijaya.com/merchandise/workshirt/workshirt-2.png",
  "https://cdn.tedxuniversitasbrawijaya.com/merchandise/socks/sock-3.png",
  "https://cdn.tedxuniversitasbrawijaya.com/merchandise/hat/topi-2.png",
  "https://cdn.tedxuniversitasbrawijaya.com/merchandise/t-shirt/tshirt-1.png",
  "https://cdn.tedxuniversitasbrawijaya.com/merchandise/stickers/sticker-1.png",
];

export const HeroSection = () => {
  const isMobile = useIsMobile();
  const { globalProgress: rawProgress } = useMerchScroll(
    isMobile ? 0.003 : 0.001
  );

  const cards = useMemo(() => {
    const viewportWidth =
      typeof window !== "undefined" ? window.innerWidth : 1920;

    const activePoints = isMobile
      ? ([-0.8, 0, 0.8, 1.6, 2.4, 3.2, 4] as const)
      : ([-0.08, 0, 0.1, 0.22, 0.4, 0.65, 1] as const);

    const cardCount = 6;
    const pointsCount = activePoints.length;
    const globalProgress = rawProgress % cardCount;

    return Array.from({ length: cardCount }).map((_, index) => {
      const itemProgress = (index + globalProgress + cardCount * 2) % cardCount;
      const baseIndex = Math.floor(itemProgress);
      const nextIndex = (baseIndex + 1) % pointsCount;
      const subProgress = itemProgress % 1;

      const x =
        (activePoints[baseIndex] ?? 0) * viewportWidth +
        ((activePoints[nextIndex] ?? 0) * viewportWidth -
          (activePoints[baseIndex] ?? 0) * viewportWidth) *
          subProgress;

      const nextItemProgress =
        (index + 1 + globalProgress + cardCount * 2) % cardCount;
      const nextBaseIndex = Math.floor(nextItemProgress);
      const nextPointIndex = (nextBaseIndex + 1) % pointsCount;
      const nextSubProgress = nextItemProgress % 1;

      const nextX =
        (activePoints[nextBaseIndex] ?? 0) * viewportWidth +
        ((activePoints[nextPointIndex] ?? 0) * viewportWidth -
          (activePoints[nextBaseIndex] ?? 0) * viewportWidth) *
          nextSubProgress;

      let width = nextX - x;
      if (nextX < x) {
        width =
          (activePoints[pointsCount - 1] ?? 0) * viewportWidth -
          x +
          (nextX - (activePoints[0] ?? 0) * viewportWidth);
      }

      if (isMobile) {
        width -= 16;
      }

      const isVisible = !(x + width < -100 || x > viewportWidth + 100);

      return {
        id: index,
        imageUrl: heroImages[index % heroImages.length],
        isVisible,
        width: Math.max(width, 1),
        x,
        zIndex: Math.floor(itemProgress * 10),
      };
    });
  }, [isMobile, rawProgress]);

  return (
    <section className="relative h-[300dvh]">
      <div className="sticky top-0 left-0 h-dvh w-full overflow-hidden bg-white py-24">
        <div className="container mx-auto px-4 md:max-w-2xl lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl">
          <div className="font-extrabold font-sans-2 text-6xl text-black md:text-8xl">
            <h1>TEDXUB</h1>
            <h2>MERCH</h2>
          </div>
          <p className="w-2/3 font-sans-2 text-black text-xs md:text-base lg:w-1/4">
            Lengkapi jejak ceritamu sebagai bagian dari ruang bertumbuh bersama
            TEDxUniversitas Brawijaya 2026.
          </p>
        </div>
        <div className="pointer-events-none absolute inset-0 flex h-screen w-full items-end overflow-hidden bg-transparent">
          <div className="relative -mb-5 h-3/4 w-full">
            {cards.map((card) => (
              <div
                className="absolute bottom-0 left-0 aspect-square overflow-hidden shadow-[0_16px_40px_-24px_rgba(0,0,0,0.35)]"
                key={card.id}
                style={{
                  backfaceVisibility: "hidden",
                  contain: "paint",
                  opacity: card.isVisible ? 1 : 0,
                  width: `${card.width + 1}px`,
                  transform: `translate3d(${card.x}px, 0, 0)`,
                  transformOrigin: "left bottom",
                  visibility: card.isVisible ? "visible" : "hidden",
                  zIndex: card.zIndex,
                  willChange: "transform",
                }}
              >
                <img
                  alt={`Merchandise product displaying ${card.id}`}
                  className="h-full w-full object-cover text-black"
                  decoding="async"
                  draggable={false}
                  height={800}
                  loading="eager"
                  src={card.imageUrl}
                  width={800}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
