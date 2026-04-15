// Product section dialog shell: centers header/tabs and renders scrollable ticket cards.
import { cn } from "@tedx-2026/ui/lib/utils";
import type { TicketProduct, TicketTab } from "../types/ticket";
import { TicketProductCard } from "./ticket-product-card";

type TicketProductsSectionProps = {
  activeTab: TicketTab;
  onTabChange: (tab: TicketTab) => void;
  products: TicketProduct[];
  onSelectProduct: (product: TicketProduct) => void;
};

export const TicketProductsSection = ({
  activeTab,
  onTabChange,
  products,
  onSelectProduct,
}: TicketProductsSectionProps) => {
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
              <button
                className={cn(
                  "rounded-full px-6 py-2.5 font-sans-2 text-sm transition-all md:text-base",
                  activeTab === "regular"
                    ? "bg-foreground text-background shadow-md"
                    : "text-muted-foreground hover:text-card-foreground"
                )}
                id="ticket-tab-regular"
                onClick={() => onTabChange("regular")}
                type="button"
              >
                Regular
              </button>
              <button
                className={cn(
                  "rounded-full px-6 py-2.5 font-sans-2 text-sm transition-all md:text-base",
                  activeTab === "bundling"
                    ? "bg-foreground text-background shadow-md"
                    : "text-muted-foreground hover:text-card-foreground"
                )}
                id="ticket-tab-bundling"
                onClick={() => onTabChange("bundling")}
                type="button"
              >
                Bundling
              </button>
            </div>
          </div>

          <div
            className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3"
            id={activeTab === "regular" ? "ticket-regular" : "ticket-bundling"}
          >
            {products.map((product) => (
              <TicketProductCard
                key={product.id}
                onSelect={onSelectProduct}
                product={product}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
