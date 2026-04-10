"use client";
import { useMemo } from "react";
import { useMerchScroll } from "../hooks/use-merch-scroll";
import { useIsMobile } from "../../../../../../packages/ui/src/hooks/use-is-mobile";

/**
 * DETROIT PARIS REPLICA (RESPONSIVE VERSION)
 * 1. Infinite Virtual Scroll (via useMerchScroll hook)
 * 2. Slot-based Slot System: Responsive cards count.
 * 3. Gapless Logic: Iterative width calculation.
 */

const POINTS_DESKTOP = [-0.08, 0, 0.1, 0.22, 0.4, 0.65, 1.0, 1.4];

const IMAGES = [
  "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=800",
];

const HeroImage = () => {
  const isMobile = useIsMobile();

  // Speed it up a bit on mobile for responsiveness
  const { globalProgress: rawProgress } = useMerchScroll(
    isMobile ? 0.003 : 0.001
  );

  const cards = useMemo(() => {
    const screenWidth =
      typeof window !== "undefined" ? window.innerWidth : 1920;

    /**
     * Mobile: Equal slots (e.g., 60% width each)
     * Desktop: Dynamic slots (Detroit style)
     */
    const activePoints = isMobile
      ? [-0.8, 0, 0.8, 1.6, 2.4, 3.2, 4.0] // Constant 0.8 distance for larger uniform size
      : POINTS_DESKTOP;

    const cardCount = isMobile ? 6 : 7;
    const pointsCount = activePoints.length;

    // Normalizing progress to the current count
    const globalProgress = rawProgress % cardCount;

    return Array.from({ length: cardCount })
      .map((_, i) => {
        // Calculate progress for each item
        const itemProgress = (i + globalProgress + cardCount * 2) % cardCount;
        const baseIdx = Math.floor(itemProgress);
        const nextIdx = (baseIdx + 1) % pointsCount;
        const subProgress = itemProgress % 1;

        // Current X position
        const x =
          (activePoints[baseIdx] ?? 0) * screenWidth +
          ((activePoints[nextIdx] ?? 0) * screenWidth -
            (activePoints[baseIdx] ?? 0) * screenWidth) *
            subProgress;

        // Next item's position to maintain gapless connection
        const nextItemProgress =
          (i + 1 + globalProgress + cardCount * 2) % cardCount;
        const nBaseIdx = Math.floor(nextItemProgress);
        const nNextIdx = (nBaseIdx + 1) % pointsCount;
        const nSubProgress = nextItemProgress % 1;
        const nextX =
          (activePoints[nBaseIdx] ?? 0) * screenWidth +
          ((activePoints[nNextIdx] ?? 0) * screenWidth -
            (activePoints[nBaseIdx] ?? 0) * screenWidth) *
            nSubProgress;

        // Seamless wrap-around width calculation
        let w = nextX - x;
        if (nextX < x) {
          w =
            (activePoints[pointsCount - 1] ?? 0) * screenWidth -
            x +
            (nextX - (activePoints[0] ?? 0) * screenWidth);
        }

        // Add gap for mobile
        if (isMobile) {
          w -= 16; // 16px gap
        }

        // Performance: hide if completely off-screen
        if (x + w < -100 || x > screenWidth + 100) {
          return null;
        }

        return {
          id: i,
          x,
          w,
          zIndex: Math.floor(itemProgress * 10),
          img: IMAGES[i % IMAGES.length],
        };
      })
      .filter((card): card is NonNullable<typeof card> => card !== null);
  }, [rawProgress, isMobile]);

  return (
    <div className="pointer-events-none absolute inset-0 flex h-screen w-full items-end overflow-hidden bg-transparent">
      <div className="relative mb-[-20px] h-3/4 w-full">
        {cards.map((card) => (
          <div
            className="absolute bottom-0 left-0 aspect-square overflow-hidden shadow-[0_45px_1000px_-30px_rgba(0,0,0,0.6)]"
            key={card.id}
            style={{
              width: `${card.w + 1}px`,
              transform: `translate3d(${card.x}px, 0, 0)`,
              transformOrigin: "left bottom",
              zIndex: card.zIndex,
              willChange: "transform",
            }}
          >
            <img
              alt="Merchandise product displaying local culture"
              className="h-full w-full object-cover"
              height={800}
              src={card.img}
              width={800}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeroImage;
