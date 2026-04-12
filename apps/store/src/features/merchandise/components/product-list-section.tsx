import { useNavigate } from "@tanstack/react-router";
const CatalogX = "/catalogx.png";

import { ChevronDownIcon, PlusIcon } from "lucide-react";
import { useMemo, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@tedx-2026/ui/components/dropdown-menu";
import type { Product } from "../types/product";
import { CheckoutModal } from "./cart";
import { useCartStore } from "../store/cart-store";

// Dummy Image component
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
    className={`${fill ? "absolute inset-0 h-full w-full object-cover" : ""} ${className}`}
    height={100}
    src={src}
    width={100}
    {...props}
  />
);

const REGULAR_CATEGORIES = [
  "t-shirt",
  "workshirt",
  "stickers",
  "socks",
  "keychain",
  "hat",
] as const;

export default function ProductListSection({
  merchs = [],
  filter,
}: {
  merchs: Product[];
  filter: string;
}) {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate({ from: "/merchandise" });

  const counts = useMemo(() => {
    const regularCounts = REGULAR_CATEGORIES.reduce(
      (acc, cat) => {
        acc[cat] = merchs.filter(
          (m) => m.category === cat && m.type === "merch_regular"
        ).length;
        return acc;
      },
      {} as Record<string, number>
    );

    const bundleCount = merchs.filter((m) => m.type === "merch_bundle").length;

    return { ...regularCounts, bundling: bundleCount };
  }, [merchs]);

  const filteredMerchs = useMemo(() => {
    if (!filter) {
      return merchs;
    }
    if (filter === "bundling") {
      return merchs.filter((m) => m.type === "merch_bundle");
    }
    return merchs.filter(
      (m) => m.category === filter && m.type === "merch_regular"
    );
  }, [merchs, filter]);

  const activeFilterLabel = filter ? filter.toUpperCase() : "SEMUA";
  const isAllFilterActive = filter === "";

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
              className={`flex w-full cursor-pointer flex-row items-center justify-between border-[#CACACA]/35 border-b-2 py-2 transition-all duration-150 hover:bg-neutral-100 ${isAllFilterActive ? "text-tedx-black" : "text-neutral-400"}`}
              onClick={() => {
                navigate({
                  search: (prev) => ({ ...prev, filter: "" }),
                  resetScroll: false,
                });
              }}
              type="button"
            >
              <span className="text-xl uppercase">SEMUA</span>
              <span
                className={`font-semibold text-2xl leading-none ${isAllFilterActive ? "text-[#FF1818]" : "text-[#FF1818]/50"}`}
              >
                {merchs.length}
              </span>
            </button>
          </div>

          <div>
            <h3 className="mb-5 font-semibold text-xl">REGULAR</h3>
            {REGULAR_CATEGORIES.map((cat) => {
              const isTypeActive = filter === cat;
              const count = counts[cat as keyof typeof counts] || 0;

              return (
                <button
                  className={`flex w-full cursor-pointer flex-row items-center justify-between border-[#CACACA]/35 border-b-2 py-2 transition-all duration-150 hover:bg-neutral-100 ${isTypeActive ? "text-tedx-black" : "text-neutral-400"}`}
                  key={cat}
                  onClick={() => {
                    navigate({
                      search: (prev) => ({ ...prev, filter: cat }),
                      resetScroll: false,
                    });
                  }}
                  type="button"
                >
                  <span className="text-xl uppercase">{cat}</span>
                  <span
                    className={`font-semibold text-2xl leading-none ${isTypeActive ? "text-[#FF1818]" : "text-[#FF1818]/50"}`}
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
              className={`flex w-full cursor-pointer flex-row items-center justify-between border-[#CACACA]/35 border-b-2 py-2 transition-all duration-150 hover:bg-neutral-100 ${filter === "bundling" ? "text-tedx-black" : "text-neutral-400"}`}
              onClick={() => {
                navigate({
                  search: (prev) => ({ ...prev, filter: "bundling" }),
                  resetScroll: false,
                });
              }}
              type="button"
            >
              <span className="text-xl uppercase">BUNDLING</span>
              <span
                className={`font-semibold text-2xl leading-none ${filter === "bundling" ? "text-[#FF1818]" : "text-[#FF1818]/50"}`}
              >
                {counts.bundling}
              </span>
            </button>
          </div>
        </div>
        <div className="block lg:hidden">
          <DropdownMenu onOpenChange={setShowMenu} open={showMenu}>
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
                  className={`transition-all duration-300 ${showMenu && "rotate-180"}`}
                  size={17}
                />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 bg-white p-0">
              <DropdownMenuItem
                className={`${filter ? "text-neutral-400" : "text-tedx-black"} flex w-full flex-row items-center justify-between gap-4 border-[#CACACA]/35 border-b-2 p-2 focus:bg-zinc-100`}
                onClick={() => {
                  navigate({
                    search: (prev) => ({ ...prev, filter: "" }),
                    resetScroll: false,
                  });
                }}
              >
                <span className="uppercase">SEMUA</span>
                <span
                  className={`font-semibold text-[#FF1818] leading-none ${filter ? "text-[#FF1818]/50" : "text-[#FF1818]"}`}
                >
                  {merchs.length}
                </span>
              </DropdownMenuItem>

              {REGULAR_CATEGORIES.map((cat) => {
                const isTypeActive = filter === cat;
                const count = counts[cat as keyof typeof counts] || 0;

                return (
                  <DropdownMenuItem
                    className={`${isTypeActive ? "text-tedx-black" : "text-neutral-400"} flex w-full flex-row items-center justify-between gap-4 border-[#CACACA]/35 border-b-2 p-2 focus:bg-zinc-100`}
                    key={cat}
                    onClick={() => {
                      navigate({
                        search: (prev) => ({ ...prev, filter: cat }),
                        resetScroll: false,
                      });
                    }}
                  >
                    <span className="uppercase">{cat}</span>
                    <span
                      className={`font-semibold text-[#FF1818] leading-none ${isTypeActive ? "text-[#FF1818]" : "text-[#FF1818]/50"}`}
                    >
                      {count}
                    </span>
                  </DropdownMenuItem>
                );
              })}
              <DropdownMenuItem
                className={`${filter === "bundling" ? "text-tedx-black" : "text-neutral-400"} flex w-full flex-row items-center justify-between gap-4 border-[#CACACA]/35 border-b-2 p-2 focus:bg-zinc-100`}
                onClick={() => {
                  navigate({
                    search: (prev) => ({ ...prev, filter: "bundling" }),
                    resetScroll: false,
                  });
                }}
              >
                <span>BUNDLING</span>
                <span
                  className={`font-semibold text-[#FF1818] leading-none ${filter === "bundling" ? "text-[#FF1818]" : "text-[#FF1818]/50"}`}
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
          {filteredMerchs.length > 0 ? (
            filteredMerchs.map((merch) => (
              <ProductCard key={merch.id} {...merch} />
            ))
          ) : (
            <div className="col-span-full rounded-2xl border border-[#CACACA]/60 bg-white p-8 text-center">
              <p className="font-sans-2 text-base text-neutral-700 sm:text-lg">
                Tidak ada produk untuk filter ini.
              </p>
              <button
                className="mt-4 cursor-pointer font-sans-2 text-red-2 text-sm underline"
                onClick={() => {
                  navigate({
                    search: (prev) => ({ ...prev, filter: "" }),
                    resetScroll: false,
                  });
                }}
                type="button"
              >
                Tampilkan semua produk
              </button>
            </div>
          )}
        </div>
        <div className="fixed right-6 bottom-6 z-50 md:right-8 md:bottom-8">
          <CheckoutModal />
        </div>
      </div>
    </section>
  );
}

function ProductCard(product: Product) {
  const { name, price, imageUrl } = product;
  const openSelection = useCartStore((state) => state.openSelection);

  const handleAdd = () => {
    openSelection(product);
  };

  return (
    <div className="group space-y-6 rounded-xl border-[1.5px] border-transparent p-3 transition-all duration-150">
      <div
        className={
          "relative aspect-3/4 w-full overflow-hidden rounded-lg bg-neutral-200"
        }
      >
        <img
          alt={name}
          className="opacity-45 transition-all duration-300"
          height={0}
          src={imageUrl ?? ""}
          width={0}
        />
      </div>
      <div className="flex flex-row items-start justify-between">
        <div className="flex w-full flex-col">
          <div className="flex w-full items-center justify-between">
            <span className="truncate font-bold text-2xl text-black md:text-3xl">
              {name}
            </span>
            <button
              className="cursor-pointer transition-transform hover:scale-110 active:scale-95"
              onClick={handleAdd}
              type="button"
            >
              <PlusIcon className="h-8 w-8" />
            </button>
          </div>
          <span className="text-[#8E8E8E] text-sm md:text-xl">
            {price.toLocaleString("id-ID", {
              style: "currency",
              currency: "IDR",
            })}
          </span>
        </div>
      </div>
    </div>
  );
}
