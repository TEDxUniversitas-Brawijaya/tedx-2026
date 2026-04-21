import { queryClient } from "@/shared/lib/query-client";
import { trpc } from "@/shared/lib/trpc";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";
import type { Product } from "../types/product";

const editProductSchema = z.object({
  price: z.number().int().positive("Price must be a positive integer"),
  stock: z.number().int().nonnegative("Stock must be 0 or greater").nullable(),
});

export const useProductEditForm = (product: Product) => {
  const updateMutation = useMutation(
    trpc.admin.product.update.mutationOptions()
  );

  const form = useForm({
    defaultValues: {
      price: product.price,
      stock: product.stock,
    },
    validators: {
      onSubmit: editProductSchema,
    },
    onSubmit: async ({ value }) => {
      await updateMutation.mutateAsync(
        {
          productId: product.id,
          price: value.price,
          stock: value.stock ?? undefined,
        },
        {
          onError: (error) => {
            toast.error("Failed to update product", {
              description: error.message,
            });
          },
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: trpc.admin.product.list.queryKey(),
            });
            toast.success("Product updated successfully");
          },
        }
      );
    },
  });

  return {
    ...form,
    handleSubmit: form.handleSubmit,
    isLoading: updateMutation.isPending,
  };
};
