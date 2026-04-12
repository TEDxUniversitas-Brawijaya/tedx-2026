const CatalogX = "/catalogx.png";

import { ChevronDownIcon, PlusIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@tedx-2026/ui/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@tedx-2026/ui/components/dropdown-menu";
import { formatIdrCurrency } from "../lib/order-management-utils";
import {
  REGULAR_MERCH_CATEGORIES,
  type ProductListSectionViewProps,
} from "../types/merch-view";
import type { Product } from "../types/product";

const Image = ({
  src,
  alt,
  fill,
  className,
  ...props
}: {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  objectFit?: string;
}) => (
  <img
    alt={alt}
    className={cn(
      fill && "absolute inset-0 h-full w-full object-cover",
      className
    )}
    height={100}
    src={src}
    width={100}
    {...props}
  />
);

export default function ProductListSection({
  activeFilterLabel,
  checkoutModal,
  counts,
  filter,
  filteredMerchs,
  hasProductLoadError,
  isProductsLoading,
  merchs,
  onAddProduct,
  onMenuOpenChange,
  onSelectFilter,
  showFloatingCheckout,
  showMenu,
}: ProductListSectionViewProps) {
  const isAllFilterActive = filter === "";
  let productGridContent: ReactNode;

  if (isProductsLoading) {
    productGridContent = (
      <div className="col-span-full rounded-2xl border border-[#CACACA]/60 bg-white p-8 text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-[#FF1818] border-t-transparent" />
        <p className="mt-4 font-sans-2 text-base text-neutral-700 sm:text-lg">
          Memuat produk...
        </p>
      </div>
    );
  } else if (hasProductLoadError) {
    productGridContent = (
      <div className="col-span-full rounded-2xl border border-[#CACACA]/60 bg-white p-8 text-center">
        <p className="font-sans-2 text-base text-neutral-700 sm:text-lg">
          Gagal memuat produk. Coba refresh halaman.
        </p>
      </div>
    );
  } else if (filteredMerchs.length > 0) {
    productGridContent = filteredMerchs.map((merch) => (
      <ProductCard key={merch.id} onAddProduct={onAddProduct} product={merch} />
    ));
  } else {
    productGridContent = (
      <div className="col-span-full rounded-2xl border border-[#CACACA]/60 bg-white p-8 text-center">
        <p className="font-sans-2 text-base text-neutral-700 sm:text-lg">
          Tidak ada produk untuk filter ini.
        </p>
        <button
          className="mt-4 cursor-pointer font-sans-2 text-red-2 text-sm underline"
          onClick={() => onSelectFilter("")}
          type="button"
        >
          Tampilkan semua produk
        </button>
      </div>
    );
  }

  return (
    <section className="flex w-full flex-col gap-16 bg-white px-5 py-24 md:px-16 lg:flex-row">
      <div className="flex flex-row items-center justify-between gap-x-6 gap-y-16 lg:flex-col lg:justify-start">
        <div className="sticky aspect-[1.74/1] w-30 lg:w-91.5">
          <Image alt="Catalog Logo" fill src={CatalogX} />
        </div>
        <div className="hidden w-full space-y-10 lg:block">
          <div>
            <h3 className="mb-5 font-semibold text-xl">SEMUA</h3>
            <button
              className={cn(
                "flex w-full cursor-pointer flex-row items-center justify-between border-[#CACACA]/35 border-b-2 py-2 transition-all duration-150 hover:bg-neutral-100",
                isAllFilterActive ? "text-tedx-black" : "text-neutral-400"
              )}
              onClick={() => onSelectFilter("")}
              type="button"
            >
              <span className="text-xl uppercase">SEMUA</span>
              <span
                className={cn(
                  "font-semibold text-2xl leading-none",
                  isAllFilterActive ? "text-[#FF1818]" : "text-[#FF1818]/50"
                )}
              >
                {merchs.length}
              </span>
            </button>
          </div>

          <div>
            <h3 className="mb-5 font-semibold text-xl">REGULAR</h3>
            {REGULAR_MERCH_CATEGORIES.map((category) => {
              const isTypeActive = filter === category;
              const count = counts[category] || 0;

              return (
                <button
                  className={cn(
                    "flex w-full cursor-pointer flex-row items-center justify-between border-[#CACACA]/35 border-b-2 py-2 transition-all duration-150 hover:bg-neutral-100",
                    isTypeActive ? "text-tedx-black" : "text-neutral-400"
                  )}
                  key={category}
                  onClick={() => onSelectFilter(category)}
                  type="button"
                >
                  <span className="text-xl uppercase">{category}</span>
                  <span
                    className={cn(
                      "font-semibold text-2xl leading-none",
                      isTypeActive ? "text-[#FF1818]" : "text-[#FF1818]/50"
                    )}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
          <div>
            <h3 className="mb-5 font-semibold text-xl">BUNDLING</h3>
            <button
              className={cn(
                "flex w-full cursor-pointer flex-row items-center justify-between border-[#CACACA]/35 border-b-2 py-2 transition-all duration-150 hover:bg-neutral-100",
                filter === "bundling" ? "text-tedx-black" : "text-neutral-400"
              )}
              onClick={() => onSelectFilter("bundling")}
              type="button"
            >
              <span className="text-xl uppercase">BUNDLING</span>
              <span
                className={cn(
                  "font-semibold text-2xl leading-none",
                  filter === "bundling" ? "text-[#FF1818]" : "text-[#FF1818]/50"
                )}
              >
                {counts.bundling}
              </span>
            </button>
          </div>
        </div>
        <div className="block lg:hidden">
          <DropdownMenu onOpenChange={onMenuOpenChange} open={showMenu}>
            <DropdownMenuTrigger className="w-48">
              <div className="flex w-full flex-row items-center justify-between rounded-lg border-[#CACACA]/35 border-b-2 bg-white p-2">
                <div className="flex items-center gap-3">
                  <span className="text-black uppercase">
                    {activeFilterLabel}
                  </span>
                  <span className="font-semibold text-[#FF1818] leading-none">
                    {filteredMerchs.length}
                  </span>
                </div>
                <ChevronDownIcon
                  className={cn(
                    "transition-all duration-300",
                    showMenu && "rotate-180"
                  )}
                  size={17}
                />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 bg-white p-0">
              <DropdownMenuItem
                className={cn(
                  "flex w-full flex-row items-center justify-between gap-4 border-[#CACACA]/35 border-b-2 p-2 focus:bg-zinc-100",
                  filter ? "text-neutral-400" : "text-tedx-black"
                )}
                onClick={() => onSelectFilter("")}
              >
                <span className="uppercase">SEMUA</span>
                <span
                  className={cn(
                    "font-semibold text-[#FF1818] leading-none",
                    filter ? "text-[#FF1818]/50" : "text-[#FF1818]"
                  )}
                >
                  {merchs.length}
                </span>
              </DropdownMenuItem>

              {REGULAR_MERCH_CATEGORIES.map((category) => {
                const isTypeActive = filter === category;
                const count = counts[category] || 0;

                return (
                  <DropdownMenuItem
                    className={cn(
                      "flex w-full flex-row items-center justify-between gap-4 border-[#CACACA]/35 border-b-2 p-2 focus:bg-zinc-100",
                      isTypeActive ? "text-tedx-black" : "text-neutral-400"
                    )}
                    key={category}
                    onClick={() => onSelectFilter(category)}
                  >
                    <span className="uppercase">{category}</span>
                    <span
                      className={cn(
                        "font-semibold text-[#FF1818] leading-none",
                        isTypeActive ? "text-[#FF1818]" : "text-[#FF1818]/50"
                      )}
                    >
                      {count}
                    </span>
                  </DropdownMenuItem>
                );
              })}
              <DropdownMenuItem
                className={cn(
                  "flex w-full flex-row items-center justify-between gap-4 border-[#CACACA]/35 border-b-2 p-2 focus:bg-zinc-100",
                  filter === "bundling" ? "text-tedx-black" : "text-neutral-400"
                )}
                onClick={() => onSelectFilter("bundling")}
              >
                <span>BUNDLING</span>
                <span
                  className={cn(
                    "font-semibold text-[#FF1818] leading-none",
                    filter === "bundling"
                      ? "text-[#FF1818]"
                      : "text-[#FF1818]/50"
                  )}
                >
                  {counts.bundling}
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="w-full">
        <div className="relative grid h-3/4 w-full grid-cols-1 gap-10 md:grid-cols-2 md:gap-x-6 md:gap-y-10 xl:grid-cols-3">
          {productGridContent}
        </div>
        <div
          className={cn(
            "fixed right-6 bottom-6 z-50 transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none md:right-8 md:bottom-8",
            showFloatingCheckout
              ? "translate-y-0 opacity-100"
              : "pointer-events-none translate-y-3 opacity-0"
          )}
        >
          {checkoutModal}
        </div>
      </div>
    </section>
  );
}

type ProductCardProps = {
  onAddProduct: (product: Product) => void;
  product: Product;
};

function ProductCard({ onAddProduct, product }: ProductCardProps) {
  const { name, price, imageUrl } = product;
  const hasImage = typeof imageUrl === "string" && imageUrl.length > 0;

  return (
    <div className="group space-y-6 rounded-xl border-[1.5px] border-transparent p-3 transition-all duration-150">
      <div
        className={
          "relative aspect-3/4 w-full overflow-hidden rounded-lg bg-neutral"
        }
      >
        {hasImage ? (
          <img
            alt={name}
            className="h-full w-full object-cover opacity-45 transition-all duration-300"
            height={400}
            loading="lazy"
            src={imageUrl}
            width={300}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-neutral-300 text-center text-neutral-600">
            <span className="font-sans-2 text-sm">Gambar tidak tersedia</span>
          </div>
        )}
      </div>
      <div className="flex flex-row items-start justify-between">
        <div className="flex w-full flex-col">
          <div className="flex w-full items-center justify-between">
            <span className="truncate font-bold text-2xl text-black md:text-3xl">
              {name}
            </span>
            <button
              className="cursor-pointer transition-transform hover:scale-110 active:scale-95"
              onClick={() => onAddProduct(product)}
              type="button"
            >
              <PlusIcon className="h-8 w-8" />
            </button>
          </div>
          <span className="text-[#8E8E8E] text-sm md:text-xl">
            {formatIdrCurrency(price)}
          </span>
        </div>
      </div>
    </div>
  );
}
