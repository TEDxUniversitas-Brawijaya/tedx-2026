import { trpc } from "@/shared/lib/trpc";
import { useQuery } from "@tanstack/react-query";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@tedx-2026/ui/components/alert";
import { Skeleton } from "@tedx-2026/ui/components/skeleton";
import { ProductCard } from "../components/product-card";

export function ProductsGridContainer() {
  const listQuery = useQuery(trpc.admin.product.list.queryOptions({}));

  if (listQuery.isLoading) {
    return (
      <div
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        id="products-grid-skeleton"
      >
        {Array.from({ length: 6 }).map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholders
          <div className="flex flex-col gap-3 rounded-xl border p-4" key={i}>
            <Skeleton className="h-5 w-20" />
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-5/6" />
            </div>
            <div className="flex gap-6">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-16" />
            </div>
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-8 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (listQuery.error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load products: {listQuery.error.message}
        </AlertDescription>
      </Alert>
    );
  }

  if (!listQuery.data || listQuery.data.length === 0) {
    return (
      <Alert id="products-empty-state">
        <AlertTitle>No products found</AlertTitle>
        <AlertDescription>
          There are no ticket products available yet.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      id="products-grid"
    >
      {listQuery.data.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
