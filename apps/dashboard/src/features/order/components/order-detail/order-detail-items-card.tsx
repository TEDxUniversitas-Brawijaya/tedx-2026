import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@tedx-2026/ui/components/table";
import type { DetailOrder } from "../../types/order";
import { formatCurrency } from "../../utils/formatter";

type OrderDetailItemsCardProps = {
  items: DetailOrder["items"];
};

export function OrderDetailItemsCard({ items }: OrderDetailItemsCardProps) {
  return (
    <div className="rounded-lg border" id="order-detail-items">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order Item ID</TableHead>
            <TableHead>Product ID</TableHead>
            <TableHead>Item</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Qty</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Variants</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell id={`order-detail-item-${item.id}-id`}>
                {item.id}
              </TableCell>
              <TableCell id={`order-detail-item-${item.id}-product-id`}>
                {item.productId}
              </TableCell>
              <TableCell id={`order-detail-item-${item.id}-name`}>
                {item.snapshotName}
              </TableCell>
              <TableCell id={`order-detail-item-${item.id}-type`}>
                {item.snapshotType}
              </TableCell>
              <TableCell id={`order-detail-item-${item.id}-quantity`}>
                {item.quantity}
              </TableCell>
              <TableCell id={`order-detail-item-${item.id}-price`}>
                {formatCurrency(item.snapshotPrice)}
              </TableCell>
              <TableCell>
                <span id={`order-detail-item-${item.id}-variants`}>
                  {item.snapshotVariants?.length
                    ? item.snapshotVariants
                        .map((variant) => `${variant.label} (${variant.type})`)
                        .join(", ")
                    : "-"}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
