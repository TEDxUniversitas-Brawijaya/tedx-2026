// Products container: fetches ticket products and maps tab selection to section props.
import { trpc } from "@/shared/lib/trpc";
import { useQuery } from "@tanstack/react-query";
import { TicketProductsSection } from "../components/ticket-products-section";
import { useTicketCheckoutStore } from "../stores/use-ticket-checkout-store";
import type { TicketProduct } from "../types/ticket";

const isRegularTicket = (product: TicketProduct) =>
  product.type === "ticket_regular";
const isBundlingTicket = (product: TicketProduct) =>
  product.type === "ticket_bundle";

export const TicketProductsContainer = () => {
  const { activeTab, setActiveTab, openCheckout } = useTicketCheckoutStore();
  const { data, isLoading, isError } = useQuery(
    trpc.ticket.listProducts.queryOptions({})
  );

  if (isLoading) {
    return (
      <section className="px-5 py-16 md:px-16">
        <p className="font-sans-2 text-neutral-600">Memuat tiket...</p>
      </section>
    );
  }

  if (isError || !data) {
    return (
      <section className="px-5 py-16 md:px-16">
        <p className="font-sans-2 text-neutral-600">Gagal memuat tiket.</p>
      </section>
    );
  }

  const regularProducts = data.filter(isRegularTicket);
  const bundlingProducts = data.filter(isBundlingTicket);
  const activeProducts =
    activeTab === "regular" ? regularProducts : bundlingProducts;

  return (
    <TicketProductsSection
      activeTab={activeTab}
      onSelectProduct={openCheckout}
      onTabChange={setActiveTab}
      products={activeProducts}
    />
  );
};
