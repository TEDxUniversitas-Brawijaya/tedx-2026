import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@tedx-2026/ui/components/table";
import type { OrderDetail } from "../../types/order";
import { formatCurrency } from "../../utils/order-management";
import {
  useOrderDetailStore,
  type OrderDetailStoreState,
} from "../../stores/use-order-detail-store";

export function OrderDetailItemsCard() {
  const order = useOrderDetailStore(
    (state: OrderDetailStoreState) => state.orderDetail
  );

  if (!order) {
    return null;
  }

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
          {order.items.map((item: OrderDetail["items"][number]) => (
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
                        .map(
                          (
                            variant: NonNullable<
                              OrderDetail["items"][number]["snapshotVariants"]
                            >[number]
                          ) => `${variant.type}: ${variant.label}`
                        )
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
