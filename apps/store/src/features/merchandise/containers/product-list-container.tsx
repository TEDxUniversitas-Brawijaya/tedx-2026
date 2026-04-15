import { trpc } from "@/shared/lib/trpc";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { ProductCard } from "../components/product-card";

export const ProductListContainer = () => {
  const navigate = useNavigate();
  const { filter } = useSearch({
    from: "/merchandise",
  });
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

  if (data.length === 0) {
    return (
      <div className="col-span-full h-fit rounded-2xl border border-[#CACACA]/60 bg-white p-8 text-center">
        <p className="font-sans-2 text-base text-neutral-700 sm:text-lg">
          Tidak ada produk untuk filter ini.
        </p>
        <button
          className="mt-4 cursor-pointer font-sans-2 text-red-2 text-sm underline"
          onClick={() => {
            navigate({
              from: "/merchandise",
              search: (prev) => ({
                ...prev,
                filter: undefined,
              }),
              replace: true,
              resetScroll: false,
            });
          }}
          type="button"
        >
          Tampilkan semua produk
        </button>
      </div>
    );
  }

  const filteredData = data.filter((product) => {
    // If filter is undefined, show first category by default
    if (filter === undefined && product.type === "merch_regular") {
      const firstCategory = data.find((p) => p.category !== null)?.category;
      return product.category === firstCategory;
    }

    if (filter === "bundling") {
      return product.type === "merch_bundle";
    }

    return product.type === "merch_regular" && product.category === filter;
  });

  return filteredData.map((merch) => (
    <ProductCard key={merch.id} product={merch} />
  ));
};
