import { createFormHook, createFormHookContexts } from "@tanstack/react-form";

const { fieldContext, useFieldContext, formContext, useFormContext } =
  createFormHookContexts();

const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {},
  formComponents: {},
});

export { useAppForm, useFieldContext, useFormContext };
