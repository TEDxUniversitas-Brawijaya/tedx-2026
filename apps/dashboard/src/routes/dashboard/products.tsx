import { ProductsPage } from "@/features/product/pages/products-page";
import { canAccess, RESOURCES } from "@/shared/lib/permissions";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/products")({
  component: RouteComponent,
  beforeLoad: ({ context }) => {
    const { user } = context;

    if (!canAccess(user.role, RESOURCES.PRODUCT)) {
      redirect({
        to: "/dashboard/home",
        throw: true,
      });
    }
  },
});

function RouteComponent() {
  return <ProductsPage />;
}
