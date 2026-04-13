import { AppError } from "../errors";
import type {
  CreateMidtransTransactionInput,
  CreatePaymentServiceOptions,
} from "@tedx-2026/types";

export type PaymentService = {
  createMidtransTransaction: (
    input: CreateMidtransTransactionInput
  ) => Promise<{
    midtransOrderId: string;
    qrisUrl: string;
  }>;
  verifyMidtransSignature: (input: {
    orderId: string;
    statusCode: string;
    grossAmount: string;
    signatureKey: string;
  }) => Promise<boolean>;
};

const MIDTRANS_SANDBOX_BASE_URL = "https://api.sandbox.midtrans.com";
const MIDTRANS_PRODUCTION_BASE_URL = "https://api.midtrans.com";

export const createPaymentService = ({
  serverKey,
  isProduction,
}: CreatePaymentServiceOptions): PaymentService => {
  const baseUrl = isProduction
    ? MIDTRANS_PRODUCTION_BASE_URL
    : MIDTRANS_SANDBOX_BASE_URL;

  return {
    createMidtransTransaction: async ({
      orderId,
      totalPrice,
      buyerName,
      buyerEmail,
      buyerPhone,
      expiryMinutes,
    }) => {
      if (!serverKey) {
        throw new AppError(
          "INTERNAL_SERVER_ERROR",
          "Midtrans server key is not configured"
        );
      }

      const authToken = btoa(`${serverKey}:`);
      const body = {
        payment_type: "qris",
        transaction_details: {
          order_id: orderId,
          gross_amount: totalPrice,
        },
        customer_details: {
          first_name: buyerName,
          email: buyerEmail,
          phone: buyerPhone,
        },
        custom_expiry: {
          expiry_duration: expiryMinutes,
          unit: "minute",
        },
      };

      const response = await fetch(`${baseUrl}/v2/charge`, {
        method: "POST",
        headers: {
          Authorization: `Basic ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const responseText = await response.text();
        throw new AppError(
          "BAD_REQUEST",
          "Failed to create Midtrans transaction",
          {
            details: {
              orderId,
              status: response.status,
              responseText,
            },
          }
        );
      }

      const data = (await response.json()) as {
        order_id?: string;
        actions?: { url: string; name?: string }[];
      };

      const qrisUrl =
        data.actions?.find((action) => action.name === "generate-qr-code")
          ?.url ?? data.actions?.[0]?.url;

      if (!(qrisUrl && data.order_id)) {
        throw new AppError(
          "INTERNAL_SERVER_ERROR",
          "Midtrans did not return QRIS URL",
          {
            details: { orderId, data },
          }
        );
      }

      return {
        midtransOrderId: data.order_id,
        qrisUrl,
      };
    },

    verifyMidtransSignature: async ({
      orderId,
      statusCode,
      grossAmount,
      signatureKey,
    }) => {
      if (!serverKey) {
        throw new AppError(
          "INTERNAL_SERVER_ERROR",
          "Midtrans server key is not configured"
        );
      }

      const payload = `${orderId}${statusCode}${grossAmount}${serverKey}`;
      const data = new TextEncoder().encode(payload);
      const digestBuffer = await crypto.subtle.digest("SHA-512", data);
      const digest = Array.from(new Uint8Array(digestBuffer))
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("");

      return digest.toLowerCase() === signatureKey.toLowerCase();
    },
  };
};
