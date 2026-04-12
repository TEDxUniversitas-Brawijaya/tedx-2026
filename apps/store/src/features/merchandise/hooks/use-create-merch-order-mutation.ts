import { useMutation } from "@tanstack/react-query";
import { trpc } from "@/shared/lib/trpc";

type CreateMerchOrderMutationOptions = Parameters<
  typeof trpc.merch.createOrder.mutationOptions
>[0];

export const useCreateMerchOrderMutation = (
  options: CreateMerchOrderMutationOptions
) => useMutation(trpc.merch.createOrder.mutationOptions(options));
