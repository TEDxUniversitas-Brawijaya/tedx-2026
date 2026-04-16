import { trpc } from "@/shared/lib/trpc";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
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

  const [reason, setReason] = useState("");
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [bankAccountHolder, setBankAccountHolder] = useState("");
  const [paymentProof, setPaymentProof] = useState<File | null>(null);

  const isManualPayment = paymentMethod === "manual";

  const isSubmitDisabled =
    submitRequestMutation.isPending ||
    reason.trim().length === 0 ||
    bankAccountNumber.trim().length === 0 ||
    bankName.trim().length === 0 ||
    bankAccountHolder.trim().length === 0 ||
    (isManualPayment && paymentProof === null);

  const submitRequest = async () => {
    if (isManualPayment && paymentProof === null) {
      toast.error("Payment proof is required for manual payment");
      return;
    }

    const formData = new FormData();
    formData.append("refundToken", refundToken);
    formData.append("reason", reason);
    formData.append("paymentMethod", paymentMethod);
    formData.append("bankAccountNumber", bankAccountNumber);
    formData.append("bankName", bankName);
    formData.append("bankAccountHolder", bankAccountHolder);

    if (paymentProof) {
      formData.append("paymentProof", paymentProof);
    }

    await submitRequestMutation.mutateAsync(formData, {
      onSuccess,
      onError: (error) => {
        toast.error("Failed to submit refund request", {
          description: error.message,
        });
      },
    });
  };

  return {
    reason,
    setReason,
    bankAccountNumber,
    setBankAccountNumber,
    bankName,
    setBankName,
    bankAccountHolder,
    setBankAccountHolder,
    paymentProof,
    setPaymentProof,
    isManualPayment,
    isSubmitDisabled,
    isSubmitting: submitRequestMutation.isPending,
    submitRequest,
  };
};
