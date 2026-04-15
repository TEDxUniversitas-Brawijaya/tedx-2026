// Identification form hook: configures TanStack Form schema and submit behavior.
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import type { TicketBuyer } from "../types/ticket";

const ticketIdentificationSchema = z.object({
  buyerName: z.string().min(1, "Nama lengkap wajib diisi"),
  buyerEmail: z.email("Format email tidak valid"),
  buyerPhone: z
    .string()
    .min(10, "Nomor telepon minimal 10 digit")
    .max(20, "Nomor telepon maksimal 20 digit"),
  buyerInstansi: z.string().min(1, "Institusi wajib diisi"),
});

export const useTicketIdentificationForm = ({
  buyer,
  onSubmit,
}: {
  buyer: TicketBuyer | null;
  onSubmit: (buyer: TicketBuyer) => void;
}) => {
  const form = useForm({
    defaultValues: {
      buyerName: buyer?.buyerName ?? "",
      buyerEmail: buyer?.buyerEmail ?? "",
      buyerPhone: buyer?.buyerPhone ?? "",
      buyerInstansi: buyer?.buyerInstansi ?? "",
    },
    validators: {
      onSubmit: ticketIdentificationSchema,
    },
    onSubmit: ({ value }) => {
      onSubmit(value);
    },
  });

  return {
    form,
  };
};
