import { trpc } from "@/shared/lib/trpc";
import { useQuery } from "@tanstack/react-query";
import { ProductListFilter } from "../components/product-list-filter";

export const ProductListFilterContainer = () => {
  const { data, isLoading, isError } = useQuery(
    trpc.merch.listProducts.queryOptions({})
  );

  if (isLoading) {
    return null;
  }

  if (isError) {
    return (
      <div className="col-span-full h-fit rounded-2xl border border-[#CACACA]/60 bg-white p-8 text-center">
        <p className="font-sans-2 text-base text-neutral-700 sm:text-lg">
          Gagal memuat produk. Coba refresh halaman.
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="col-span-full h-fit rounded-2xl border border-[#CACACA]/60 bg-white p-8 text-center">
        <p className="font-sans-2 text-base text-neutral-700 sm:text-lg">
          Gagal memuat produk. Coba refresh halaman.
        </p>
      </div>
    );
  }

  return <ProductListFilter products={data} />;
};
