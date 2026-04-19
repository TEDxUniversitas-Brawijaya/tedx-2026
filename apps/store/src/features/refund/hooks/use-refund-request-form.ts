import { trpc } from "@/shared/lib/trpc";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import type { RefundOrderInfo, RefundSubmitResponse } from "../types";

type UseRefundRequestFormOptions = {
  refundToken: string;
  paymentMethod: RefundOrderInfo["paymentMethod"];
  onSuccess: (data: RefundSubmitResponse) => void;
};

export const useRefundRequestForm = ({
  refundToken,
  paymentMethod,
  onSuccess,
}: UseRefundRequestFormOptions) => {
  const submitRequestMutation = useMutation(
    trpc.refund.submitRequest.mutationOptions()
  );

  const isManualPayment = paymentMethod === "manual";

  const form = useForm({
    defaultValues: {
      reason: "",
      bankAccountNumber: "",
      bankName: "",
      bankAccountHolder: "",
      paymentProof: null as File | null,
    },
    onSubmit: async ({ value }) => {
      if (isManualPayment && value.paymentProof === null) {
        toast.error("Payment proof is required for manual payment");
        return;
      }

      const formData = new FormData();
      formData.append("refundToken", refundToken);
      formData.append("reason", value.reason);
      formData.append("paymentMethod", paymentMethod);
      formData.append("bankAccountNumber", value.bankAccountNumber);
      formData.append("bankName", value.bankName);
      formData.append("bankAccountHolder", value.bankAccountHolder);

      if (value.paymentProof) {
        formData.append("paymentProof", value.paymentProof);
      }

      await submitRequestMutation.mutateAsync(formData, {
        onSuccess,
        onError: (error) => {
          toast.error("Failed to submit refund request", {
            description: error.message,
          });
        },
      });
    },
  });

  return {
    form,
    isManualPayment,
    isSubmitting: submitRequestMutation.isPending,
  };
};
