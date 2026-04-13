import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { useCartStore } from "../stores/use-cart-store";

export const useManualPaymentForm = () => {
  const { setPaymentProof, onNextStep } = useCartStore();

  const form = useForm({
    defaultValues: {
      paymentProof: null as File | null,
    },
    validators: {
      onSubmit: z.object({
        paymentProof: z
          .instanceof(File)
          .refine((file) => file.size <= 5 * 1024 * 1024, {
            message: "File harus berukuran maksimal 5MB",
          })
          .refine((file) => file.type.startsWith("image/"), {
            message: "File harus berupa gambar",
          })
          .nullable(),
      }),
    },
    onSubmit: ({ value }) => {
      setPaymentProof(value.paymentProof);

      // TODO: Mutate order with payment proof
      onNextStep();
    },
  });

  return {
    ...form,
    handleSubmit: form.handleSubmit,
  };
};
