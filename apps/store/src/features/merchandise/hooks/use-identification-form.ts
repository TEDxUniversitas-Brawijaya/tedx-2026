import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { useCartStore } from "../stores/use-cart-store";

export const useIdentificationForm = () => {
  const { setBuyer, onNextStep, buyer } = useCartStore();

  const form = useForm({
    defaultValues: {
      fullName: buyer?.fullName ?? "",
      email: buyer?.email ?? "",
      phone: buyer?.phone ?? "",
      address: buyer?.address ?? "",
    },
    validators: {
      onSubmit: z.object({
        fullName: z.string().min(1, "Nama lengkap harus diisi"),
        email: z.email("Email tidak valid"),
        phone: z
          .e164("Nomor telepon harus dalam format (+628123456789)")
          .min(10)
          .max(20),
        address: z.string().min(1, "Alamat harus diisi"),
      }),
    },
    onSubmit: ({ value }) => {
      setBuyer(value);
      onNextStep();
    },
  });

  return {
    ...form,
    handleSubmit: form.handleSubmit,
  };
};
