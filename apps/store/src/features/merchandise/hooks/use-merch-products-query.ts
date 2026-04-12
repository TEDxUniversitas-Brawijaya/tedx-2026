import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/shared/lib/trpc";

export const useMerchProductsQuery = () =>
  useQuery(trpc.merch.listProducts.queryOptions({}));
