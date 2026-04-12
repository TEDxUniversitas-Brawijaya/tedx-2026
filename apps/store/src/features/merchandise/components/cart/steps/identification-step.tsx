import { DialogHeader, DialogTitle } from "@tedx-2026/ui/components/dialog";
import { Input } from "@tedx-2026/ui/components/input";
import { Textarea } from "@tedx-2026/ui/components/textarea";
import { Button } from "@tedx-2026/ui/components/button";
import { FieldError } from "@tedx-2026/ui/components/field";
import type { CheckoutForm } from "@/features/merchandise/hooks/use-checkout-form";
import type { IdentificationStepViewProps } from "@/features/merchandise/types/merch-view";
import type { CheckoutFormData } from "../../../types/checkout";

type CheckoutFieldRenderProps = {
  name: keyof CheckoutFormData;
  state: {
    value: string;
    meta: {
      errors: unknown[];
    };
  };
  handleBlur: () => void;
  handleChange: (value: string) => void;
};

const normalizeFieldErrors = (errors: unknown[]) =>
  errors
    .map((error) => {
      if (typeof error === "string") {
        return { message: error };
      }

      if (error && typeof error === "object" && "message" in error) {
        const message = (error as { message?: unknown }).message;
        if (typeof message === "string") {
          return { message };
        }
        if (message) {
          return { message: String(message) };
        }
      }

      return undefined;
    })
    .filter(Boolean) as { message?: string }[];

const inputBaseClassName =
  "h-12 rounded-xl border-white/10 bg-white text-sm text-black placeholder:text-neutral-500 focus:ring-[#FF1818] sm:h-14 sm:text-base";
const inputErrorClassName = "border-red-500 ring-1 ring-red-500";
const textareaBaseClassName =
  "min-h-24 rounded-xl border-white/10 bg-white px-3 py-3 text-sm text-black placeholder:text-neutral-500 focus:ring-[#FF1818] sm:min-h-28 sm:px-4 sm:py-4 sm:text-base";
const textareaErrorClassName = "border-red-500 ring-1 ring-red-500";

const getInputClassName = (hasError: boolean) =>
  `${inputBaseClassName} ${hasError ? inputErrorClassName : ""}`;

const getTextareaClassName = (hasError: boolean) =>
  `${textareaBaseClassName} ${hasError ? textareaErrorClassName : ""}`;

export function IdentificationStep({
  form,
  hasSubmitted,
  onBack,
  onSubmit,
}: IdentificationStepViewProps<CheckoutForm>) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <DialogHeader>
        <DialogTitle className="font-normal font-serif-2 text-lg sm:text-xl">
          Form Data Diri
        </DialogTitle>
      </DialogHeader>

      <form className="space-y-4 sm:space-y-6" onSubmit={onSubmit}>
        <div className="space-y-4 sm:space-y-6">
          <form.Field name="fullName">
            {(field: CheckoutFieldRenderProps) => {
              const errorMessages = normalizeFieldErrors(
                field.state.meta.errors
              );
              const hasError = hasSubmitted && errorMessages.length > 0;
              const errorId = `${field.name}-error`;

              return (
                <div className="space-y-1.5 sm:space-y-2">
                  <label
                    className="text-[#E0E0E0] text-sm sm:text-xs"
                    htmlFor={field.name}
                  >
                    Nama Lengkap
                  </label>
                  <Input
                    aria-describedby={hasError ? errorId : undefined}
                    aria-invalid={hasError}
                    autoComplete="name"
                    className={getInputClassName(hasError)}
                    id={field.name}
                    name={field.name}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Masukkan nama lengkap"
                    required
                    value={field.state.value}
                  />
                  {hasError && (
                    <FieldError
                      className="pl-1 text-[10px]"
                      errors={errorMessages}
                      id={errorId}
                    />
                  )}
                </div>
              );
            }}
          </form.Field>
          <form.Field name="email">
            {(field: CheckoutFieldRenderProps) => {
              const errorMessages = normalizeFieldErrors(
                field.state.meta.errors
              );
              const hasError = hasSubmitted && errorMessages.length > 0;
              const errorId = `${field.name}-error`;

              return (
                <div className="space-y-1.5 sm:space-y-2">
                  <label
                    className="text-[#E0E0E0] text-sm sm:text-xs"
                    htmlFor={field.name}
                  >
                    Email
                  </label>
                  <Input
                    aria-describedby={hasError ? errorId : undefined}
                    aria-invalid={hasError}
                    autoComplete="email"
                    className={getInputClassName(hasError)}
                    id={field.name}
                    name={field.name}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="contoh@email.com"
                    required
                    type="email"
                    value={field.state.value}
                  />
                  {hasError && (
                    <FieldError
                      className="pl-1 text-[10px]"
                      errors={errorMessages}
                      id={errorId}
                    />
                  )}
                </div>
              );
            }}
          </form.Field>
          <form.Field name="phone">
            {(field: CheckoutFieldRenderProps) => {
              const errorMessages = normalizeFieldErrors(
                field.state.meta.errors
              );
              const hasError = hasSubmitted && errorMessages.length > 0;
              const errorId = `${field.name}-error`;

              return (
                <div className="space-y-1.5 sm:space-y-2">
                  <label
                    className="text-[#E0E0E0] text-sm sm:text-xs"
                    htmlFor={field.name}
                  >
                    Nomor Telepon
                  </label>
                  <Input
                    aria-describedby={hasError ? errorId : undefined}
                    aria-invalid={hasError}
                    autoComplete="tel"
                    className={getInputClassName(hasError)}
                    id={field.name}
                    inputMode="tel"
                    name={field.name}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="0812xxxx"
                    required
                    value={field.state.value}
                  />
                  {hasError && (
                    <FieldError
                      className="pl-1 text-[10px]"
                      errors={errorMessages}
                      id={errorId}
                    />
                  )}
                </div>
              );
            }}
          </form.Field>
          <form.Field name="address">
            {(field: CheckoutFieldRenderProps) => {
              const errorMessages = normalizeFieldErrors(
                field.state.meta.errors
              );
              const hasError = hasSubmitted && errorMessages.length > 0;
              const errorId = `${field.name}-error`;

              return (
                <div className="space-y-1.5 sm:space-y-2">
                  <label
                    className="text-[#E0E0E0] text-sm sm:text-xs"
                    htmlFor={field.name}
                  >
                    Alamat
                  </label>
                  <Textarea
                    aria-describedby={hasError ? errorId : undefined}
                    aria-invalid={hasError}
                    autoComplete="street-address"
                    className={getTextareaClassName(hasError)}
                    id={field.name}
                    name={field.name}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Jl. Merah Putih No. 1..."
                    required
                    rows={3}
                    value={field.state.value}
                  />
                  {hasError && (
                    <FieldError
                      className="pl-1 text-[10px]"
                      errors={errorMessages}
                      id={errorId}
                    />
                  )}
                </div>
              );
            }}
          </form.Field>
        </div>

        <div className="flex gap-2 border-white/10 border-t pt-4 sm:gap-4 sm:pt-6">
          <Button
            className="flex-1"
            onClick={onBack}
            size="checkout"
            type="button"
            variant="store-secondary"
          >
            Kembali
          </Button>
          <Button
            className="flex-1"
            size="checkout"
            type="submit"
            variant="store-primary"
          >
            Lanjutkan
          </Button>
        </div>
      </form>
    </div>
  );
}
