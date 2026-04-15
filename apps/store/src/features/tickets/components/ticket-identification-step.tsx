// Identification step form: captures buyer data using TanStack Form validation.
import { Button } from "@tedx-2026/ui/components/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@tedx-2026/ui/components/field";
import { Input } from "@tedx-2026/ui/components/input";
import { cn } from "@tedx-2026/ui/lib/utils";
import { useTicketIdentificationForm } from "../hooks/use-ticket-identification-form";
import type { TicketBuyer } from "../types/ticket";

type TicketIdentificationStepProps = {
  buyer: TicketBuyer | null;
  onBack: () => void;
  onSubmit: (buyer: TicketBuyer) => void;
};

export const TicketIdentificationStep = ({
  buyer,
  onBack,
  onSubmit,
}: TicketIdentificationStepProps) => {
  const { form } = useTicketIdentificationForm({
    buyer,
    onSubmit,
  });

  return (
    <form
      className="space-y-4"
      id="ticket-identification-form"
      onSubmit={(event) => {
        event.preventDefault();
        form.handleSubmit();
      }}
    >
      <FieldGroup>
        <form.Field name="buyerName">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field className="space-y-1.5">
                <FieldLabel
                  className="font-sans-2 text-sm text-white/85"
                  htmlFor={field.name}
                >
                  Nama Lengkap
                </FieldLabel>
                <Input
                  aria-invalid={isInvalid}
                  className={cn(
                    "h-11 rounded-lg border border-white/20 bg-white px-3 font-sans-2 text-black text-sm outline-none focus:ring-2 focus:ring-[#FF1818]",
                    isInvalid && "border-red-500 ring-1 ring-red-500"
                  )}
                  id={field.name}
                  name={field.name}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  value={field.state.value}
                />
                {isInvalid && (
                  <FieldError
                    className="text-[10px]"
                    errors={field.state.meta.errors}
                  />
                )}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="buyerEmail">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field className="space-y-1.5">
                <FieldLabel
                  className="font-sans-2 text-sm text-white/85"
                  htmlFor={field.name}
                >
                  Email
                </FieldLabel>
                <Input
                  aria-invalid={isInvalid}
                  className={cn(
                    "h-11 rounded-lg border border-white/20 bg-white px-3 font-sans-2 text-black text-sm outline-none focus:ring-2 focus:ring-[#FF1818]",
                    isInvalid && "border-red-500 ring-1 ring-red-500"
                  )}
                  id={field.name}
                  name={field.name}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  type="email"
                  value={field.state.value}
                />
                {isInvalid && (
                  <FieldError
                    className="text-[10px]"
                    errors={field.state.meta.errors}
                  />
                )}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="buyerPhone">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field className="space-y-1.5">
                <FieldLabel
                  className="font-sans-2 text-sm text-white/85"
                  htmlFor={field.name}
                >
                  Nomor Telepon
                </FieldLabel>
                <Input
                  aria-invalid={isInvalid}
                  className={cn(
                    "h-11 rounded-lg border border-white/20 bg-white px-3 font-sans-2 text-black text-sm outline-none focus:ring-2 focus:ring-[#FF1818]",
                    isInvalid && "border-red-500 ring-1 ring-red-500"
                  )}
                  id={field.name}
                  name={field.name}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  value={field.state.value}
                />
                {isInvalid && (
                  <FieldError
                    className="text-[10px]"
                    errors={field.state.meta.errors}
                  />
                )}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="buyerInstansi">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field className="space-y-1.5">
                <FieldLabel
                  className="font-sans-2 text-sm text-white/85"
                  htmlFor={field.name}
                >
                  Institusi
                </FieldLabel>
                <Input
                  aria-invalid={isInvalid}
                  className={cn(
                    "h-11 rounded-lg border border-white/20 bg-white px-3 font-sans-2 text-black text-sm outline-none focus:ring-2 focus:ring-[#FF1818]",
                    isInvalid && "border-red-500 ring-1 ring-red-500"
                  )}
                  id={field.name}
                  name={field.name}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  value={field.state.value}
                />
                {isInvalid && (
                  <FieldError
                    className="text-[10px]"
                    errors={field.state.meta.errors}
                  />
                )}
              </Field>
            );
          }}
        </form.Field>
      </FieldGroup>

      <div className="flex gap-2">
        <Button
          className="flex-1"
          onClick={onBack}
          type="button"
          variant="store-secondary"
        >
          Kembali
        </Button>
        <form.Subscribe>
          {(state) => (
            <Button
              className="flex-1"
              disabled={state.isSubmitting}
              type="submit"
              variant="store-primary"
            >
              Lanjutkan
            </Button>
          )}
        </form.Subscribe>
      </div>
    </form>
  );
};
