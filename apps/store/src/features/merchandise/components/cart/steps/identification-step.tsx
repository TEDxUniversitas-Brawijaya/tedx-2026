import { Button } from "@tedx-2026/ui/components/button";
import { DialogHeader, DialogTitle } from "@tedx-2026/ui/components/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@tedx-2026/ui/components/field";
import { Input } from "@tedx-2026/ui/components/input";
import { Textarea } from "@tedx-2026/ui/components/textarea";
import { cn } from "@tedx-2026/ui/lib/utils";
import { useIdentificationForm } from "../../../hooks/use-identification-form";
import { useCartStore } from "../../../stores/use-cart-store";

export function IdentificationStep() {
  const { onPrevStep } = useCartStore();
  const form = useIdentificationForm();

  return (
    <div className="flex max-h-[80vh] flex-col gap-y-4 sm:gap-y-6">
      <DialogHeader>
        <DialogTitle className="font-normal font-serif-2 text-lg sm:text-xl">
          Form Data Diri
        </DialogTitle>
      </DialogHeader>

      <div
        className="no-scrollbar flex-1 space-y-4 overflow-x-hidden overflow-y-scroll sm:space-y-6"
        id="order-form"
      >
        <div className="space-y-4 sm:space-y-6">
          <form
            id="identification-form"
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <FieldGroup>
              <form.Field name="fullName">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field className="space-y-1.5 sm:space-y-2">
                      <FieldLabel
                        className="text-[#E0E0E0] text-sm sm:text-xs"
                        htmlFor={field.name}
                      >
                        Nama Lengkap
                      </FieldLabel>
                      <Input
                        aria-invalid={isInvalid}
                        autoComplete="name"
                        className={cn(
                          "h-12 rounded-xl border-white/10 bg-white text-black text-sm placeholder:text-neutral-500 focus:ring-[#FF1818] sm:h-14 sm:text-base",
                          isInvalid && "border-red-500 ring-1 ring-red-500"
                        )}
                        id={field.name}
                        name={field.name}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="Masukkan nama lengkap"
                        value={field.state.value}
                      />
                      {isInvalid && (
                        <FieldError
                          className="pl-1 text-[10px]"
                          errors={field.state.meta.errors}
                        />
                      )}
                    </Field>
                  );
                }}
              </form.Field>
              <form.Field name="email">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <Field className="space-y-1.5 sm:space-y-2">
                      <FieldLabel
                        className="text-[#E0E0E0] text-sm sm:text-xs"
                        htmlFor={field.name}
                      >
                        Email
                      </FieldLabel>
                      <Input
                        aria-invalid={isInvalid}
                        autoComplete="email"
                        className={cn(
                          "h-12 rounded-xl border-white/10 bg-white text-black text-sm placeholder:text-neutral-500 focus:ring-[#FF1818] sm:h-14 sm:text-base",
                          isInvalid && "border-red-500 ring-1 ring-red-500"
                        )}
                        id={field.name}
                        name={field.name}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="contoh@email.com"
                        type="email"
                        value={field.state.value}
                      />
                      {isInvalid && (
                        <FieldError
                          className="pl-1 text-[10px]"
                          errors={field.state.meta.errors}
                        />
                      )}
                    </Field>
                  );
                }}
              </form.Field>
              <form.Field name="phone">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <Field className="space-y-1.5 sm:space-y-2">
                      <FieldLabel
                        className="text-[#E0E0E0] text-sm sm:text-xs"
                        htmlFor={field.name}
                      >
                        Nomor Telepon
                      </FieldLabel>
                      <Input
                        aria-invalid={isInvalid}
                        autoComplete="tel"
                        className={cn(
                          "h-12 rounded-xl border-white/10 bg-white text-black text-sm placeholder:text-neutral-500 focus:ring-[#FF1818] sm:h-14 sm:text-base",
                          isInvalid && "border-red-500 ring-1 ring-red-500"
                        )}
                        id={field.name}
                        inputMode="tel"
                        name={field.name}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="+62812xxxx"
                        value={field.state.value}
                      />
                      {isInvalid && (
                        <FieldError
                          className="pl-1 text-[10px]"
                          errors={field.state.meta.errors}
                        />
                      )}
                    </Field>
                  );
                }}
              </form.Field>
              <form.Field name="address">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <Field className="space-y-1.5 sm:space-y-2">
                      <FieldLabel
                        className="text-[#E0E0E0] text-sm sm:text-xs"
                        htmlFor={field.name}
                      >
                        Alamat
                      </FieldLabel>
                      <Textarea
                        aria-invalid={isInvalid}
                        autoComplete="street-address"
                        className={cn(
                          "min-h-24 rounded-xl border-white/10 bg-white px-3 py-3 text-black text-sm placeholder:text-neutral-500 focus:ring-[#FF1818] sm:min-h-28 sm:px-4 sm:py-4 sm:text-base",
                          isInvalid && "border-red-500 ring-1 ring-red-500"
                        )}
                        id={field.name}
                        name={field.name}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="Jl. Merah Putih No. 1..."
                        rows={3}
                        value={field.state.value}
                      />
                      {isInvalid && (
                        <FieldError
                          className="pl-1 text-[10px]"
                          errors={field.state.meta.errors}
                        />
                      )}
                    </Field>
                  );
                }}
              </form.Field>
            </FieldGroup>
          </form>
        </div>

        <div className="flex gap-2 border-white/10 border-t pt-4 sm:gap-4 sm:pt-6">
          <Button
            className="flex-1"
            onClick={onPrevStep}
            size="checkout"
            type="button"
            variant="store-secondary"
          >
            Kembali
          </Button>
          <form.Subscribe>
            {(field) => (
              <Button
                className="flex-1"
                disabled={field.isSubmitting}
                form="identification-form"
                size="checkout"
                type="submit"
                variant="store-primary"
              >
                Lanjutkan
              </Button>
            )}
          </form.Subscribe>
        </div>
      </div>
    </div>
  );
}
