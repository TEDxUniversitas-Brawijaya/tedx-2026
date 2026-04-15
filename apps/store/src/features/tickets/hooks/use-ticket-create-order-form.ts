import { trpc } from "@/shared/lib/trpc";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTicketCheckoutStore } from "../stores/use-ticket-checkout-store";

const generateIdempotencyKey = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `ticket-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
};

export const useTicketCreateOrderForm = () => {
  const {
    selectedProduct,
    quantity,
    selectedBundleItemId,
    buyer,
    setOrder,
    onNextStep,
  } = useTicketCheckoutStore();

  const createOrderMutation = useMutation(
    trpc.ticket.createOrder.mutationOptions()
  );

  const form = useForm({
    defaultValues: {},
    onSubmit: async () => {
      if (!(selectedProduct && buyer)) {
        toast.error("Data pembelian belum lengkap.");
        return;
      }

      await createOrderMutation.mutateAsync(
        {
          productId: selectedProduct.id,
          quantity,
          selectedBundleItemId,
          buyerName: buyer.buyerName,
          buyerEmail: buyer.buyerEmail,
          phone: buyer.phone,
          buyerInstansi: buyer.buyerInstansi,
          captchaToken: "dummy-captcha-token",
          idempotencyKey: generateIdempotencyKey(),
          paymentProof: undefined,
        },
        {
          onSuccess: (response) => {
            setOrder(response);
            onNextStep();
          },
          onError: (error) => {
            toast.error(error.message || "Gagal membuat pesanan.");
          },
        }
      );
    },
  });

  return {
    form,
    isPending: createOrderMutation.isPending,
  };
};
