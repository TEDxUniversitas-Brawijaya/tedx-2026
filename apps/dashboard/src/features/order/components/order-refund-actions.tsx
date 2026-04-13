import { Button } from "@tedx-2026/ui/components/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@tedx-2026/ui/components/field";
import { Textarea } from "@tedx-2026/ui/components/textarea";
import { useRefundActionForm } from "../hooks/use-refund-action-form";

type OrderRefundActionsProps = {
  orderId: string;
};

export function OrderRefundActions({ orderId }: OrderRefundActionsProps) {
  const form = useRefundActionForm(orderId);

  return (
    <form
      className="space-y-2"
      id="order-refund-reject-form"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleRejectRefund();
      }}
    >
      <FieldGroup>
        <form.Field name="reason">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>
                  Reason for refund rejection
                </FieldLabel>
                <Textarea
                  aria-invalid={isInvalid}
                  disabled={form.isLoading}
                  id={field.name}
                  name={field.name}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Enter reason for refund rejection"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>
      </FieldGroup>
      <Field
        className="flex flex-row items-center gap-2"
        orientation="horizontal"
      >
        <form.Subscribe>
          {(field) => (
            <>
              <Button
                className="flex-1"
                disabled={field.isSubmitting}
                id="order-refund-reject-form"
                type="submit"
                variant="destructive"
              >
                {field.isSubmitting ? "Processing..." : "Reject Refund"}
              </Button>
              <Button
                className="flex-1"
                disabled={field.isSubmitting}
                id="order-refund-approve-button"
                onClick={form.handleApproveRefund}
                type="button"
              >
                {field.isSubmitting ? "Processing..." : "Approve Refund"}
              </Button>
            </>
          )}
        </form.Subscribe>
      </Field>
    </form>
  );
}
