import MerchContainer from "@/features/merchandise/container/merch-container";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const merchSearchSchema = z.object({
  filter: z.string().optional(),
});

export const Route = createFileRoute("/merchandise")({
  validateSearch: (search) => merchSearchSchema.parse(search),
  component: MerchContainer,
});
