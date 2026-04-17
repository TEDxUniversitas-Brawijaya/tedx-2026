import { trpc } from "@/shared/lib/trpc";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";
import { useTicketCheckoutStore } from "../stores/use-ticket-checkout-store";

export const generateIdempotencyKey = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `ticket-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
};

export const useTicketManualPaymentForm = () => {
  const { selectedProduct, quantity, buyer, setOrder, onNextStep } =
    useTicketCheckoutStore();

  const createOrderMutation = useMutation(
    trpc.ticket.createOrder.mutationOptions()
  );

  const form = useForm({
    defaultValues: {
      paymentProof: null as File | null,
    },
    validators: {
      onSubmit: z.object({
        paymentProof: z
          .instanceof(File, {
            error: "Silakan upload bukti pembayaran",
          })
          .refine((file) => file.size <= 5 * 1024 * 1024, {
            message: "Ukuran file maksimum adalah 5MB",
          })
          .refine((file) => file.type.startsWith("image/"), {
            message: "File harus berupa gambar",
          }),
      }),
    },
    onSubmit: async ({ value }) => {
      if (!(selectedProduct && buyer)) {
        toast.error("Data pembelian belum lengkap.");
        return;
      }

      if (!value.paymentProof) {
        toast.error("Silakan upload bukti pembayaran terlebih dahulu.");
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
      formData.append("paymentProof", value.paymentProof);

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
    ...form,
    handleSubmit: form.handleSubmit,
    isSubmitting: createOrderMutation.isPending,
  };
};
