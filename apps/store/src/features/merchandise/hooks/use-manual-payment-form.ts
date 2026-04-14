import { trpc } from "@/shared/lib/trpc";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";
import { useCartStore } from "../stores/use-cart-store";

export const useManualPaymentForm = () => {
  const { onNextStep, items, buyer, setOrder } = useCartStore();

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
      formData.append("captchaToken", "TODO");
      formData.append("idempotencyKey", new Date().toISOString());
      if (value.paymentProof) {
        formData.append("paymentProof", value.paymentProof);
      }

      await createOrderMutation.mutateAsync(formData, {
        onSuccess: (data) => {
          setOrder(data);
          onNextStep();
        },
        onError: (error) => {
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
  };
};
