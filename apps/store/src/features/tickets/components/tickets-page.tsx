import { useRef } from "react";
import { useScroll } from "framer-motion";
import { TicketHeroStorySection } from "./ticket-hero-story-section";
import { TicketCheckoutContainer } from "../containers/ticket-checkout-container";
import { TicketOrderDetailContainer } from "../containers/ticket-order-detail-container";
import { TicketProductsContainer } from "../containers/ticket-products-container";

export const TicketsPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <main className="relative">
      {/* Master Sticky Wrapper */}
      <div
        className="relative h-[500vh]"
        id="ticket-master-wrapper"
        ref={containerRef}
      >
        <div className="sticky top-0 h-dvh w-full overflow-hidden bg-neutral-950">
          {/* Layer 1: Hero Story */}
          <div className="absolute inset-0 z-10">
            <TicketHeroStorySection scrollProgress={scrollYProgress} />
          </div>

          {/* Layer 2: Products List */}
          <div className="absolute inset-0 z-50">
            <TicketProductsContainer scrollProgress={scrollYProgress} />
          </div>
        </div>
      </div>

      {/* Portals & Dialogs */}
      <TicketCheckoutContainer />
      <TicketOrderDetailContainer />
    </main>
  );
};
