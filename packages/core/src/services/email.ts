import {
  createTemplate,
  type Brevo,
  type TemplateMap,
  type TemplatesKey,
} from "@tedx-2026/email";
import { tryCatch } from "@tedx-2026/utils";
import type { BaseContext } from "../types";

export type EmailServices = {
  sendEmail: <T extends TemplatesKey>(
    to: string,
    subject: string,
    templateKey: T,
    params: TemplateMap[T]
  ) => Promise<void>;
  sendEmailWithAttachment: <T extends TemplatesKey>(
    to: string,
    subject: string,
    templateKey: T,
    params: TemplateMap[T],
    attachments: { name: string; content: ArrayBuffer }[]
  ) => Promise<void>;
};

type CreateEmailServicesCtx = {
  email: Brevo;
} & BaseContext;

type EmailServiceConfig = {
  senderName: string;
  senderEmail: string;
};

export const createEmailServices = (
  ctx: CreateEmailServicesCtx,
  config: EmailServiceConfig
): EmailServices => {
  const { senderName, senderEmail } = config;

  return {
    sendEmail: async (to, subject, templateKey, params) => {
      const startTime = Date.now();
      const { error } = await tryCatch(
        ctx.email.sendEmail({
          to: [{ email: to }],
          subject,
          htmlContent: createTemplate(templateKey, params),
          sender: {
            name: senderName,
            email: senderEmail,
          },
        })
      );
      if (error) {
        ctx.logger.error("email.send_failed", {
          recipientEmail: to,
          templateKey,
          error,
          durationMs: Date.now() - startTime,
        });
        throw error;
      }
      ctx.logger.info("email.sent", {
        recipientEmail: to,
        templateKey,
        hasAttachments: false,
        durationMs: Date.now() - startTime,
      });
    },
    sendEmailWithAttachment: async (
      to,
      subject,
      templateKey,
      params,
      attachments
    ) => {
      const startTime = Date.now();
      const { error } = await tryCatch(
        ctx.email.sendEmail({
          to: [{ email: to }],
          subject,
          htmlContent: createTemplate(templateKey, params),
          sender: {
            name: senderName,
            email: senderEmail,
          },
          attachment: attachments.map((att) => ({
            name: att.name,
            content: Buffer.from(att.content).toString("base64"),
          })),
        })
      );
      if (error) {
        ctx.logger.error("email.send_failed", {
          recipientEmail: to,
          templateKey,
          hasAttachments: true,
          error,
          durationMs: Date.now() - startTime,
        });
        throw error;
      }
      ctx.logger.info("email.sent", {
        recipientEmail: to,
        templateKey,
        hasAttachments: true,
        attachmentCount: attachments.length,
        durationMs: Date.now() - startTime,
      });
    },
  };
};
