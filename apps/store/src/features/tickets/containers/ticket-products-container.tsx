import type { MotionValue } from "motion/react";
import { trpc } from "@/shared/lib/trpc";
import { useQuery } from "@tanstack/react-query";
import { TicketProductsSection } from "../components/ticket-products-section";
import { useTicketCheckoutStore } from "../stores/use-ticket-checkout-store";
import type { TicketProduct } from "../types/ticket";

const isRegularTicket = (product: TicketProduct) =>
  product.type === "ticket_regular";
const isBundlingTicket = (product: TicketProduct) =>
  product.type === "ticket_bundle";

export const TicketProductsContainer = ({
  scrollProgress,
}: {
  scrollProgress: MotionValue<number>;
}) => {
  const { activeTab } = useTicketCheckoutStore();
  const { data, isLoading, isError } = useQuery(
    trpc.ticket.listProducts.queryOptions({})
  );

  if (isLoading) {
    return <div className="bg-transparent" />;
  }

  if (isError || !data) {
    return (
      <section className="bg-transparent px-5 py-16 md:px-16">
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
      products={activeProducts}
      scrollProgress={scrollProgress}
    />
  );
};
