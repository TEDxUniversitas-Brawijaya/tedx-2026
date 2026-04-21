import { ProductsGridContainer } from "@/features/product/containers/products-grid-container";
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
  return (
    <div className="flex flex-col gap-4 p-4 lg:p-6">
      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-lg md:text-xl">Product Management</h1>
      </div>

      <ProductsGridContainer />
    </div>
  );
}
