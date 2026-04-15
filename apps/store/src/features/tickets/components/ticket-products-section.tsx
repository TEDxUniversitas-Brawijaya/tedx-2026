import { cn } from "@tedx-2026/ui/lib/utils";
import { useTicketCheckoutStore } from "../stores/use-ticket-checkout-store";
import type { TicketProduct, TicketTab } from "../types/ticket";
import { TicketProductCard } from "./ticket-product-card";

type TicketProductsSectionProps = {
  products: TicketProduct[];
};

export const TicketProductsSection = ({
  products,
}: TicketProductsSectionProps) => {
  const { activeTab, setActiveTab } = useTicketCheckoutStore();

  return (
    <section
      className="bg-black/50 px-5 py-16 md:px-16"
      id="ticket-product-section"
    >
      <div className="mx-auto w-full max-w-6xl rounded-3xl border border-border bg-card text-card-foreground shadow-2xl">
        <div className="max-h-[86vh] overflow-y-auto px-5 py-8 md:px-10 md:py-10">
          <h2 className="mx-auto max-w-4xl text-center font-serif-2 text-2xl text-white-2 leading-tight md:text-4xl">
            Dapatkan tiket-mu di sini dan ambil bagian untuk menciptakan ruang
            bertumbuh kita bersama.
          </h2>

          <div className="mt-8 flex justify-center">
            <div className="inline-flex rounded-full bg-secondary p-1.5">
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
            className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3"
            id={activeTab === "regular" ? "ticket-regular" : "ticket-bundling"}
          >
            {products.map((product) => (
              <TicketProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </section>
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
    className={cn(
      "rounded-full px-6 py-2.5 font-sans-2 text-sm transition-all md:text-base",
      activeTab === tab
        ? "bg-foreground text-background shadow-md"
        : "text-muted-foreground hover:text-card-foreground"
    )}
    id={`ticket-tab-${tab}`}
    onClick={() => setActiveTab(tab)}
    type="button"
  >
    {label}
  </button>
);
