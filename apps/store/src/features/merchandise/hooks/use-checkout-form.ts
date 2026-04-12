import { useForm } from "@tanstack/react-form";
import { checkoutSchema, type CheckoutFormData } from "../types/types";

export const useCheckoutForm = (onSubmit: () => void) =>
  useForm({
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
    } satisfies CheckoutFormData,
    validators: {
      onSubmit: checkoutSchema,
    },
    onSubmit,
  });

export type CheckoutForm = ReturnType<typeof useCheckoutForm>;
