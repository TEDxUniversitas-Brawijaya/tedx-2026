import type { ProductVariant } from "../types/product";

type GroupedVariant = {
  type: string;
  variants: (ProductVariant & { value: string })[];
};

export function groupVariantsByType(
  variants?: ProductVariant[]
): GroupedVariant[] | undefined {
  return variants?.reduce((acc, variant) => {
    const existing = acc.find((v) => v.type === variant.type);

    // Add value field for Select component
    const variantWithValue = { ...variant, value: variant.id };

    if (existing) {
      existing.variants.push(variantWithValue);
    } else {
      acc.push({ type: variant.type, variants: [variantWithValue] });
    }

    return acc;
  }, [] as GroupedVariant[]);
}
