import { useNavigate, useSearch } from "@tanstack/react-router";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@tedx-2026/ui/components/select";
import { cn } from "@tedx-2026/ui/lib/utils";
import type { Product } from "../types/product";

export const ProductListFilter = ({ products }: { products: Product[] }) => {
  const navigate = useNavigate();
  const { filter } = useSearch({
    from: "/merchandise",
  });

  const merchCategoryWithCount = products.reduce(
    (acc, product) => {
      if (product.type === "merch_regular" && product.category) {
        const existing = acc.find((item) => item.category === product.category);
        if (existing) {
          existing.count += 1;
        } else {
          acc.push({ category: product.category, count: 1 });
        }
      }
      return acc;
    },
    [] as {
      category: Product["category"];
      count: number;
    }[]
  );

  const bundlingCount = products.filter(
    (product) => product.type === "merch_bundle"
  ).length;

  const onSelectFilter = (category: string) => {
    if (category === filter) {
      return;
    }

    navigate({
      from: "/merchandise",
      search: (prev) => ({
        ...prev,
        filter: category,
      }),
      replace: true,
      resetScroll: false,
    });
  };

  return (
    <>
      <div className="hidden w-full space-y-10 lg:block">
        <div className="space-y-6">
          <h3 className="font-semibold text-black text-xl">REGULAR</h3>
          {merchCategoryWithCount.map(({ category, count }, idx) => {
            if (category === null) {
              return null;
            }

            const isSelected =
              (filter === undefined && idx === 0) || filter === category;

            return (
              <button
                className={cn(
                  "flex w-full cursor-pointer flex-row items-center justify-between border-[#CACACA]/35 border-b-2 py-2 outline-offset-4 transition-all duration-150",
                  isSelected
                    ? "text-black"
                    : "text-neutral-400 hover:text-black"
                )}
                key={category}
                onClick={() => onSelectFilter(category)}
                type="button"
              >
                <span className="text-xl uppercase">{category}</span>
                <span
                  className={cn(
                    "font-semibold text-2xl leading-none",
                    isSelected ? "text-[#FF1818]" : "text-[#FF1818]/50"
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
        <div>
          <h3 className="mb-5 font-semibold text-black text-xl">BUNDLING</h3>
          <button
            className={cn(
              "flex w-full cursor-pointer flex-row items-center justify-between border-[#CACACA]/35 border-b-2 py-2 transition-all duration-150",
              filter === "bundling"
                ? "text-black"
                : "text-neutral-400 hover:text-black"
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
              {bundlingCount}
            </span>
          </button>
        </div>
      </div>
      <div className="block lg:hidden">
        <Select
          defaultValue={filter}
          items={merchCategoryWithCount
            .map(({ category }) => ({
              value: category ?? "",
              label: category ? category.toUpperCase() : "",
            }))
            .concat({ value: "bundling", label: "BUNDLING" })}
          onValueChange={(value) => {
            if (value === null) {
              return;
            }

            onSelectFilter(value);
          }}
        >
          <SelectTrigger className="flex w-48 flex-row items-center justify-between rounded-lg border-[#CACACA]/35 border-b-2 bg-white p-2">
            <div className="flex items-center gap-3 text-base">
              <span className="text-black uppercase">
                {filter || merchCategoryWithCount[0]?.category}
              </span>
              <span className="font-semibold text-[#FF1818] leading-none">
                {filter === "bundling"
                  ? bundlingCount
                  : merchCategoryWithCount.find(
                      (item) => item.category === filter
                    )?.count || merchCategoryWithCount[0]?.count}
              </span>
            </div>
          </SelectTrigger>
          <SelectContent className="w-48 bg-white p-0">
            {merchCategoryWithCount.map(({ category, count }, idx) => {
              if (category === undefined) {
                return null;
              }

              const isSelected =
                (filter === undefined && idx === 0) || filter === category;

              return (
                <SelectItem
                  className={cn(
                    "flex w-full cursor-pointer flex-row items-center justify-between rounded-none border-[#CACACA]/35 border-b-2 py-2 transition-all duration-150 hover:bg-white",
                    isSelected ? "text-black" : "text-neutral-400"
                  )}
                  key={category}
                  value={category}
                >
                  <span className="uppercase">{category}</span>
                  <span
                    className={cn(
                      "font-semibold text-2xl leading-none",
                      isSelected ? "text-[#FF1818]" : "text-[#FF1818]/50"
                    )}
                  >
                    {count}
                  </span>
                </SelectItem>
              );
            })}
            <SelectItem
              className={cn(
                "flex w-full cursor-pointer flex-row items-center justify-between rounded-none border-[#CACACA]/35 border-b-2 py-2 transition-all duration-150 hover:bg-white",
                filter === "bundling" ? "text-black" : "text-neutral-400"
              )}
              value="bundling"
            >
              <span>BUNDLING</span>
              <span
                className={cn(
                  "font-semibold text-2xl leading-none",
                  filter === "bundling" ? "text-[#FF1818]" : "text-[#FF1818]/50"
                )}
              >
                {bundlingCount}
              </span>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
};
