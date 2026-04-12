import Logo from "../../../../public/x.png";
import CategorySection from "../components/category-section";
import Hero from "../components/hero";
import HeroImage from "../components/hero-image";
import { getRouteApi } from "@tanstack/react-router";
import { useIsMobile } from "@tedx-2026/ui/hooks/use-is-mobile";
import { useMemo, useState } from "react";
import { CheckoutModalContainer } from "./checkout-modal-container";
import {
  CATEGORIES,
  LOOP_CATEGORIES,
  useCategoryScroll,
} from "../hooks/use-category-scroll";
import { useMerchScroll } from "../hooks/use-merch-scroll";
import { useMerchProductsQuery } from "../hooks/use-merch-products-query";
import { useCartStore } from "../store/cart-store";
import {
  isMerchFilter,
  type MerchFilter,
  type MerchFilterCounts,
} from "../types/merch-view";
import ProductListSection from "../components/product-list-section";

const desktopPoints = [-0.08, 0, 0.1, 0.22, 0.4, 0.65, 1, 1.4] as const;

const heroImages = [
  "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=800",
];

const baseCounts: MerchFilterCounts = {
  "t-shirt": 0,
  workshirt: 0,
  stickers: 0,
  socks: 0,
  keychain: 0,
  hat: 0,
  bundling: 0,
};

const routeApi = getRouteApi("/merchandise");

const MerchContainer = () => {
  const navigate = routeApi.useNavigate();
  const { filter = "" } = routeApi.useSearch();
  const { data: merchs = [], isLoading, isError } = useMerchProductsQuery();
  const { openSelection } = useCartStore();
  const [showMenu, setShowMenu] = useState(false);
  const isMobile = useIsMobile();
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

  const normalizedFilter: MerchFilter = isMerchFilter(filter) ? filter : "";

  const counts = useMemo(() => {
    const nextCounts = { ...baseCounts };

    for (const merch of merchs) {
      if (merch.type === "merch_bundle") {
        nextCounts.bundling += 1;
        continue;
      }

      if (merch.type === "merch_regular" && merch.category) {
        nextCounts[merch.category] += 1;
      }
    }

    return nextCounts;
  }, [merchs]);

  const filteredMerchs = useMemo(() => {
    if (normalizedFilter === "") {
      return merchs;
    }

    if (normalizedFilter === "bundling") {
      return merchs.filter((merch) => merch.type === "merch_bundle");
    }

    return merchs.filter(
      (merch) =>
        merch.type === "merch_regular" && merch.category === normalizedFilter
    );
  }, [merchs, normalizedFilter]);

  const activeFilterLabel =
    normalizedFilter === "" ? "SEMUA" : normalizedFilter.toUpperCase();

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

  const handleSelectFilter = (nextFilter: MerchFilter) => {
    navigate({
      replace: true,
      search: (previous) => {
        if (nextFilter === "") {
          const { filter: _removedFilter, ...restSearch } = previous;
          return restSearch;
        }

        return {
          ...previous,
          filter: nextFilter,
        };
      },
    });
  };

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#FF1818] border-t-transparent" />
      </main>
    );
  }

  if (isError) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white text-[#FF1818]">
        Failed to load products. Please try again.
      </main>
    );
  }

  return (
    <main className="">
      <Hero heroImage={<HeroImage cards={cards} />} />
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
      <ProductListSection
        activeFilterLabel={activeFilterLabel}
        checkoutModal={<CheckoutModalContainer />}
        counts={counts}
        filter={normalizedFilter}
        filteredMerchs={filteredMerchs}
        merchs={merchs}
        onAddProduct={openSelection}
        onMenuOpenChange={setShowMenu}
        onSelectFilter={handleSelectFilter}
        showMenu={showMenu}
      />
    </main>
  );
};

export default MerchContainer;
