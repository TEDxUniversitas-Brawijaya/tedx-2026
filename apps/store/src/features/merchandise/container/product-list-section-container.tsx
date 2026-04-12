import { getRouteApi } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CheckoutModalContainer } from "./checkout-modal-container";
import { useMerchProductsQuery } from "../hooks/use-merch-products-query";
import { useCartStore } from "../store/cart-store";
import {
  isMerchFilter,
  type MerchFilter,
  type MerchFilterCounts,
} from "../types/merch-view";
import ProductListSection from "../components/product-list-section";

const baseCounts: MerchFilterCounts = {
  "t-shirt": 0,
  workshirt: 0,
  stickers: 0,
  socks: 0,
  keychain: 0,
  hat: 0,
  bundling: 0,
};

const routeApi = getRouteApi("/merchandise");

type ProductListSectionContainerProps = {
  showFloatingCheckout: boolean;
};

export const ProductListSectionContainer = ({
  showFloatingCheckout,
}: ProductListSectionContainerProps) => {
  const navigate = routeApi.useNavigate();
  const { filter = "" } = routeApi.useSearch();
  const { data: merchs = [], isLoading, isError } = useMerchProductsQuery();
  const { openSelection } = useCartStore();
  const [showMenu, setShowMenu] = useState(false);

  const normalizedFilter: MerchFilter = isMerchFilter(filter) ? filter : "";

  const counts = useMemo(() => {
    const nextCounts = { ...baseCounts };

    for (const merch of merchs) {
      if (merch.type === "merch_bundle") {
        nextCounts.bundling += 1;
        continue;
      }

      if (merch.type === "merch_regular" && merch.category) {
        nextCounts[merch.category] += 1;
      }
    }

    return nextCounts;
  }, [merchs]);

  const filteredMerchs = useMemo(() => {
    if (normalizedFilter === "") {
      return merchs;
    }

    if (normalizedFilter === "bundling") {
      return merchs.filter((merch) => merch.type === "merch_bundle");
    }

    return merchs.filter(
      (merch) =>
        merch.type === "merch_regular" && merch.category === normalizedFilter
    );
  }, [merchs, normalizedFilter]);

  const activeFilterLabel =
    normalizedFilter === "" ? "SEMUA" : normalizedFilter.toUpperCase();

  const handleSelectFilter = (nextFilter: MerchFilter) => {
    navigate({
      replace: true,
      search: (previous) => {
        if (nextFilter === "") {
          const { filter: _removedFilter, ...restSearch } = previous;
          return restSearch;
        }

        return {
          ...previous,
          filter: nextFilter,
        };
      },
    });
  };

  return (
    <ProductListSection
      activeFilterLabel={activeFilterLabel}
      checkoutModal={<CheckoutModalContainer />}
      counts={counts}
      filter={normalizedFilter}
      filteredMerchs={filteredMerchs}
      hasProductLoadError={isError}
      isProductsLoading={isLoading}
      merchs={merchs}
      onAddProduct={openSelection}
      onMenuOpenChange={setShowMenu}
      onSelectFilter={handleSelectFilter}
      showFloatingCheckout={showFloatingCheckout}
      showMenu={showMenu}
    />
  );
};
