import { ProductsGridContainer } from "../containers/products-grid-container";

export function ProductsPage() {
  return (
    <div className="flex flex-col gap-4 p-4 lg:p-6">
      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-lg md:text-xl">Product Management</h1>
      </div>

      <ProductsGridContainer />
    </div>
  );
}
