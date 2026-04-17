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
  const { selectedProduct, quantity, buyer, setOrder, onNextStep } =
    useTicketCheckoutStore();

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

      const formData = new FormData();
      formData.append("productId", selectedProduct.id);
      formData.append("quantity", quantity.toString());
      formData.append("buyerName", buyer.buyerName);
      formData.append("buyerEmail", buyer.buyerEmail);
      formData.append("phone", buyer.phone);
      formData.append("buyerInstansi", buyer.buyerInstansi);
      formData.append("captchaToken", "dummy-captcha-token");
      formData.append("idempotencyKey", generateIdempotencyKey());

      await createOrderMutation.mutateAsync(formData, {
        onSuccess: (response) => {
          setOrder(response);
          onNextStep();
        },
        onError: (error) => {
          toast.error(error.message || "Gagal membuat pesanan.");
        },
      });
    },
  });

  return {
    form,
    isPending: createOrderMutation.isPending,
  };
};
