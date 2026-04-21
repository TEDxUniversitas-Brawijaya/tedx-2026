import DoubleChair from "@/assets/imgs/double-chair.png";
import SingleChair from "@/assets/imgs/single-chair.png";
import { cn } from "@tedx-2026/ui/lib/utils";
import { formatIdrCurrency } from "../lib/formatter";
import { useTicketCheckoutStore } from "../stores/use-ticket-checkout-store";
import type { TicketProduct } from "../types/ticket";

type TicketProductCardProps = {
  product: TicketProduct;
};

export const TicketProductCard = ({ product }: TicketProductCardProps) => {
  const { openCheckout } = useTicketCheckoutStore();

  const isSoldOut = product.stock !== null && product.stock <= 0;
  const isDisabled = !product.isActive || isSoldOut;

  const isMainEvent = product.name.toLowerCase().includes("main event");
  const chairImage = isMainEvent ? DoubleChair : SingleChair;

  const onOpenCheckout = () => {
    const defaultBundleProducts = product.bundleItems
      ?.filter((bundleItem) => bundleItem.type === "ticket")
      ?.map((bundleItem) => {
        return {
          productId: bundleItem.productId,
        };
      });

    openCheckout({
      ...product,
      itemId: `${product.id}-${Date.now()}`, // unique item ID for cart
      selectedBundleProducts:
        product.type === "ticket_bundle" ? defaultBundleProducts : undefined,
    });
  };

  return (
    <button
      className={cn(
        "product-card-fixed group",
        isDisabled && "cursor-not-allowed opacity-60"
      )}
      disabled={isDisabled}
      id={`ticket-product-card-${product.id}`}
      onClick={onOpenCheckout}
      type="button"
    >
      {/* Background Layer (Chair with Mask) */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <img
          alt=""
          className="product-card-chair object-cover object-top opacity-80"
          height={227}
          src={chairImage}
          style={{ height: "227px", width: "481px" }}
          width={481}
        />
      </div>

      {/* Content Layer - Bottom Aligned as per Screenshot */}
      <div className="relative z-20 flex h-full flex-col justify-end p-8 text-left">
        <div className="flex flex-col gap-1">
          <h2 className="font-serif-2 text-2xl text-white leading-tight">
            {product.name}
          </h2>
          {product.description && (
            <p className="font-sans-2 text-sm text-white/80">
              {product.description}.{" "}
              {product.stock !== null && `${product.stock} tiket tersisa.`}
            </p>
          )}
          <p className="mt-3 font-sans-2 text-base text-white">
            {product.price <= 0 ? "TBA" : formatIdrCurrency(product.price)}
          </p>
        </div>
      </div>
    </button>
  );
};
