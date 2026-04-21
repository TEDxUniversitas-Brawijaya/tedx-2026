import { IconAlertCircle } from "@tabler/icons-react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@tedx-2026/ui/components/alert";
import { Button } from "@tedx-2026/ui/components/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@tedx-2026/ui/components/field";
import { Input } from "@tedx-2026/ui/components/input";
import { useProductEditForm } from "../hooks/use-product-edit-form";
import type { Product } from "../types/product";

type ProductEditFormProps = {
  product: Product;
};

export function ProductEditForm({ product }: ProductEditFormProps) {
  const isBundle = product.type === "ticket_bundle";
  const form = useProductEditForm(product);

  return (
    <form
      className="space-y-4"
      id={`product-edit-form-${product.id}`}
      onSubmit={async (e) => {
        e.preventDefault();
        e.stopPropagation();
        await form.handleSubmit();
      }}
    >
      <Alert>
        <IconAlertCircle />
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>
          Changing price or stock only affects future purchases. Existing orders
          use a product snapshot and are{" "}
          <strong>not affected by this change.</strong>
        </AlertDescription>
      </Alert>

      <FieldGroup>
        <form.Field name="price">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={`price-${product.id}`}>
                  Price (IDR)
                </FieldLabel>
                <Input
                  aria-invalid={isInvalid}
                  disabled={form.isLoading}
                  id={`price-${product.id}`}
                  inputMode="numeric"
                  min={1}
                  name={field.name}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(Number(e.target.value))}
                  value={field.state.value ?? ""}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="stock">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={`stock-${product.id}`}>
                  Stock{" "}
                  {isBundle && (
                    <span className="text-muted-foreground text-xs">
                      (not editable for bundles)
                    </span>
                  )}
                </FieldLabel>
                <Input
                  aria-invalid={isInvalid}
                  disabled={form.isLoading || isBundle}
                  id={`stock-${product.id}`}
                  inputMode="numeric"
                  min={0}
                  name={field.name}
                  onBlur={field.handleBlur}
                  onChange={(e) =>
                    field.handleChange(
                      e.target.value === "" ? null : Number(e.target.value)
                    )
                  }
                  placeholder={isBundle ? "Managed by bundle" : "Enter stock"}
                  value={field.state.value ?? ""}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>
      </FieldGroup>

      <form.Subscribe>
        {(state) => (
          <Button
            className="w-full"
            disabled={state.isSubmitting || form.isLoading}
            id={`product-edit-submit-${product.id}`}
            type="submit"
          >
            {state.isSubmitting || form.isLoading
              ? "Saving..."
              : "Save Changes"}
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}
