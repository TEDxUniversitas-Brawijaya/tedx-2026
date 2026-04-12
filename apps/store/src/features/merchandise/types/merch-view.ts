import type { FormEvent, ReactNode, RefObject, UIEventHandler } from "react";
import type { CartItem } from "./cart";
import type { BundleItem, Product } from "./product";
import type { CheckoutStep } from "./types";

export const REGULAR_MERCH_CATEGORIES = [
  "t-shirt",
  "workshirt",
  "stickers",
  "socks",
  "keychain",
  "hat",
] as const;

export type MerchRegularCategory = (typeof REGULAR_MERCH_CATEGORIES)[number];
export type MerchFilter = "" | MerchRegularCategory | "bundling";

const merchFilterValueSet: ReadonlySet<string> = new Set([
  "",
  "bundling",
  ...REGULAR_MERCH_CATEGORIES,
]);

export const isMerchFilter = (value: string): value is MerchFilter =>
  merchFilterValueSet.has(value);

export type MerchFilterCounts = Record<
  MerchRegularCategory | "bundling",
  number
>;

export type ProductListSectionViewProps = {
  activeFilterLabel: string;
  checkoutModal: ReactNode;
  counts: MerchFilterCounts;
  filter: MerchFilter;
  filteredMerchs: Product[];
  hasProductLoadError: boolean;
  isProductsLoading: boolean;
  merchs: Product[];
  onAddProduct: (product: Product) => void;
  onMenuOpenChange: (open: boolean) => void;
  onSelectFilter: (filter: MerchFilter) => void;
  showFloatingCheckout: boolean;
  showMenu: boolean;
};

export type HeroImageCard = {
  id: number;
  imageUrl: string;
  width: number;
  x: number;
  zIndex: number;
};

export type HeroImageViewProps = {
  cards: HeroImageCard[];
};

export type CategoryNavItem = {
  id: string;
  next: string;
  prev: string;
  title: string;
};

export type CategorySectionViewProps = {
  activeIndex: number;
  categories: CategoryNavItem[];
  logo: string;
  loopCategories: CategoryNavItem[];
  onCategoryClick: (index: number) => void;
  onNext: () => void;
  onPrev: () => void;
  onScroll: UIEventHandler<HTMLDivElement>;
  scrollRef: RefObject<HTMLDivElement | null>;
};

export type CheckoutModalViewProps = {
  children: ReactNode;
  currentStep: CheckoutStep;
  isModalOpen: boolean;
  itemCount: number;
  onOpenCart: () => void;
  onOpenChange: (open: boolean) => void;
};

export type CartStepViewProps = {
  items: CartItem[];
  onCancel: () => void;
  onEditSelection: (item: CartItem) => void;
  onNext: () => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  totalPrice: number;
};

export type IdentificationStepViewProps<FormShape> = {
  form: FormShape;
  hasSubmitted: boolean;
  onBack: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export type SuccessStepViewProps = {
  onClose: () => void;
};

export type SelectionStepViewProps = {
  actionLabel: string;
  activeProduct: Product;
  categorySiblings: Product[];
  isBundling: boolean;
  onBundleProductChange: (
    itemIdx: number,
    productId: string,
    bundleItem: BundleItem
  ) => void;
  onBundleVariantChange: (itemIdx: number, variantId: string) => void;
  onPay: () => void;
  onProductSwitch: (product: Product) => void;
  onQuantityChange: (next: number) => void;
  onVariantChange: (next: string) => void;
  quantity: number;
  selectedBundleProductIds: string[];
  selectedBundleVariantIds: string[];
  selectedVariantId: string;
  selectedVariantLabel: string;
};
