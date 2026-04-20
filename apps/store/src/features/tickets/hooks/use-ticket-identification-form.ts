import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { useTicketCheckoutStore } from "../stores/use-ticket-checkout-store";

const ticketIdentificationSchema = z.object({
  buyerName: z.string().min(1, "Nama lengkap wajib diisi"),
  buyerEmail: z.email("Format email tidak valid"),
  phone: z
    .e164("Nomor telepon harus dalam format (+628123456789)")
    .min(10)
    .max(20),
  buyerInstansi: z.string().min(1, "Institusi wajib diisi"),
});

export const useTicketIdentificationForm = () => {
  const { buyer, setBuyer, onNextStep } = useTicketCheckoutStore();

  const form = useForm({
    defaultValues: {
      buyerName: buyer?.buyerName ?? "",
      buyerEmail: buyer?.buyerEmail ?? "",
      phone: buyer?.phone ?? "",
      buyerInstansi: buyer?.buyerInstansi ?? "",
    },
    validators: {
      onSubmit: ticketIdentificationSchema,
    },
    onSubmit: ({ value }) => {
      setBuyer(value);
      onNextStep();
    },
  });

  return form;
};
