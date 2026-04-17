import { useRef } from "react";
import { useScroll } from "motion/react";
import { TicketHeroStorySection } from "./ticket-hero-story-section";
import { TicketProductsContainer } from "../containers/ticket-products-container";

export const TicketsHero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <div
      className="relative h-[500vh]"
      id="ticket-master-wrapper"
      ref={containerRef}
    >
      <div className="sticky top-0 h-dvh w-full overflow-hidden bg-neutral-950">
        <div className="absolute inset-0 z-10">
          <TicketHeroStorySection scrollProgress={scrollYProgress} />
        </div>

        <div className="absolute inset-0 z-50">
          <TicketProductsContainer scrollProgress={scrollYProgress} />
        </div>
      </div>
    </div>
  );
};
