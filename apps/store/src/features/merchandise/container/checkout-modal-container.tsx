import { createNanoIdWithPrefix } from "@tedx-2026/utils";
import {
  type ChangeEvent,
  type ReactNode,
  useId,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import { CheckoutModal } from "../components/cart";
import { CartStep } from "../components/cart/steps/cart-step";
import { IdentificationStep } from "../components/cart/steps/identification-step";
import { PaymentStep } from "../components/cart/steps/payment-step";
import { PaymentStepManual } from "../components/cart/steps/payment-step-manual";
import { SelectionStep } from "../components/cart/steps/selection-step";
import { SuccessStep } from "../components/cart/steps/success-step";
import { SummaryStep } from "../components/cart/steps/summary-step";
import { useCreateMerchOrderMutation } from "../hooks/use-create-merch-order-mutation";
import { useCheckoutForm } from "../hooks/use-checkout-form";
import { useMerchProductsQuery } from "../hooks/use-merch-products-query";
import { useOrderStatusMutation } from "../hooks/use-order-status-mutation";
import {
  buildCreateOrderItems,
  buildOrderSnapshotItems,
  resolveIsManualPayment,
  resolveOrderQrisUrl,
  resolveOrderUploadUrl,
} from "../lib/order-management-utils";
import { useCartStore } from "../store/cart-store";
import type { BundleItem, Product } from "../types/product";

const millisecondsInSecond = 1000;
const paymentWindowSeconds = 300;

const subscribeToSecondTick = (onStoreChange: () => void) => {
  const timerId = globalThis.setInterval(onStoreChange, millisecondsInSecond);

  return () => {
    globalThis.clearInterval(timerId);
  };
};

const getNowSnapshot = () => Date.now();
const getServerSnapshot = () => 0;

const useCountdownSeconds = (durationInSeconds: number) => {
  const [deadlineInMilliseconds] = useState(
    () => Date.now() + durationInSeconds * millisecondsInSecond
  );

  const currentTimestamp = useSyncExternalStore(
    subscribeToSecondTick,
    getNowSnapshot,
    getServerSnapshot
  );

  return Math.max(
    0,
    Math.ceil(
      (deadlineInMilliseconds - currentTimestamp) / millisecondsInSecond
    )
  );
};

const getInitialBundleProductIds = (
  activeProduct: Product | null,
  selectedBundleProductIds?: string[]
) => {
  if (selectedBundleProductIds) {
    return selectedBundleProductIds;
  }

  return (
    activeProduct?.bundleItems?.map((item) => {
      if (item.type === "merchandise") {
        return item.products[0]?.id ?? "";
      }

      return "";
    }) ?? []
  );
};

const getInitialBundleVariantIds = (
  activeProduct: Product | null,
  selectedVariantIds: string[] | undefined,
  initialBundleProductIds: string[]
) => {
  if (selectedVariantIds) {
    return selectedVariantIds;
  }

  return (
    activeProduct?.bundleItems?.map((item, index) => {
      if (item.type === "merchandise") {
        const productId = initialBundleProductIds[index];
        const product = item.products.find((entry) => entry.id === productId);

        return product?.variants?.[0]?.id ?? "";
      }

      return "";
    }) ?? []
  );
};

const CartStepSection = ({ onNext }: { onNext: () => void }) => {
  const { items, updateQuantity, openSelection, getTotalPrice, closeModal } =
    useCartStore();

  return (
    <CartStep
      items={items}
      onCancel={closeModal}
      onEditSelection={(item) => openSelection(item, "edit")}
      onNext={onNext}
      onUpdateQuantity={updateQuantity}
      totalPrice={getTotalPrice()}
    />
  );
};

const IdentificationStepSection = ({
  form,
  onBack,
}: {
  form: ReturnType<typeof useCheckoutForm>;
  onBack: () => void;
}) => {
  const [hasSubmitted, setHasSubmitted] = useState(false);

  return (
    <IdentificationStep
      form={form}
      hasSubmitted={hasSubmitted}
      onBack={onBack}
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        setHasSubmitted(true);
        form.handleSubmit();
      }}
    />
  );
};

