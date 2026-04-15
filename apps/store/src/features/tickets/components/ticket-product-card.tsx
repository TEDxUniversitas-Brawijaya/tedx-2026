// Ticket product card: shows image, date label, stock state, and checkout trigger.
import { formatIdrCurrency } from "@/features/merchandise/lib/formatter";
import { cn } from "@tedx-2026/ui/lib/utils";
import type { TicketProduct } from "../types/ticket";
import { getTicketDateLabel } from "./ticket-date-label";

type TicketProductCardProps = {
  product: TicketProduct;
  onSelect: (product: TicketProduct) => void;
};

export const TicketProductCard = ({
  product,
  onSelect,
}: TicketProductCardProps) => {
  const isSoldOut = product.stock !== null && product.stock <= 0;
  const isDisabled = !product.isActive || isSoldOut;

  let stockLabel = "Stok: Tidak terbatas";
  if (product.stock !== null && product.stock <= 0) {
    stockLabel = "Sold Out";
  } else if (product.stock !== null) {
    stockLabel = `Stok tersisa: ${product.stock}`;
  }

  return (
    <button
      className={cn(
        "group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-border bg-secondary text-left text-secondary-foreground transition-all",
        isDisabled
          ? "cursor-not-allowed opacity-60"
          : "hover:-translate-y-1 hover:shadow-xl"
      )}
      disabled={isDisabled}
      id={`ticket-product-card-${product.id}`}
      onClick={() => onSelect(product)}
      type="button"
    >
      <div className="aspect-[4/3] w-full overflow-hidden bg-neutral-200">
        {product.imageUrl ? (
          <img
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            height={300}
            src={product.imageUrl}
            width={400}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground text-sm">
            Gambar belum tersedia
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <h2 className="font-serif-2 text-card-foreground text-lg leading-tight">
          {product.name}
        </h2>
        <p className="font-sans-2 text-muted-foreground text-sm">
          {getTicketDateLabel(product.id, product.description)}
        </p>
        <p
          className={cn(
            "mt-1 font-sans-2 text-xs",
            isSoldOut || !product.isActive
              ? "text-red-2"
              : "text-muted-foreground"
          )}
        >
          {product.isActive ? stockLabel : "Coming Soon"}
        </p>
        <p className="mt-auto pt-3 font-sans-2 text-card-foreground text-lg">
          {formatIdrCurrency(product.price)}
        </p>
      </div>
    </button>
  );
};
