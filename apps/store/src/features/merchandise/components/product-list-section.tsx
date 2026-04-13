import CatalogX from "@/assets/imgs/catalog-x.png";
import { cn } from "@tedx-2026/ui/lib/utils";
import { useInView } from "motion/react";
import { useRef } from "react";
import { CheckoutModalContainer } from "../containers/checkout-modal-container";
import { ProductListContainer } from "../containers/product-list-container";
import { ProductListFilterContainer } from "../containers/product-list-filter-container";

export const ProductListSection = () => {
  const productListSectionRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(productListSectionRef);

  return (
    <>
      <section
        className="flex w-full flex-col gap-16 bg-white px-5 py-24 md:px-16 lg:flex-row"
        ref={productListSectionRef}
      >
        <div className="flex flex-row items-center justify-between gap-x-6 gap-y-16 lg:flex-col lg:justify-start">
          <div className="sticky aspect-[1.74/1] w-30 lg:w-91.5">
            <img
              alt="Catalog Logo"
              className=""
              height={210}
              src={CatalogX}
              width={366}
            />
          </div>
          <ProductListFilterContainer />
        </div>
        <div className="w-full">
          <div className="relative grid h-3/4 w-full grid-cols-1 gap-10 md:grid-cols-2 md:gap-x-6 md:gap-y-10 xl:grid-cols-3">
            <ProductListContainer />
          </div>
        </div>
      </section>
      <div
        className={cn(
          "fixed right-6 bottom-6 z-50 transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none md:right-8 md:bottom-8",
          isInView
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-3 opacity-0"
        )}
      >
        <CheckoutModalContainer />
      </div>
    </>
  );
};
