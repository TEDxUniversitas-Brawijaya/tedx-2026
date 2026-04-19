import { PlusIcon } from "lucide-react";
import { formatIdrCurrency } from "../lib/formatter";
import { useCartStore } from "../stores/use-cart-store";
import type { Product } from "../types/product";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const { name, price, imageUrl } = product;

  const { openSelectionStep } = useCartStore();

  const onAddToCart = () => {
    // TODO: Move this logic to a more appropriate place
    const variantSet = new Set<string>();
    const defaultVariantSelection = product.variants
      ?.filter((v) => {
        if (variantSet.has(v.type)) {
          return false;
        }

        variantSet.add(v.type);

        return true;
      })
      .map((v) => ({
        id: v.id,
        label: v.label,
        type: v.type,
      }));

    const defaultBundleProducts = product.bundleItems
      ?.filter(
        (bundleItem) =>
          bundleItem.type === "merchandise" ||
          bundleItem.type === "merchandise_product"
      )
      ?.map((bundleItem) => {
        if (bundleItem.type === "merchandise_product") {
          const variantSet = new Set<string>();
          const selectedVariants = bundleItem.product.variants
            ?.filter((v) => {
              if (variantSet.has(v.type)) {
                return false;
              }

              variantSet.add(v.type);

              return true;
            })
            .map((v) => ({
              id: v.id,
              label: v.label,
              type: v.type,
            }));

          return {
            ...bundleItem.product,
            category: null, // The category is not provided for merchandise_product type, so we set it to null
            selectedVariants,
          };
        }

        const bundleProduct = bundleItem.products?.[0];
        if (!bundleProduct) {
          throw new Error("Bundle item must have at least one product");
        }

        const variantSet = new Set<string>();
        const selectedVariants = bundleProduct.variants
          ?.filter((v) => {
            if (variantSet.has(v.type)) {
              return false;
            }

            variantSet.add(v.type);

            return true;
          })
          .map((v) => ({
            id: v.id,
            label: v.label,
            type: v.type,
          }));

        return {
          ...bundleProduct,
          category: bundleItem.category,
          selectedVariants,
        };
      });

    openSelectionStep(
      {
        ...product,
        quantity: 1,
        selectedVariants:
          product.type === "merch_regular"
            ? defaultVariantSelection
            : undefined,
        selectedBundleProducts:
          product.type === "merch_bundle" ? defaultBundleProducts : undefined,
        itemId: `${product.id}-${Date.now()}`, // Unique item ID for cart management
      },
      "add"
    );
  };

  return (
    <div className="group space-y-6 rounded-xl border-[1.5px] border-transparent transition-all duration-150">
      <div className="relative aspect-3/4 w-full overflow-hidden rounded-lg bg-neutral-300">
        {imageUrl ? (
          <img
            alt={name}
            className="h-full w-full object-cover opacity-45 transition-all duration-300"
            height={400}
            loading="lazy"
            src={imageUrl}
            width={300}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-neutral-300 text-center text-neutral-600">
            <span className="font-sans-2 text-sm">Gambar tidak tersedia</span>
          </div>
        )}
      </div>
      <div className="flex flex-row items-start justify-between">
        <div className="flex w-full flex-col">
          <div className="flex w-full items-center justify-between">
            <span className="truncate font-bold text-2xl text-black md:text-3xl">
              {name}
            </span>
            <button
              className="cursor-pointer text-black transition-transform hover:scale-110 active:scale-95"
              onClick={onAddToCart}
              type="button"
            >
              <PlusIcon className="size-8" />
            </button>
          </div>
          <span className="text-[#8E8E8E] text-sm md:text-xl">
            {formatIdrCurrency(price)}
          </span>
        </div>
      </div>
    </div>
  );
}
