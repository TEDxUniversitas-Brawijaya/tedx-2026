import type {
  CartItem,
  OrderPayment,
  OrderPaymentMethod,
  OrderSnapshotItem,
} from "@/features/merchandise/types/cart";

const fallbackQrisUrl = "/qris.png";
const knownInvalidDummyQrisHosts = new Set(["example.com", "www.example.com"]);

export const formatIdrCurrency = (amount: number) =>
  amount.toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
  });

export const formatCountdownClock = (seconds: number) => {
  const safeSeconds = Math.max(0, seconds);
  const minutesPart = Math.floor(safeSeconds / 60)
    .toString()
    .padStart(2, "0");
  const secondsPart = (safeSeconds % 60).toString().padStart(2, "0");

  return `${minutesPart}:${secondsPart}`;
};

export const resolveIsManualPayment = (
  paymentMethod: OrderPaymentMethod | null,
  orderPayment: OrderPayment | null
) =>
  paymentMethod === "manual" ||
  (paymentMethod === null &&
    Boolean(orderPayment && "uploadUrl" in orderPayment));

export const resolveOrderQrisUrl = (orderPayment: OrderPayment | null) => {
  if (!orderPayment) {
    return fallbackQrisUrl;
  }

  if (!("qrisUrl" in orderPayment)) {
    return fallbackQrisUrl;
  }

  try {
    const parsedQrisUrl = new URL(orderPayment.qrisUrl);
    if (knownInvalidDummyQrisHosts.has(parsedQrisUrl.hostname)) {
      return fallbackQrisUrl;
    }

    return orderPayment.qrisUrl;
  } catch {
    return fallbackQrisUrl;
  }
};

export const resolveOrderUploadUrl = (orderPayment: OrderPayment | null) =>
  orderPayment && "uploadUrl" in orderPayment ? orderPayment.uploadUrl : null;

export const buildOrderSnapshotItems = (
  items: CartItem[]
): OrderSnapshotItem[] =>
  items.map((item) => {
    const variants = item.selectedVariantIds
      .map((variantId) =>
        item.variants?.find((variant) => variant.id === variantId)
      )
      .filter(
        (variant): variant is { id: string; label: string; type: string } =>
          variant !== undefined
      )
      .map((variant) => ({
        label: variant.label,
        type: variant.type,
      }));

    return {
      snapshotName: item.name,
      quantity: item.quantity,
      unitPrice: item.price,
      snapshotVariants: variants.length > 0 ? variants : undefined,
    };
  });

export const buildCreateOrderItems = (items: CartItem[]) =>
  items.map((item) => ({
    productId: item.id,
    quantity: item.quantity,
    variantIds: item.selectedVariantIds,
  }));

export const getBundleItemSubtitle = (item: CartItem) => {
  if (item.type !== "merch_bundle") {
    return null;
  }

  const labels =
    item.bundleItems
      ?.filter((bundleItem) => bundleItem.type === "merchandise")
      .map((bundleItem) => {
        if (bundleItem.category === "t-shirt") {
          return "kaos";
        }

        if (bundleItem.category === "hat") {
          return "topi";
        }

        return bundleItem.category;
      }) ?? [];

  if (labels.length === 0) {
    return null;
  }

  return `(${labels.join(" + ")})`;
};

export const getBundleSelectionLabel = (item: CartItem) => {
  if (item.type !== "merch_bundle") {
    return null;
  }

  const selections =
    item.bundleItems
      ?.map((bundleItem, index) => {
        if (bundleItem.type !== "merchandise") {
          return null;
        }

        const selectedProductId =
          item.selectedBundleProductIds?.[index] ?? bundleItem.products[0]?.id;
        const selectedProduct =
          bundleItem.products.find(
            (product) => product.id === selectedProductId
          ) ?? bundleItem.products[0];

        if (!selectedProduct) {
          return null;
        }

        const selectedVariantId = item.selectedVariantIds[index];
        const selectedVariantLabel =
          selectedProduct.variants?.find(
            (variant) => variant.id === selectedVariantId
          )?.label ?? selectedProduct.variants?.[0]?.label;

        return selectedVariantLabel
          ? `${selectedProduct.name} - ${selectedVariantLabel}`
          : selectedProduct.name;
      })
      .filter((selection): selection is string => Boolean(selection)) ?? [];

  if (selections.length === 0) {
    return null;
  }

  if (selections.length === 1) {
    return selections[0];
  }

  return `${selections[0]} +${selections.length - 1}`;
};
