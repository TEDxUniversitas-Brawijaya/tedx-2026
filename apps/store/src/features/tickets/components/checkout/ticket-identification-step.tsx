"use client";

import { Button } from "@tedx-2026/ui/components/button";
import { DialogHeader, DialogTitle } from "@tedx-2026/ui/components/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@tedx-2026/ui/components/field";
import { Input } from "@tedx-2026/ui/components/input";
import { cn } from "@tedx-2026/ui/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@tedx-2026/ui/components/select";
import { useTicketIdentificationForm } from "../../hooks/use-ticket-identification-form";
import { useTicketCheckoutStore } from "../../stores/use-ticket-checkout-store";
import type { TicketProduct } from "../../types/ticket";

type TicketIdentificationStepProps = {
  selectedProduct: TicketProduct;
  quantity: number;
};

export const TicketIdentificationStep = ({
  selectedProduct,
  quantity,
}: TicketIdentificationStepProps) => {
  const { onPrevStep, setQuantity } = useTicketCheckoutStore();
  const form = useTicketIdentificationForm();

  const maxQty =
    selectedProduct.stock === null
      ? 5
      : Math.min(5, Math.max(1, selectedProduct.stock || 1));

  return (
    <div className="flex max-h-[80vh] flex-col gap-y-4 sm:gap-y-6">
      <DialogHeader className="text-left">
        <DialogTitle className="font-normal font-serif-2 text-lg sm:text-xl">
          Form Data Diri
        </DialogTitle>
        <p className="mt-1 font-light font-sans-2 text-[#E0E0E0]/60 text-xs italic">
          Note : kamu memilih {selectedProduct.name.toLowerCase()}{" "}
          {selectedProduct.description
            ? `(${selectedProduct.description})`
            : ""}
        </p>
      </DialogHeader>

      <div
        className="no-scrollbar flex-1 space-y-4 overflow-x-hidden overflow-y-scroll sm:space-y-6"
        id="ticket-identification-form-container"
      >
        <form
          className="space-y-4 sm:space-y-6"
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
                        "h-12 rounded-xl border-white/10 bg-white px-3 text-black text-sm placeholder:text-neutral-500 focus:ring-[#FF1818] sm:h-14 sm:text-base",
                        isInvalid && "border-red-500 ring-1 ring-red-500"
                      )}
                      id={field.name}
                      name={field.name}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      placeholder="Ex : John Doe"
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
                        "h-12 rounded-xl border-white/10 bg-white px-3 text-black text-sm placeholder:text-neutral-500 focus:ring-[#FF1818] sm:h-14 sm:text-base",
                        isInvalid && "border-red-500 ring-1 ring-red-500"
                      )}
                      id={field.name}
                      name={field.name}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      placeholder="Ex : johndoe@gmail.com"
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
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      placeholder="+62812xxxx"
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
                  <Field className="space-y-1.5 sm:space-y-2">
                    <FieldLabel
                      className="text-[#E0E0E0] text-sm sm:text-xs"
                      htmlFor={field.name}
                    >
                      Institusi
                    </FieldLabel>
                    <Input
                      aria-invalid={isInvalid}
                      className={cn(
                        "h-12 rounded-xl border-white/10 bg-white px-3 text-black text-sm placeholder:text-neutral-500 focus:ring-[#FF1818] sm:h-14 sm:text-base",
                        isInvalid && "border-red-500 ring-1 ring-red-500"
                      )}
                      id={field.name}
                      name={field.name}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      placeholder="Ex : Universitas Brawijaya"
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

            <Field className="space-y-1.5 sm:space-y-2">
              <FieldLabel className="text-[#E0E0E0] text-sm sm:text-xs">
                Jumlah ticket
              </FieldLabel>
              <Select
                onValueChange={(value) => setQuantity(Number(value ?? 1))}
                value={quantity.toString()}
              >
                <SelectTrigger className="h-12 w-full rounded-xl border-none bg-white px-3 font-medium font-sans-2 text-black text-sm outline-none placeholder:text-neutral-500 focus:ring-[#FF1818] sm:h-14 sm:text-base">
                  <SelectValue placeholder="Pilih jumlah tiket" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-none bg-white font-sans-2 text-black shadow-xl">
                  {Array.from({ length: maxQty }, (_, i) => i + 1).map(
                    (num) => (
                      <SelectItem
                        className="cursor-pointer font-sans-2 text-black text-sm"
                        key={num}
                        value={num.toString()}
                      >
                        Ex : {num}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </Field>
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
          {(state) => (
            <Button
              className="flex-1"
              disabled={state.isSubmitting}
              form="ticket-identification-form"
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
  );
};
