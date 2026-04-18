import { capitalize } from "@/shared/lib/string";
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

function getItemDetails(item: DetailOrder["items"][number]) {
  if (item.snapshot.variants && item.snapshot.variants.length > 0) {
    return item.snapshot.variants
      .map(
        (variant) => `${capitalize(variant.type)}: ${capitalize(variant.label)}`
      )
      .join(", ");
  }

  if (item.snapshot.bundleProducts && item.snapshot.bundleProducts.length > 0) {
    return item.snapshot.bundleProducts
      .map((bundleItem) => {
        const variants = bundleItem.selectedVariants;

        if (variants && variants.length > 0) {
          return `${bundleItem.name} ${variants
            .map(
              (variant) =>
                `(${capitalize(variant.type)}: ${capitalize(variant.label)})`
            )
            .join(", ")}`;
        }

        return bundleItem.name;
      })
      .join("; ");
  }

  return null;
}

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
            <TableHead>Variants/Bundle Items</TableHead>
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
                {item.snapshot.name}
              </TableCell>
              <TableCell id={`order-detail-item-${item.id}-type`}>
                {item.snapshot.type}
              </TableCell>
              <TableCell id={`order-detail-item-${item.id}-quantity`}>
                {item.quantity}
              </TableCell>
              <TableCell id={`order-detail-item-${item.id}-price`}>
                {formatCurrency(item.snapshot.price)}
              </TableCell>
              <TableCell>
                <span id={`order-detail-item-${item.id}-variants`}>
                  {getItemDetails(item) ?? "-"}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
