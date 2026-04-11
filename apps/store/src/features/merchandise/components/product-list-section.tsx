import { useNavigate } from "@tanstack/react-router";
import CatalogX from "../../../../public/catalogx.png";

import { ChevronDownIcon, PlusIcon, ShoppingCart } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../../../../packages/ui/src/components/dropdown-menu";
import { merchBundlingData, merchsData, type MerchFilter } from "../data/merch";

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

export default function ProductListSection({
  merchs,
  filter,
}: {
  merchs: (typeof merchsData)[keyof typeof merchsData];
  filter: string;
}) {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  return (
    <section className="flex w-full flex-col gap-16 bg-white px-5 py-24 md:px-16 lg:flex-row">
      <div className="flex flex-row items-center justify-between gap-x-6 gap-y-16 lg:flex-col lg:justify-start">
        <div className="sticky aspect-[1.74/1] w-[120px] lg:w-[366px]">
          <Image alt="Catalog Logo" fill src={CatalogX} />
        </div>
        <div className="hidden w-full space-y-10 lg:block">
          <div>
            <h3 className="mb-5 font-semibold text-xl">REGULAR</h3>
            {Object.keys(merchsData).map((key) => {
              const isTypeActive = filter === key;

              return (
                <button
                  className={`flex w-full cursor-pointer flex-row items-center justify-between border-[#CACACA]/35 border-b-2 py-2 transition-all duration-150 hover:bg-neutral-100 ${isTypeActive ? "text-tedx-black" : "text-neutral-400"}`}
                  key={key}
                  onClick={() => {
                    navigate({
                      //   search: (prev) => ({ ...prev, filter: key }),
                    });
                  }}
                  type="button"
                >
                  <span className="text-xl uppercase">
                    {key === "tshirt" ? "t-shirt" : key}
                  </span>
                  <span
                    className={`font-semibold text-2xl leading-none ${isTypeActive ? "text-[#FF1818]" : "text-[#FF1818]/50"}`}
                  >
                    {merchsData[key as MerchFilter]?.length ?? 0}
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
                  //   search: (prev: any) => ({ ...prev, filter: "bundling" }),
                });
              }}
              type="button"
            >
              <span className="text-xl uppercase">BUNDLING</span>
              <span
                className={`font-semibold text-2xl leading-none ${filter === "bundling" ? "text-[#FF1818]" : "text-[#FF1818]/50"}`}
              >
                {merchBundlingData.length}
              </span>
            </button>
          </div>
        </div>
        <div className="block lg:hidden">
          <DropdownMenu onOpenChange={setShowMenu} open={showMenu}>
            <DropdownMenuTrigger className="w-48">
              <div className="flex w-full flex-row items-center justify-between rounded-lg border-[#CACACA]/35 border-b-2 bg-white p-2">
                <div className="flex items-center gap-3">
                  <span className="text-black uppercase">{filter}</span>
                  <span className="font-semibold text-[#FF1818] leading-none">
                    {merchs.length}
                  </span>
                </div>
                <ChevronDownIcon
                  className={`transition-all duration-300 ${showMenu && "rotate-180"}`}
                  size={17}
                />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 bg-white p-0">
              {Object.keys(merchsData).map((key) => {
                const isTypeActive = filter === key;

                return (
                  <DropdownMenuItem
                    className={`${isTypeActive ? "text-tedx-black" : "text-neutral-400"} flex w-full flex-row items-center justify-between gap-4 border-[#CACACA]/35 border-b-2 p-2 focus:bg-zinc-100`}
                    key={key}
                    onClick={() => {
                      navigate({
                        // search: (prev) => ({ ...prev, filter: key }),
                      });
                    }}
                  >
                    <span className="uppercase">{key}</span>
                    <span
                      className={`font-semibold text-[#FF1818] leading-none ${isTypeActive ? "text-[#FF1818]" : "text-[#FF1818]/50"}`}
                    >
                      {merchsData[key as MerchFilter]?.length ?? 0}
                    </span>
                  </DropdownMenuItem>
                );
              })}
              <DropdownMenuItem
                className={`${filter === "bundling" ? "text-tedx-black" : "text-neutral-400"} flex w-full flex-row items-center justify-between gap-4 border-[#CACACA]/35 border-b-2 p-2 focus:bg-zinc-100`}
                onClick={() => {
                  navigate({
                    //   search: (prev) => ({ ...prev, filter: "bundling" }),
                  });
                }}
              >
                <span className="uppercase">BUNDLING</span>
                <span
                  className={`font-semibold text-[#FF1818] leading-none ${filter === "bundling" ? "text-[#FF1818]" : "text-[#FF1818]/50"}`}
                >
                  {merchBundlingData.length}
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="w-full">
        <div className="relative grid h-3/4 w-full grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
          {merchs.map((merch) => (
            <ProductCard
              image=""
              key={merch.id}
              {...merch}
              isBundling={filter === "bundling"}
            />
          ))}
        </div>
        <div className="flex w-full justify-end">
          <button
            className="relative flex cursor-pointer items-center rounded-lg border-2 border-black p-2"
            type="button"
          >
            <ShoppingCart />
            <span className="absolute -top-2 -right-2 flex aspect-square h-5 w-5 items-center justify-center rounded-full bg-red-2 text-[8px] text-white">
              9
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}

function ProductCard({
  name,
  price,
  image,
  isBundling = false,
}: {
  name: string;
  price: number;
  image: string;
  isBundling: boolean;
}) {
  // const regularRedirectPath = `/form/merch?item=${name.toLowerCase().replace("t-shirt", "tshirt").replaceAll(" ", "-")}`;

  // const bundlingRedirectPath = `/form/merch-bundle?item=${name.toLowerCase().replaceAll(" ", "-")}`;

  return (
    <div className="group space-y-6 rounded-xl border-[1.5px] border-transparent p-3 transition-all duration-150">
      <div
        className={`relative w-full overflow-hidden rounded-lg bg-neutral-200 ${isBundling ? "aspect-[3/4]" : "aspect-3/4"}`}
      >
        <img
          alt={name}
          className="opacity-45 transition-all duration-300"
          height={0}
          src={image}
          width={0}
        />
      </div>
      <div className="flex flex-row items-start justify-between">
        <div className="flex w-full flex-col">
          <div className="flex w-full items-center justify-between">
            <span className="font-bold text-black text-xl md:text-3xl">
              {name}
            </span>
            <button className="cursor-pointer" type="button">
              <PlusIcon />
            </button>
          </div>
          <span className="text-[#8E8E8E] text-base md:text-xl">
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
