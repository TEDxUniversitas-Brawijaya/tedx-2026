import CategorySection from "../components/category-section";
import Hero from "../components/hero";
import ProductListSection from "../components/product-list-section";
import { getRouteApi } from "@tanstack/react-router";
import { useMerchProductsQuery } from "../hooks/use-merch-products-query";

const routeApi = getRouteApi("/merchandise");

const MerchContainer = () => {
  const { filter = "" } = routeApi.useSearch();
  const { data: merchs = [], isLoading, isError } = useMerchProductsQuery();

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#FF1818] border-t-transparent" />
      </main>
    );
  }

  if (isError) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white text-[#FF1818]">
        Failed to load products. Please try again.
      </main>
    );
  }

  return (
    <main className="">
      <Hero />
      <CategorySection />
      <ProductListSection filter={filter} merchs={merchs} />
      {/* Temporary spacer to allow scroll testing */}
    </main>
  );
};

export default MerchContainer;
