type CategorySlideProps = {
  category: {
    id: string;
    title: string;
    next: string;
  };
  logo: string;
  index: number;
};

export const CategorySlide = ({
  category,
  logo,
  index,
}: CategorySlideProps) => {
  return (
    <div
      className="relative h-screen w-full shrink-0 snap-center px-4 py-12 md:px-0"
      key={`${category.id}-${index}`}
    >
      {/* Card Content Container */}
      <div className="relative mx-auto flex h-full max-w-xs flex-col justify-between md:max-w-2xl lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl">
        {/* Center Content Placeholder */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Product Placeholder Image */}
          <div className="relative h-[60%] w-full max-w-sm md:max-w-xl">
            <div className="flex h-full w-full items-center justify-center opacity-10">
              <img
                alt={category.title}
                className="h-full w-full object-contain grayscale"
                height={500}
                src={logo}
                width={500}
              />
            </div>

            {/* Overlay Title */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <button
                className="group/title flex w-full flex-col items-center gap-4 outline-none"
                type="button"
              >
                <div className="w-full border border-white/20 bg-[#3C3C3C]/30 px-4 py-3 backdrop-blur-xl transition-all duration-300 group-hover/title:bg-[#DC2625]/50 md:px-8 md:py-4">
                  <h4 className="font-extrabold font-sans-2 text-3xl text-[#ffffff] transition-colors duration-300 md:text-8xl lg:text-8xl">
                    {category.title}
                  </h4>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Hinge/Bridge Peek - Horizontal label between sections */}
        <div className="pointer-events-none absolute top-1/2 -right-6 z-10 translate-x-1/2 -translate-y-1/2 md:-right-40">
          <span className="whitespace-nowrap font-extrabold font-sans-2 text-2xl text-[#757575] opacity-10 md:text-8xl md:opacity-20">
            {category.next}
          </span>
        </div>

        {/* Empty space for bottom bar padding */}
        <div className="h-32" />
      </div>
    </div>
  );
};
