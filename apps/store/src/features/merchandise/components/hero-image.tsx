import { useIsMobile } from "@tedx-2026/ui/hooks/use-is-mobile";
import { useMemo } from "react";
import { useMerchScroll } from "../hooks/use-merch-scroll";

const desktopPoints = [-0.08, 0, 0.1, 0.22, 0.4, 0.65, 1, 1.4] as const;

const heroImages = [
  "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=800",
];

const FALLBACK_HERO_IMAGE =
  "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=800";

const HeroImage = () => {
  const isMobile = useIsMobile();
  const { globalProgress: rawProgress } = useMerchScroll(
    isMobile ? 0.003 : 0.001
  );

  const cards = useMemo(() => {
    const viewportWidth =
      typeof window !== "undefined" ? window.innerWidth : 1920;

    const activePoints = isMobile
      ? ([-0.8, 0, 0.8, 1.6, 2.4, 3.2, 4] as const)
      : desktopPoints;

    const cardCount = isMobile ? 6 : 7;
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
        imageUrl: heroImages[index % heroImages.length] ?? FALLBACK_HERO_IMAGE,
        isVisible,
        width: Math.max(width, 1),
        x,
        zIndex: Math.floor(itemProgress * 10),
      };
    });
  }, [isMobile, rawProgress]);

  return (
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
              alt="Merchandise product displaying local culture"
              className="h-full w-full object-cover"
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
  );
};

export default HeroImage;
