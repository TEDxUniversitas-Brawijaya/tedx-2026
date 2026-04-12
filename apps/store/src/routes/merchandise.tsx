import Logo from "../../public/x.png";
import CategorySection from "@/features/merchandise/components/category-section";
import Hero from "@/features/merchandise/components/hero";
import HeroImage from "@/features/merchandise/components/hero-image";
import { ProductListSectionContainer } from "@/features/merchandise/container/product-list-section-container";
import { createFileRoute } from "@tanstack/react-router";
import { useIsMobile } from "@tedx-2026/ui/hooks/use-is-mobile";
import { useMemo, useRef, useSyncExternalStore } from "react";
import {
  CATEGORIES,
  LOOP_CATEGORIES,
  useCategoryScroll,
} from "@/features/merchandise/hooks/use-category-scroll";
import { useMerchScroll } from "@/features/merchandise/hooks/use-merch-scroll";
import { z } from "zod";

const desktopPoints = [-0.08, 0, 0.1, 0.22, 0.4, 0.65, 1, 1.4] as const;

const heroImages = [
  "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=800",
];

const noopUnsubscribe = () => undefined;

const subscribeToViewportChange = (onStoreChange: () => void) => {
  if (typeof window === "undefined") {
    return noopUnsubscribe;
  }

  window.addEventListener("scroll", onStoreChange, { passive: true });
  window.addEventListener("resize", onStoreChange);

  return () => {
    window.removeEventListener("scroll", onStoreChange);
    window.removeEventListener("resize", onStoreChange);
  };
};

const getViewportAnchorSnapshot = () => {
  if (typeof window === "undefined") {
    return 0;
  }

  return window.scrollY + window.innerHeight * 0.35;
};

const getViewportAnchorServerSnapshot = () => 0;

const merchSearchSchema = z.object({
  filter: z.string().optional(),
});

function MerchPage() {
  const categorySectionRef = useRef<HTMLDivElement | null>(null);
  const productSectionRef = useRef<HTMLDivElement | null>(null);
  const isMobile = useIsMobile();
  const viewportAnchor = useSyncExternalStore(
    subscribeToViewportChange,
    getViewportAnchorSnapshot,
    getViewportAnchorServerSnapshot
  );
  const { globalProgress: rawProgress } = useMerchScroll(
    isMobile ? 0.003 : 0.001
  );
  const {
    scrollRef,
    activeIndex,
    handleScroll,
    scrollPrev,
    scrollNext,
    scrollToIndex,
  } = useCategoryScroll();

  const showFloatingCheckout = (() => {
    if (typeof window === "undefined") {
      return false;
    }

    const categoryRect = categorySectionRef.current?.getBoundingClientRect();
    if (!categoryRect) {
      return false;
    }

    const productRect = productSectionRef.current?.getBoundingClientRect();
    if (!productRect) {
      return false;
    }

    const activationLine = viewportAnchor - window.scrollY;
    const hasReachedCategorySection = categoryRect.top <= activationLine;
    const isBeforeProductSectionEnd = productRect.bottom >= activationLine;

    return hasReachedCategorySection && isBeforeProductSectionEnd;
  })();

  const cards = useMemo(() => {
    const viewportWidth =
      typeof window !== "undefined" ? window.innerWidth : 1920;

    const activePoints = isMobile
      ? ([-0.8, 0, 0.8, 1.6, 2.4, 3.2, 4] as const)
      : desktopPoints;

    const cardCount = isMobile ? 6 : 7;
    const pointsCount = activePoints.length;
    const globalProgress = rawProgress % cardCount;

    return Array.from({ length: cardCount })
      .map((_, index) => {
        const itemProgress =
          (index + globalProgress + cardCount * 2) % cardCount;
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

        if (x + width < -100 || x > viewportWidth + 100) {
          return null;
        }

        return {
          id: index,
          imageUrl: heroImages[index % heroImages.length] ?? "",
          width,
          x,
          zIndex: Math.floor(itemProgress * 10),
        };
      })
      .filter((card): card is NonNullable<typeof card> => card !== null);
  }, [isMobile, rawProgress]);

  return (
    <main>
      <Hero heroImage={<HeroImage cards={cards} />} />
      <div ref={categorySectionRef}>
        <CategorySection
          activeIndex={activeIndex}
          categories={CATEGORIES}
          logo={Logo}
          loopCategories={LOOP_CATEGORIES}
          onCategoryClick={scrollToIndex}
          onNext={scrollNext}
          onPrev={scrollPrev}
          onScroll={handleScroll}
          scrollRef={scrollRef}
        />
      </div>
      <div ref={productSectionRef}>
        <ProductListSectionContainer
          showFloatingCheckout={showFloatingCheckout}
        />
      </div>
    </main>
  );
}

export const Route = createFileRoute("/merchandise")({
  validateSearch: (search) => merchSearchSchema.parse(search),
  component: MerchPage,
});
