import { queryClient } from "@/shared/lib/query-client";
import { trpc } from "@/shared/lib/trpc";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import z from "zod";

const rejectPaymentSchema = z.object({
  reason: z.string().min(1, "Rejection reason is required"),
});

export const usePaymentVerificationActionForm = (orderId: string) => {
  const processPaymentMutation = useMutation(
    trpc.admin.order.verifyPayment.mutationOptions()
  );

  const form = useForm({
    defaultValues: {
      reason: "",
    },
    validators: {
      onSubmit: rejectPaymentSchema,
    },
    onSubmit: async ({ value }) => {
      await processPaymentMutation.mutateAsync(
        {
          action: "reject",
          orderId,
          reason: value.reason,
        },
        {
          onError: (error) => {
            toast.error("Failed to reject payment", {
              description: error.message,
            });
          },
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: trpc.admin.order.getById.queryKey({ orderId }),
            });

            queryClient.invalidateQueries({
              queryKey: trpc.admin.order.list.queryKey(),
            });

            toast.success("Payment rejected");
          },
        }
      );
    },
  });

  const handleApprovePayment = async () => {
    await processPaymentMutation.mutateAsync(
      {
        action: "approve",
        orderId,
      },
      {
        onError: (error) => {
          toast.error("Failed to approve payment", {
            description: error.message,
          });
        },
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: trpc.admin.order.getById.queryKey({ orderId }),
          });

          queryClient.invalidateQueries({
            queryKey: trpc.admin.order.list.queryKey(),
          });

          toast.success("Payment approved");
        },
      }
    );
  };

  return {
    ...form,
    handleRejectPayment: form.handleSubmit,
    handleApprovePayment,
    isLoading: processPaymentMutation.isPending,
  };
};
