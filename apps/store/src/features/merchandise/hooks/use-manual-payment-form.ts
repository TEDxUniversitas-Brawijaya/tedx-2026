import { trpc } from "@/shared/lib/trpc";
import type { TurnstileInstance } from "@marsidev/react-turnstile";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { useCartStore } from "../stores/use-cart-store";

export const useManualPaymentForm = () => {
  const { onNextStep, items, buyer, setOrder } = useCartStore();

  const turnstileRef = useRef<TurnstileInstance>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [idempotencyKey] = useState(() => crypto.randomUUID());

  const createOrderMutation = useMutation(
    trpc.merch.createOrder.mutationOptions()
  );

  const form = useForm({
    defaultValues: {
      paymentProof: null as File | null,
    },
    validators: {
      onSubmit: z.object({
        paymentProof: z
          .instanceof(File, {
            error: "Payment proof is required",
          })
          .refine((file) => file.size <= 5 * 1024 * 1024, {
            message: "File harus berukuran maksimal 5MB",
          })
          .refine((file) => file.type.startsWith("image/"), {
            message: "File harus berupa gambar",
          }),
      }),
    },
    onSubmit: async ({ value }) => {
      if (!buyer) {
        throw new Error("Buyer information is missing");
      }

      if (!captchaToken) {
        toast.error("Mohon selesaikan verifikasi CAPTCHA terlebih dahulu.");
        return;
      }

      const formData = new FormData();
      formData.append("fullName", buyer.fullName);
      formData.append("email", buyer.email);
      formData.append("phone", buyer.phone);
      formData.append("address", buyer.address);
      formData.append(
        "items",
        JSON.stringify(
          items.map((item) => ({
            productId: item.id,
            variantIds: item.selectedVariants?.map((v) => v.id),
            bundleItemProducts: item.selectedBundleProducts?.map((p) => ({
              productId: p.id,
              variantIds: p.selectedVariants?.map((v) => v.id),
            })),
            quantity: item.quantity,
          }))
        )
      );
      formData.append("captchaToken", captchaToken);
      formData.append("idempotencyKey", idempotencyKey);
      if (value.paymentProof) {
        formData.append("paymentProof", value.paymentProof);
      }

      await createOrderMutation.mutateAsync(formData, {
        onSuccess: (data) => {
          setOrder(data);
          onNextStep();
        },
        onError: (error) => {
          // Reset CAPTCHA on error
          turnstileRef.current?.reset();
          setCaptchaToken(null);

          toast.error("Gagal membuat pesanan. Silakan coba lagi.", {
            description: error.message,
          });
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
