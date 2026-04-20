import { Badge } from "@tedx-2026/ui/components/badge";
import type { Product } from "../types/product";
import { formatCurrency } from "../utils/formatter";
import { ProductEditDialog } from "./product-edit-dialog";

type ProductCardProps = {
  product: Product;
};

const typeLabels: Record<string, string> = {
  ticket_regular: "Regular",
  ticket_bundle: "Bundle",
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div
      className="flex flex-col gap-3 rounded-xl border bg-card p-4"
      id={`product-card-${product.id}`}
    >
      <div className="flex items-center gap-2">
        <Badge id={`product-type-${product.id}`} variant="outline">
          {typeLabels[product.type] ?? product.type}
        </Badge>
        {!product.isActive && <Badge variant="secondary">Inactive</Badge>}
      </div>
      <div>
        <p
          className="font-semibold text-sm leading-tight"
          id={`product-name-${product.id}`}
        >
          {product.name}
        </p>
        {product.description && (
          <p
            className="mt-1 line-clamp-2 text-muted-foreground text-xs"
            id={`product-description-${product.id}`}
          >
            {product.description}
          </p>
        )}
      </div>
      <div className="flex items-center gap-6">
        <div>
          <p className="text-muted-foreground text-xs">Price</p>
          <p
            className="font-medium text-sm tabular-nums"
            id={`product-price-${product.id}`}
          >
            {formatCurrency(product.price)}
          </p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs">Stock</p>
          <p
            className="font-medium text-sm tabular-nums"
            id={`product-stock-${product.id}`}
          >
            {product.stock ?? "—"}
          </p>
        </div>
      </div>
      <p
        className="font-mono text-muted-foreground text-xs"
        id={`product-id-label-${product.id}`}
      >
        {product.id}
      </p>

      <div className="mt-auto ml-auto pt-1">
        <ProductEditDialog product={product} />
      </div>
    </div>
  );
}
