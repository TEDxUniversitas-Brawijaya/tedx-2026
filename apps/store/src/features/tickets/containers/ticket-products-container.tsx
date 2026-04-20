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
      ? data
          .filter((p) => p.type === "ticket_regular")
          // Hacky way to sort "Main Event" to the end of the list without hardcoding IDs or anything
          .sort(
            (a, b) =>
              b.name.length - a.name.length || a.name.localeCompare(b.name)
          )
      : data
          .filter((p) => p.type === "ticket_bundle")
          // Sort bundles by name because the current naming convention uses Bundling <number>
          .sort((a, b) => a.name.localeCompare(b.name));

  return activeProducts.map((product) => (
    <TicketProductCard key={product.id} product={product} />
  ));
};
