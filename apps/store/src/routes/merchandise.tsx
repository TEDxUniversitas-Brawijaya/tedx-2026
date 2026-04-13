import { CategorySection } from "@/features/merchandise/components/category-section";
import { HeroSection } from "@/features/merchandise/components/hero-section";
import { ProductListSection } from "@/features/merchandise/components/product-list-section";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const merchSearchSchema = z.object({
  filter: z.string().optional(),
});

export const Route = createFileRoute("/merchandise")({
  validateSearch: merchSearchSchema,
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main>
      <HeroSection />
      <CategorySection />
      <ProductListSection />
    </main>
  );
}
