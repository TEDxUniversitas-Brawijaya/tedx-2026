import {
  createTemplate,
  type Brevo,
  type TemplateMap,
  type TemplatesKey,
} from "@tedx-2026/email";
import type { BaseContext } from "../types";

export type EmailService = {
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

type CreateEmailServiceCtx = {
  email: Brevo;
} & BaseContext;

type EmailServiceConfig = {
  senderName: string;
  senderEmail: string;
};

export const createEmailService = (
  ctx: CreateEmailServiceCtx,
  config: EmailServiceConfig
): EmailService => {
  const { senderName, senderEmail } = config;

  return {
    sendEmail: async (to, subject, templateKey, params) => {
      await ctx.email.sendEmail({
        to: [{ email: to }],
        subject,
        htmlContent: createTemplate(templateKey, params),
        sender: {
          name: senderName,
          email: senderEmail,
        },
      });
    },
    sendEmailWithAttachment: async (
      to,
      subject,
      templateKey,
      params,
      attachments
    ) => {
      await ctx.email.sendEmail({
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
      });
    },
  };
};
