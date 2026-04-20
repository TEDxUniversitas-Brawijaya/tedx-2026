import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@tedx-2026/ui/components/dialog";
import { Button } from "@tedx-2026/ui/components/button";
import type { Product } from "../types/product";
import { ProductEditForm } from "./product-edit-form";

type ProductEditDialogProps = {
  product: Product;
};

export function ProductEditDialog({ product }: ProductEditDialogProps) {
  return (
    <Dialog>
      <DialogTrigger
        id={`product-edit-open-${product.id}`}
        render={<Button size="sm" variant="outline" />}
      >
        Edit Price &amp; Stock
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-md"
        id={`product-edit-dialog-${product.id}`}
      >
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription className="truncate font-medium text-foreground">
            {product.name}
          </DialogDescription>
        </DialogHeader>
        <ProductEditForm product={product} />
      </DialogContent>
    </Dialog>
  );
}