const SelectionStepSection = () => {
  const {
    activeProduct,
    editingItemId,
    items,
    addItem,
    removeItem,
    updateItem,
    setStep,
  } = useCartStore();

  const editingItem = editingItemId
    ? items.find((item) => item.id === editingItemId)
    : null;

  const existingItem = activeProduct
    ? items.find((item) => item.id === activeProduct.id)
    : null;

  const initialBundleProductIds = getInitialBundleProductIds(
    activeProduct,
    editingItem?.selectedBundleProductIds
  );

  const [quantity, setQuantity] = useState(editingItem?.quantity ?? 1);
  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    editingItem?.selectedVariantIds?.[0] ??
      activeProduct?.variants?.[0]?.id ??
      ""
  );
  const [selectedBundleProductIds, setSelectedBundleProductIds] = useState<
    string[]
  >(initialBundleProductIds);
  const [selectedBundleVariantIds, setSelectedBundleVariantIds] = useState<
    string[]
  >(
    getInitialBundleVariantIds(
      activeProduct,
      editingItem?.selectedVariantIds,
      initialBundleProductIds
    )
  );

  const { data: allMerchs = [] } = useMerchProductsQuery();

  const categorySiblings = useMemo(() => {
    if (!activeProduct || activeProduct.type === "merch_bundle") {
      return [];
    }

    return allMerchs.filter(
      (product) =>
        product.category === activeProduct.category &&
        product.type === "merch_regular"
    );
  }, [activeProduct, allMerchs]);

  if (!activeProduct) {
    return null;
  }

  const isBundling = activeProduct.type === "merch_bundle";

  const handlePay = () => {
    const variantIds: string[] = [];
    if (isBundling) {
      variantIds.push(...selectedBundleVariantIds);
    } else if (selectedVariantId) {
      variantIds.push(selectedVariantId);
    }
    const bundleIds = isBundling ? selectedBundleProductIds : undefined;
    const shouldReplace =
      editingItemId !== null && editingItemId !== activeProduct.id;

    if (shouldReplace) {
      removeItem(editingItemId);
      addItem(activeProduct, quantity, variantIds, bundleIds);
      setStep("cart");
      return;
    }

    const targetId = editingItemId ?? activeProduct.id;
    if (editingItemId || existingItem) {
      updateItem(targetId, quantity, variantIds, bundleIds);
    } else {
      addItem(activeProduct, quantity, variantIds, bundleIds);
    }

    setStep("cart");
  };

  const handleProductSwitch = (newProduct: Product) => {
    useCartStore.setState({ activeProduct: newProduct });
    setSelectedVariantId(newProduct.variants?.[0]?.id ?? "");
  };

  const handleBundleProductChange = (
    itemIndex: number,
    productId: string,
    bundleItem: BundleItem
  ) => {
    const nextProductIds = [...selectedBundleProductIds];
    nextProductIds[itemIndex] = productId;
    setSelectedBundleProductIds(nextProductIds);

    if (bundleItem.type !== "merchandise") {
      return;
    }

    const selectedProduct = bundleItem.products.find(
      (product) => product.id === productId
    );
    const nextVariantIds = [...selectedBundleVariantIds];
    nextVariantIds[itemIndex] = selectedProduct?.variants?.[0]?.id ?? "";
    setSelectedBundleVariantIds(nextVariantIds);
  };

  const handleBundleVariantChange = (itemIndex: number, variantId: string) => {
    const nextVariantIds = [...selectedBundleVariantIds];
    nextVariantIds[itemIndex] = variantId;
    setSelectedBundleVariantIds(nextVariantIds);
  };

  const selectedVariantLabel =
    activeProduct.variants?.find((variant) => variant.id === selectedVariantId)
      ?.label ?? "Pilih Ukuran";

  return (
    <SelectionStep
      actionLabel={editingItemId ? "Konfirmasi" : "Bayar"}
      activeProduct={activeProduct}
      categorySiblings={categorySiblings}
      isBundling={isBundling}
      onBundleProductChange={handleBundleProductChange}
      onBundleVariantChange={handleBundleVariantChange}
      onPay={handlePay}
      onProductSwitch={handleProductSwitch}
      onQuantityChange={setQuantity}
      onVariantChange={setSelectedVariantId}
      quantity={quantity}
      selectedBundleProductIds={selectedBundleProductIds}
      selectedBundleVariantIds={selectedBundleVariantIds}
      selectedVariantId={selectedVariantId}
      selectedVariantLabel={selectedVariantLabel}
    />
  );
};

