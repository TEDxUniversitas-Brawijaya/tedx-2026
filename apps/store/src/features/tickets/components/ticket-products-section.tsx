import {
  motion,
  useTransform,
  useMotionValueEvent,
  type MotionValue,
} from "motion/react";
import { useRef, useState } from "react";
import { cn } from "@tedx-2026/ui/lib/utils";
import { useTicketCheckoutStore } from "../stores/use-ticket-checkout-store";
import type { TicketProduct, TicketTab } from "../types/ticket";
import { TicketProductCard } from "./ticket-product-card";
import "../styles/product-section.css";

type TicketProductsSectionProps = {
  products: TicketProduct[];
  scrollProgress: MotionValue<number>;
};

export const TicketProductsSection = ({
  products,
  scrollProgress,
}: TicketProductsSectionProps) => {
  const { activeTab, setActiveTab } = useTicketCheckoutStore();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isAtEnd, setIsAtEnd] = useState(false);

  useMotionValueEvent(scrollProgress, "change", (v) => {
    // We use 0.9 as the threshold to ensure the section is locked
    // before the user reaches the footer.
    const isDone = v >= 0.9;
    if (isDone !== isAtEnd) {
      setIsAtEnd(isDone);
    }
  });

  const opacity = useTransform(scrollProgress, (v: number) => {
    const clamped = Math.max(0, Math.min(1, v));
    if (clamped <= 0.8) {
      return 0;
    }
    if (clamped >= 0.9) {
      return 1;
    }
    return (clamped - 0.8) / 0.1;
  });

  const translateY = useTransform(scrollProgress, (v: number) => {
    const clamped = Math.max(0, Math.min(1, v));
    if (clamped <= 0.8) {
      return "100vh";
    }

    const finalOffset = 0;
    if (clamped >= 0.9) {
      return `${finalOffset}vh`;
    }

    const t = (clamped - 0.8) / 0.1;
    return `${(100 - finalOffset) * (1 - t) + finalOffset}vh`;
  });

  return (
    <motion.div
      className="product-section-wrapper"
      id="ticket-product-section"
      ref={sectionRef}
      style={{ opacity }}
    >
      <motion.div
        className={cn("product-section-container", isAtEnd && "is-scrollable")}
        style={{ y: translateY }}
      >
        <div className="product-section-content">
          <h2 className="product-section-title">
            Dapatkan tiket-mu di sini dan ambil bagian untuk menciptakan ruang
            bertumbuh kita bersama.
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

          <div
            className="product-section-grid"
            id={activeTab === "regular" ? "ticket-regular" : "ticket-bundling"}
          >
            {products.map((product) => (
              <TicketProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

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
