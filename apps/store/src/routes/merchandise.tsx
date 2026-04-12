import { MerchPageContainer } from "@/features/merchandise/container/merch-page-container";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const merchSearchSchema = z.object({
  filter: z.string().optional(),
});

function RouteComponent() {
  return <MerchPageContainer />;
}

export const Route = createFileRoute("/merchandise")({
  validateSearch: (search) => merchSearchSchema.parse(search),
  component: RouteComponent,
});
