// Checkout container: orchestrates store state, bundle options, and createOrder mutation.
import { trpc } from "@/shared/lib/trpc";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTicketBundleOptions } from "../hooks/use-ticket-bundle-options";
import { useTicketCheckoutStore } from "../stores/use-ticket-checkout-store";
import type { TicketBuyer } from "../types/ticket";
import { TicketCheckoutDialog } from "../components/ticket-checkout-dialog";

const generateIdempotencyKey = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `ticket-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
};

export const TicketCheckoutContainer = () => {
  const {
    isCheckoutOpen,
    checkoutStep,
    selectedProduct,
    quantity,
    selectedBundleItemId,
    buyer,
    order,
    closeCheckout,
    setCheckoutStep,
    setQuantity,
    setSelectedBundleItemId,
    setBuyer,
    setOrder,
    openOrderDetail,
  } = useTicketCheckoutStore();

  const createOrderMutation = useMutation(
    trpc.ticket.createOrder.mutationOptions()
  );
  const bundleOptions = useTicketBundleOptions(selectedProduct);

  const onNextFromSelection = () => {
    if (bundleOptions.length > 0 && !selectedBundleItemId) {
      toast.error("Pilih item bundling terlebih dahulu.");
      return;
    }

    setCheckoutStep("identification");
  };

  const onBuyerSubmit = (payload: TicketBuyer) => {
    if (
      !(
        payload.buyerName &&
        payload.buyerEmail &&
        payload.buyerPhone &&
        payload.buyerInstansi
      )
    ) {
      toast.error("Data diri belum lengkap.");
      return;
    }

    setBuyer(payload);
    setCheckoutStep("summary");
  };

  const onCreateOrder = () => {
    if (!(selectedProduct && buyer)) {
      return;
    }

    createOrderMutation.mutate(
      {
        productId: selectedProduct.id,
        quantity,
        selectedBundleItemId,
        ...buyer,
        captchaToken: "dummy-captcha-token",
        idempotencyKey: generateIdempotencyKey(),
        paymentProof: undefined,
      },
      {
        onSuccess: (response) => {
          setOrder(response);
          setCheckoutStep("payment");
        },
        onError: (error) => {
          toast.error(error.message || "Gagal membuat pesanan.");
        },
      }
    );
  };

  return (
    <TicketCheckoutDialog
      bundleOptions={bundleOptions}
      buyer={buyer}
      isOpen={isCheckoutOpen}
      isSubmitting={createOrderMutation.isPending}
      onBackToIdentification={() => setCheckoutStep("identification")}
      onBackToSelection={() => setCheckoutStep("selection")}
      onBundleSelect={setSelectedBundleItemId}
      onBuyerSubmit={onBuyerSubmit}
      onCreateOrder={onCreateOrder}
      onDecrease={() => setQuantity(quantity - 1)}
      onIncrease={() => setQuantity(quantity + 1)}
      onNextFromSelection={onNextFromSelection}
      onOpenChange={(open) => {
        if (!open) {
          closeCheckout();
        }
      }}
      onOpenOrderDetail={() => {
        closeCheckout();
        openOrderDetail();
      }}
      order={order}
      product={selectedProduct}
      quantity={quantity}
      selectedBundleItemId={selectedBundleItemId}
      step={checkoutStep}
    />
  );
};
