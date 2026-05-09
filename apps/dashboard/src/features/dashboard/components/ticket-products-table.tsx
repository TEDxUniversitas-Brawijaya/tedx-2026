import { Badge } from "@tedx-2026/ui/components/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@tedx-2026/ui/components/table";
import { cn } from "@tedx-2026/ui/lib/utils";

type TicketProduct = {
  id: string;
  name: string;
  stock: number | null;
  isActive: boolean;
  quantitySold: number;
  soldPlusRemaining: number | null;
};

type TicketProductsTableProps = {
  products: TicketProduct[];
};

export function TicketProductsTable({ products }: TicketProductsTableProps) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="font-semibold text-base">Ticket Products</h2>
      <div className="rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead className="text-right">Status</TableHead>
              <TableHead className="text-right">Stock Remaining</TableHead>
              <TableHead className="text-right">Sold</TableHead>
              <TableHead className="text-right">Sold + Remaining</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 && (
              <TableRow>
                <TableCell
                  className="h-16 text-center text-muted-foreground"
                  colSpan={5}
                >
                  No ticket products found.
                </TableCell>
              </TableRow>
            )}
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell className="text-right">
                  <Badge variant={product.isActive ? "default" : "outline"}>
                    {product.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {product.stock === null ? (
                    <span className="text-muted-foreground text-xs italic">
                      —
                    </span>
                  ) : (
                    <span
                      className={cn(
                        product.stock <= 5 && "font-bold text-red-500"
                      )}
                    >
                      {product.stock.toLocaleString()}
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {product.quantitySold.toLocaleString()}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {product.soldPlusRemaining === null ? (
                    <span className="text-muted-foreground text-xs italic">
                      —
                    </span>
                  ) : (
                    product.soldPlusRemaining.toLocaleString()
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
