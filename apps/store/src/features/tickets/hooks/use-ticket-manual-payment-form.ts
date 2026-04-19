import { trpc } from "@/shared/lib/trpc";
import type { TurnstileInstance } from "@marsidev/react-turnstile";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { useTicketCheckoutStore } from "../stores/use-ticket-checkout-store";

export const useTicketManualPaymentForm = () => {
  const { selectedProduct, quantity, buyer, setOrder, onNextStep } =
    useTicketCheckoutStore();

  const turnstileRef = useRef<TurnstileInstance>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [idempotencyKey] = useState(() => crypto.randomUUID());

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

      if (!captchaToken) {
        toast.error("Mohon selesaikan verifikasi CAPTCHA terlebih dahulu.");
        return;
      }

      const formData = new FormData();
      formData.append("productId", selectedProduct.id);
      formData.append("quantity", quantity.toString());
      formData.append("buyerName", buyer.buyerName);
      formData.append("buyerEmail", buyer.buyerEmail);
      formData.append("phone", buyer.phone);
      formData.append("buyerInstansi", buyer.buyerInstansi);
      formData.append("captchaToken", captchaToken);
      formData.append("idempotencyKey", idempotencyKey);
      formData.append("paymentProof", value.paymentProof);
      formData.append("bundleItemProducts", JSON.stringify([])); // TODO: support bundle item products if needed

      await createOrderMutation.mutateAsync(formData, {
        onSuccess: (response) => {
          setOrder(response);
          onNextStep();
        },
        onError: (error) => {
          // Reset CAPTCHA on error
          turnstileRef.current?.reset();
          setCaptchaToken(null);

          toast.error(error.message || "Gagal membuat pesanan.");
        },
      });
    },
  });

  return {
    ...form,
    handleSubmit: form.handleSubmit,
    turnstileRef,
    captchaToken,
    setCaptchaToken,
  };
};
