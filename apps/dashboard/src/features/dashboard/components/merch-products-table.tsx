import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@tedx-2026/ui/components/table";

type MerchProduct = {
  productId: string;
  name: string;
  quantitySold: number;
  belumPickup: number;
};

type MerchProductsTableProps = {
  products: MerchProduct[];
};

export function MerchProductsTable({ products }: MerchProductsTableProps) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="font-semibold text-base">Merch Products</h2>
      <div className="rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead className="text-right">Sold</TableHead>
              <TableHead className="text-right">Belum Pickup</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 && (
              <TableRow>
                <TableCell
                  className="h-16 text-center text-muted-foreground"
                  colSpan={3}
                >
                  No merch orders yet.
                </TableCell>
              </TableRow>
            )}
            {products.map((product) => (
              <TableRow key={product.productId}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell className="text-right tabular-nums">
                  {product.quantitySold.toLocaleString()}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  <span
                    className={
                      product.belumPickup > 0
                        ? "font-medium text-orange-500"
                        : ""
                    }
                  >
                    {product.belumPickup.toLocaleString()}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
