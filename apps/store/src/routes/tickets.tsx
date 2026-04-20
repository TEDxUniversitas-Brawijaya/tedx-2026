import { createFileRoute } from "@tanstack/react-router";

import { cn } from "@tedx-2026/ui/lib/utils";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "motion/react";
import { useRef, useState } from "react";
import { TicketHeroStorySection } from "../features/tickets/components/ticket-hero-story-section";
import { TicketProductsContainer } from "../features/tickets/containers/ticket-products-container";
import { useTicketCheckoutStore } from "../features/tickets/stores/use-ticket-checkout-store";
import type { TicketTab } from "../features/tickets/types/ticket";
import { Footer } from "../shared/components/footer";
import { Navbar } from "../shared/components/navbar";

import "@/features/tickets/styles/product-section.css";
import { TicketCheckoutModal } from "../features/tickets/components/checkout";

export const Route = createFileRoute("/tickets")({
  component: RouteComponent,
});

function RouteComponent() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const { activeTab, setActiveTab } = useTicketCheckoutStore();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isAtEnd, setIsAtEnd] = useState(false);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    // Lock the grid scroll once we reach the "good view"
    const isDone = v >= 0.85;
    if (isDone !== isAtEnd) {
      setIsAtEnd(isDone);
    }
  });

  const opacity = useTransform(scrollYProgress, (v: number) => {
    const clamped = Math.max(0, Math.min(1, v));
    if (clamped <= 0.7) {
      return 0;
    }
    if (clamped >= 0.85) {
      return 1;
    }
    return (clamped - 0.7) / 0.15;
  });

  const translateY = useTransform(scrollYProgress, (v: number) => {
    const clamped = Math.max(0, Math.min(1, v));
    if (clamped <= 0.7) {
      return "100vh";
    }

    const finalOffset = 0;
    if (clamped >= 0.85) {
      return `${finalOffset}vh`;
    }

    const t = (clamped - 0.7) / 0.15;
    return `${(100 - finalOffset) * (1 - t) + finalOffset}vh`;
  });

  return (
    <main>
      <Navbar />
      <div
        className="relative h-[550vh]"
        id="ticket-master-wrapper"
        ref={containerRef}
      >
        <div className="sticky top-0 h-dvh w-full overflow-hidden bg-neutral-950">
          <div className="absolute inset-0 z-10">
            <TicketHeroStorySection scrollProgress={scrollYProgress} />
          </div>

          <div className="absolute inset-0 z-50">
            <motion.div
              className="product-section-wrapper"
              id="ticket-product-section"
              ref={sectionRef}
              style={{ opacity }}
            >
              <motion.div
                className={cn(
                  "product-section-container",
                  isAtEnd && "is-scrollable"
                )}
                style={{ y: translateY }}
              >
                <div className="product-section-content">
                  <div className="product-section-header">
                    <h2 className="product-section-title">
                      Dapatkan tiket-mu di sini dan ambil bagian untuk
                      menciptakan ruang bertumbuh kita bersama.
                    </h2>

                    <div className="product-section-tabs-container">
                      <div className="product-section-tabs-wrapper">
                        <TabButton
                          activeTab={activeTab}
                          label="Regular"
                          setActiveTab={setActiveTab}
                          tab="regular"
                        />
                        <TabButton
                          activeTab={activeTab}
                          label="Bundling"
                          setActiveTab={setActiveTab}
                          tab="bundling"
                        />
                      </div>
                    </div>
                  </div>

                  <div
                    className="product-section-grid"
                    id={
                      activeTab === "regular"
                        ? "ticket-regular"
                        : "ticket-bundling"
                    }
                  >
                    <TicketProductsContainer />
                  </div>
                </div>
              </motion.div>

              <TicketCheckoutModal />
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}

const TabButton = ({
  tab,
  label,
  activeTab,
  setActiveTab,
}: {
  tab: TicketTab;
  label: string;
  activeTab: TicketTab;
  setActiveTab: (tab: TicketTab) => void;
}) => (
  <button
    className={cn("product-tab-button", activeTab === tab && "active")}
    id={`ticket-tab-${tab}`}
    onClick={() => setActiveTab(tab)}
    type="button"
  >
    {label}
  </button>
);
