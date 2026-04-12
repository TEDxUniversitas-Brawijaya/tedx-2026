import type { CategorySectionViewProps } from "../types/merch-view";
import { BottomNav } from "./category-section/bottom-nav";
import { CategorySlide } from "./category-section/category-slide";
import { Header } from "./category-section/header";
import { NavArrow } from "./category-section/nav-arrow";

const CategorySection = ({
  activeIndex,
  categories,
  logo,
  loopCategories,
  onCategoryClick,
  onNext,
  onPrev,
  onScroll,
  scrollRef,
}: CategorySectionViewProps) => {
  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-[#F2F2F2]">
      <Header logo={logo} />

      <div className="relative">
        <NavArrow direction="left" onClick={onPrev} />
        <NavArrow direction="right" onClick={onNext} />

        <div
          className="scrollbar-hide flex snap-x snap-mandatory overflow-x-auto overflow-y-hidden"
          onScroll={onScroll}
          ref={scrollRef}
        >
          {loopCategories.map((cat, index) => (
            <CategorySlide
              category={cat}
              index={index}
              key={`${cat.id}-${index}`}
              logo={logo}
            />
          ))}
        </div>
      </div>

      <BottomNav
        activeIndex={activeIndex}
        categories={categories}
        onCategoryClick={onCategoryClick}
      />
    </section>
  );
};

export default CategorySection;
