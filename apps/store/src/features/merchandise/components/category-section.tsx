import {
  CATEGORIES,
  LOOP_CATEGORIES,
  useCategoryScroll,
} from "../hooks/use-category-scroll";
import Logo from "../../../../public/x.png";
import { BottomNav } from "./category-section/bottom-nav";
import { CategorySlide } from "./category-section/category-slide";
import { Header } from "./category-section/header";
import { NavArrow } from "./category-section/nav-arrow";

const CategorySection = () => {
  const {
    scrollRef,
    activeIndex,
    handleScroll,
    scrollPrev,
    scrollNext,
    scrollToIndex,
  } = useCategoryScroll();

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-[#F2F2F2]">
      <Header logo={Logo} />

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
              logo={Logo}
            />
          ))}
        </div>
      </div>

      <BottomNav
        activeIndex={activeIndex}
        categories={CATEGORIES}
        onCategoryClick={scrollToIndex}
      />
    </section>
  );
};

export default CategorySection;
