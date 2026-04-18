import { createUUIDv4, tryCatch } from "@tedx-2026/utils";
import { AppError } from "../errors";
import type { BaseContext } from "../types";

type Response =
  | {
      success: true;
      challenge_ts: string; // 2022-02-28T15:14:30.096Z
      hostname: string; // Hostname where the challenge was served
      "error-codes": [];
    }
  | {
      success: false;
      // https://developers.cloudflare.com/turnstile/get-started/server-side-validation/#error-codes-reference
      "error-codes": (
        | "missing-input-secret"
        | "invalid-input-secret"
        | "missing-input-response"
        | "invalid-input-response"
        | "bad-request"
        | "timeout-or-duplicate"
        | "internal-error"
      )[];
    };

export type CaptchaServices = {
  verifyTurnstile: (token: string, remoteIp?: string) => Promise<void>;
};

type CreateCaptchaServicesCtx = {
  turnstileSecretKey: string;
} & BaseContext;

export const createCaptchaServices = (
  ctx: CreateCaptchaServicesCtx
): CaptchaServices => ({
  verifyTurnstile: async (token, remoteIp) => {
    const controller = new AbortController();

    const req = {
      secret: ctx.turnstileSecretKey,
      response: token,
      remoteip: remoteIp,
      idempotency_key: createUUIDv4(),
    };

    const { data: fetchRes, error: fetchError } = await tryCatch(
      fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(req),
        signal: controller.signal,
      })
    );
    if (fetchError) {
      throw new AppError(
        "INTERNAL_SERVER_ERROR",
        "Failed to verify CAPTCHA. Please try again.",
        {
          cause: fetchError,
        }
      );
    }

    if (!fetchRes.ok) {
      throw new AppError(
        "INTERNAL_SERVER_ERROR",
        `CAPTCHA verification request failed with status ${fetchRes.status}. Please try again.`
      );
    }

    const { data: jsonRes, error: jsonErr } = await tryCatch(
      fetchRes.json() as Promise<Response>
    );
    if (jsonErr) {
      throw new AppError(
        "INTERNAL_SERVER_ERROR",
        "Failed to parse CAPTCHA verification response. Please try again.",
        {
          cause: jsonErr,
        }
      );
    }

    if (!jsonRes.success) {
      throw new AppError(
        "BAD_REQUEST",
        "CAPTCHA verification failed. Please try again.",
        {
          details: {
            errorCodes: jsonRes["error-codes"],
          },
        }
      );
    }

    return;
  },
});
