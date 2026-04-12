import Logo from "@/assets/imgs/x.png";
import CategorySection from "../components/category-section";
import Hero from "../components/hero";
import HeroImage from "../components/hero-image";
import { ProductListSectionContainer } from "./product-list-section-container";
import { useRef, useSyncExternalStore } from "react";
import {
  CATEGORIES,
  LOOP_CATEGORIES,
  useCategoryScroll,
} from "../hooks/use-category-scroll";

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

export const MerchPageContainer = () => {
  const categorySectionRef = useRef<HTMLDivElement | null>(null);
  const productSectionRef = useRef<HTMLDivElement | null>(null);
  const viewportAnchor = useSyncExternalStore(
    subscribeToViewportChange,
    getViewportAnchorSnapshot,
    getViewportAnchorServerSnapshot
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

  return (
    <main>
      <Hero heroImage={<HeroImage />} />
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
};
