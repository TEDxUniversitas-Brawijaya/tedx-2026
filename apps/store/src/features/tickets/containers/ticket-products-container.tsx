import { trpc } from "@/shared/lib/trpc";
import { useQuery } from "@tanstack/react-query";
import { TicketProductCard } from "../components/ticket-product-card";
import { useTicketCheckoutStore } from "../stores/use-ticket-checkout-store";

export const TicketProductsContainer = () => {
  const { activeTab } = useTicketCheckoutStore();
  const { data, isLoading, isError } = useQuery(
    trpc.ticket.listProducts.queryOptions({})
  );

  if (isLoading) {
    // TODO: Add skeleton loader here
    return null;
  }

  if (isError || !data) {
    return (
      <section className="px-5 py-16 md:px-16">
        <p className="text-center font-sans-2 text-white">
          Gagal memuat produk. Coba refresh halaman.
        </p>
      </section>
    );
  }

  const activeProducts =
    activeTab === "regular"
      ? data.filter((p) => p.type === "ticket_regular")
      : data.filter((p) => p.type === "ticket_bundle");

  return activeProducts.map((product) => (
    <TicketProductCard key={product.id} product={product} />
  ));
};
