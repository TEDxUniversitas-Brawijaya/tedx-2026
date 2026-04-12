import { motion, useReducedMotion } from "framer-motion";

type BottomNavProps = {
  categories: Array<{ id: string; title: string }>;
  activeIndex: number;
};

export const BottomNav = ({ categories, activeIndex }: BottomNavProps) => {
  const shouldReduceMotion = useReducedMotion();

  const renderTrackItems = (track: "primary" | "secondary") =>
    categories.map((cat, categoryIndex) => {
      const isActive = categoryIndex === activeIndex;

      return (
        <div
          aria-current={isActive ? "true" : undefined}
          className="flex items-center gap-3 md:gap-4"
          key={`${track}-${cat.id}`}
        >
          <span className="font-light font-sans-2 text-lg text-white md:text-2xl">
            →
          </span>
          <span className="whitespace-nowrap font-medium font-sans-2 text-base text-white tracking-tight md:text-2xl lg:text-3xl">
            {cat.title}
          </span>
        </div>
      );
    });

  return (
    <div className="pointer-events-none absolute right-0 bottom-0 left-0 z-20 h-14 overflow-hidden bg-black backdrop-blur-sm md:h-20">
      <div className="relative h-full w-full">
        <motion.div
          animate={shouldReduceMotion ? { x: 0 } : { x: ["0%", "-100%"] }}
          className="absolute top-0 left-0 flex h-full w-max shrink-0 items-center gap-12 pr-12 pl-4 md:gap-20 md:pr-20 md:pl-8 lg:gap-24 lg:pr-24"
          transition={
            shouldReduceMotion
              ? undefined
              : {
                  duration: 36,
                  ease: "linear",
                  repeat: Number.POSITIVE_INFINITY,
                }
          }
        >
          {renderTrackItems("primary")}
        </motion.div>

        <motion.div
          animate={shouldReduceMotion ? { x: 0 } : { x: ["100%", "0%"] }}
          aria-hidden="true"
          className="absolute top-0 left-0 flex h-full w-max shrink-0 items-center gap-12 pr-12 pl-4 md:gap-20 md:pr-20 md:pl-8 lg:gap-24 lg:pr-24"
          transition={
            shouldReduceMotion
              ? undefined
              : {
                  duration: 36,
                  ease: "linear",
                  repeat: Number.POSITIVE_INFINITY,
                }
          }
        >
          {renderTrackItems("secondary")}
        </motion.div>
      </div>
    </div>
  );
};