const SummaryStepSection = ({
  form,
  onMoveStep,
  onNext,
}: {
  form: ReturnType<typeof useCheckoutForm>;
  onMoveStep: (step: "cart" | "identification" | "summary" | "payment") => void;
  onNext: () => void;
}) => {
  const { items, getTotalPrice, setOrder } = useCartStore();

  const buyerInfo = {
    fullName: form.getFieldValue("fullName"),
    email: form.getFieldValue("email"),
    phone: form.getFieldValue("phone"),
    address: form.getFieldValue("address"),
  };

  const createOrderMutation = useCreateMerchOrderMutation({
    onSuccess: (data) => {
      setOrder({
        orderId: data.orderId,
        status: data.status,
        items: buildOrderSnapshotItems(items),
        totalPrice: data.totalPrice,
        paymentMethod: data.paymentMethod,
        payment: data.payment,
      });

      onNext();
    },
  });

  return (
    <SummaryStep
      buyerInfo={buyerInfo}
      isSubmitting={createOrderMutation.isPending}
      items={items}
      onEditCart={() => onMoveStep("cart")}
      onEditIdentification={() => onMoveStep("identification")}
      onSubmitOrder={() => {
        createOrderMutation.mutate({
          ...buyerInfo,
          items: buildCreateOrderItems(items),
          captchaToken: "dummy-captcha",
          idempotencyKey: createNanoIdWithPrefix("idemp"),
        });
      }}
      totalPrice={getTotalPrice()}
    />
  );
};

const PaymentStepSection = ({ onNext }: { onNext: () => void }) => {
  const { orderId, orderPayment, orderTotalPrice } = useCartStore();
  const statusMutation = useOrderStatusMutation({
    onOrderSynced: onNext,
  });
  const timeLeftSeconds = useCountdownSeconds(paymentWindowSeconds);

  return (
    <PaymentStep
      isCheckingStatus={statusMutation.isPending}
      onCheckStatus={() => statusMutation.mutate()}
      orderId={orderId}
      qrisUrl={resolveOrderQrisUrl(orderPayment)}
      timeLeftSeconds={timeLeftSeconds}
      totalPrice={orderTotalPrice}
    />
  );
};

const PaymentStepManualSection = ({ onNext }: { onNext: () => void }) => {
  const { orderId, orderPayment, orderTotalPrice, setStep } = useCartStore();
  const fileInputId = useId();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const statusMutation = useOrderStatusMutation({
    onOrderSynced: onNext,
  });

  const uploadUrl = resolveOrderUploadUrl(orderPayment);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setSelectedFile(file);
  };

  const handleUploadProof = () => {
    if (uploadUrl && selectedFile) {
      window.open(uploadUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <PaymentStepManual
      canUploadProof={selectedFile !== null}
      fileInputId={fileInputId}
      isCheckingStatus={statusMutation.isPending}
      onBack={() => setStep("summary")}
      onCheckStatus={() => statusMutation.mutate()}
      onFileChange={handleFileChange}
      onUploadProof={handleUploadProof}
      orderId={orderId}
      selectedFileName={selectedFile?.name ?? null}
      totalPrice={orderTotalPrice}
      uploadUrl={uploadUrl}
    />
  );
};

const SuccessStepSection = () => {
  const { clearOrder, closeModal, clearCart } = useCartStore();

  return (
    <SuccessStep
      onClose={() => {
        clearCart();
        clearOrder();
        closeModal();
      }}
    />
  );
};

export const CheckoutModalContainer = () => {
  const {
    items,
    isModalOpen,
    closeModal,
    currentStep,
    setStep,
    orderPayment,
    orderPaymentMethod,
  } = useCartStore();

  const isManualPayment = resolveIsManualPayment(
    orderPaymentMethod,
    orderPayment
  );

  const form = useCheckoutForm(() => setStep("summary"));
  const itemCount = items.reduce(
    (accumulator, item) => accumulator + item.quantity,
    0
  );

  let stepContent: ReactNode;

  switch (currentStep) {
    case "selection":
      stepContent = <SelectionStepSection />;
      break;
    case "cart":
      stepContent = (
        <CartStepSection onNext={() => setStep("identification")} />
      );
      break;
    case "identification":
      stepContent = (
        <IdentificationStepSection form={form} onBack={() => setStep("cart")} />
      );
      break;
    case "summary":
      stepContent = (
        <SummaryStepSection
          form={form}
          onMoveStep={setStep}
          onNext={() => setStep("payment")}
        />
      );
      break;
    case "payment":
      if (isManualPayment) {
        stepContent = (
          <PaymentStepManualSection onNext={() => setStep("success")} />
        );
        break;
      }

      stepContent = <PaymentStepSection onNext={() => setStep("success")} />;
      break;
    default:
      stepContent = <SuccessStepSection />;
  }

  return (
    <CheckoutModal
      currentStep={currentStep}
      isModalOpen={isModalOpen}
      itemCount={itemCount}
      onOpenCart={() => {
        setStep("cart");
        useCartStore.setState({ isModalOpen: true });
      }}
      onOpenChange={(open) => {
        if (open) {
          setStep("cart");
          return;
        }

        closeModal();
      }}
    >
      {stepContent}
    </CheckoutModal>
  );
};
