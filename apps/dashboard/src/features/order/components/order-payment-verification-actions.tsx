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
import { Textarea } from "@tedx-2026/ui/components/textarea";
import { usePaymentVerificationActionForm } from "../hooks/use-payment-verification-form";

type OrderPaymentVerificationActionsProps = {
  orderId: string;
};

export function OrderPaymentVerificationActions({
  orderId,
}: OrderPaymentVerificationActionsProps) {
  const form = usePaymentVerificationActionForm(orderId);

  return (
    <form
      className="space-y-2"
      id="order-payment-verification-reject-form"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleRejectPayment();
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
                  Reason for payment rejection
                </FieldLabel>
                <Textarea
                  aria-invalid={isInvalid}
                  disabled={form.isLoading}
                  id={field.name}
                  name={field.name}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Enter reason for payment rejection"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>
      </FieldGroup>
      <Alert>
        <IconAlertCircle />
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>
          Be careful, when rejecting or approving payment, the user will be
          notified about the action taken. Make sure to provide a valid reason
          when rejecting payment. <strong>THIS ACTION CANNOT BE UNDONE.</strong>
        </AlertDescription>
      </Alert>
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
                id="order-payment-verification-reject-form"
                type="submit"
                variant="destructive"
              >
                {field.isSubmitting ? "Processing..." : "Reject Payment"}
              </Button>
              <Button
                className="flex-1"
                disabled={field.isSubmitting}
                id="order-payment-verification-approve-button"
                onClick={form.handleApprovePayment}
                type="button"
              >
                {field.isSubmitting ? "Processing..." : "Approve Payment"}
              </Button>
            </>
          )}
        </form.Subscribe>
      </Field>
    </form>
  );
}
