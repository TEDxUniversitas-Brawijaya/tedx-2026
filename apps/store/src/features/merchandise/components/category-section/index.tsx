import {
  LOOP_CATEGORIES,
  useCategoryScroll,
} from "../../hooks/use-category-scroll";
import { BottomNav } from "./bottom-nav";
import { CategorySlide } from "./category-slide";
import { Header } from "./header";
import { NavArrow } from "./nav-arrow";

export const CategorySection = () => {
  const { scrollRef, activeIndex, handleScroll, scrollPrev, scrollNext } =
    useCategoryScroll();

  return (
    <section className="relative min-h-dvh w-full overflow-hidden bg-[#F2F2F2]">
      <Header />

      <div className="relative">
        <NavArrow direction="left" onClick={scrollPrev} />
        <NavArrow direction="right" onClick={scrollNext} />

        <div
          className="scrollbar-hide flex snap-x snap-mandatory overflow-x-auto overflow-y-hidden"
          onScroll={handleScroll}
          ref={scrollRef}
        >
          {LOOP_CATEGORIES.map((cat, index) => (
            <CategorySlide
              category={cat}
              index={index}
              key={`${cat.id}-${index}`}
            />
          ))}
        </div>
      </div>

      <BottomNav activeIndex={activeIndex} />
    </section>
  );
};
