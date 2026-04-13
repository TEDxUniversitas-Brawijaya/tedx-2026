import { queryClient } from "@/shared/lib/query-client";
import { trpc } from "@/shared/lib/trpc";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import z from "zod";

const rejectRefundSchema = z.object({
  reason: z.string().min(1, "Rejection reason is required"),
});

export const useRefundActionForm = (orderId: string) => {
  const processRefundMutation = useMutation(
    trpc.admin.order.processRefund.mutationOptions()
  );

  const form = useForm({
    defaultValues: {
      reason: "",
    },
    validators: {
      onSubmit: rejectRefundSchema,
    },
    onSubmit: async ({ value }) => {
      await processRefundMutation.mutateAsync(
        {
          action: "reject",
          orderId,
          reason: value.reason,
        },
        {
          onError: (error) => {
            toast.error("Failed to reject refund", {
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

            toast.success("Refund rejected");
          },
        }
      );
    },
  });

  const handleApproveRefund = async () => {
    await processRefundMutation.mutateAsync(
      {
        action: "approve",
        orderId,
      },
      {
        onError: (error) => {
          toast.error("Failed to approve refund", {
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

          toast.success("Refund approved");
        },
      }
    );
  };

  return {
    ...form,
    handleRejectRefund: form.handleSubmit,
    handleApproveRefund,
    isLoading: processRefundMutation.isPending,
  };
};
