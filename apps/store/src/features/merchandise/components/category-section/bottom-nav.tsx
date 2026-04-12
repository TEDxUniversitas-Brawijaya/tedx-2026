type BottomNavProps = {
  categories: Array<{ id: string; title: string }>;
  activeIndex: number;
  onCategoryClick: (index: number) => void;
};

export const BottomNav = ({
  categories,
  activeIndex,
  onCategoryClick,
}: BottomNavProps) => {
  return (
    <div className="absolute right-0 bottom-0 left-0 z-20 h-14 bg-black backdrop-blur-sm md:h-20">
      <div className="scrollbar-hide flex h-full items-center gap-6 overflow-x-auto px-4 md:justify-center md:gap-12 md:px-8 lg:gap-16">
        {categories.map((cat, index) => {
          const isActive = index === activeIndex;

          return (
            <button
              className={`group flex items-center gap-2 transition-all hover:opacity-80 md:gap-3 ${
                isActive ? "opacity-100" : "opacity-40"
              }`}
              key={`nav-${cat.id}`}
              onClick={() => onCategoryClick(index)}
              type="button"
            >
              <span className="font-light font-sans-2 text-[#ffffff] text-lg transition-transform group-hover:translate-x-1 md:text-2xl">
                →
              </span>
              <span className="whitespace-nowrap font-medium font-sans-2 text-[#ffffff] text-base tracking-tight md:text-2xl lg:text-3xl">
                {cat.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
