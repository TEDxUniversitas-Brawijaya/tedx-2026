// TODO: Implement payment service using packages/payment
/** biome-ignore-all lint/suspicious/noExplicitAny: TODO */
import type { BaseContext } from "../types";

export type PaymentServices = {
  chargeTransaction: () => Promise<any>;
  getTransactionStatus: () => Promise<any>;
  verifyTransaction: () => Promise<any>;
};

type CreatePaymentServicesCtx = {} & BaseContext;

export const createPaymentServices = (
  _ctx: CreatePaymentServicesCtx
): PaymentServices => ({
  chargeTransaction: () => {
    throw new Error("Method not implemented.");
  },
  getTransactionStatus: () => {
    throw new Error("Method not implemented.");
  },
  verifyTransaction: () => {
    throw new Error("Method not implemented.");
  },
});
