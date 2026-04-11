import { createEmailLayout } from "./layout";
import {
  header,
  footer,
  heading,
  paragraph,
  button,
  spacer,
  section,
  highlightBox,
} from "./components";

/**
 * Template parameter types
 * Add new template types here with their required parameters
 */
export type TemplateMap = {
  welcome: {
    recipientName: string;
    ctaUrl?: string;
  };
  greeting: {
    name: string;
  };
  order: {
    name: string;
    orderId: number;
    orderTotal?: string;
    orderDate?: string;
    trackingUrl?: string;
  };
  passwordReset: {
    name: string;
    resetUrl: string;
    expiryHours?: number;
  };
  eventReminder: {
    name: string;
    eventName: string;
    eventDate: string;
    eventLocation: string;
    eventUrl?: string;
  };
};

export type TemplatesKey = keyof TemplateMap;

type Renderers = {
  [K in TemplatesKey]: (params: TemplateMap[K]) => string;
};

/**
 * Template renderers
 * Each renderer returns the complete HTML email
 */
const renderers: Renderers = {
  welcome: (params) => {
    const { recipientName, ctaUrl } = params;

    const content = `
      ${heading({ text: `Welcome to TEDx 2026, ${recipientName}!`, level: 1 })}
      ${paragraph({
        text: "We're thrilled to have you join our community of innovators, thinkers, and change-makers.",
      })}
      ${paragraph({
        text: "TEDx 2026 brings together inspiring speakers, thought-provoking ideas, and meaningful connections. Get ready for an unforgettable experience!",
      })}
      ${section(
        highlightBox(
          `${paragraph({
            text: "<strong>What to expect:</strong>",
            muted: false,
          })}
          ${paragraph({ text: "• Inspiring talks from world-class speakers", muted: false })}
          ${paragraph({ text: "• Networking opportunities with like-minded individuals", muted: false })}
          ${paragraph({ text: "• Exclusive access to TEDx community events", muted: false })}`
        ),
        "24px 0"
      )}
      ${ctaUrl ? button({ href: ctaUrl, text: "Explore the Event", variant: "primary" }) : ""}
      ${spacer(24)}
      ${paragraph({
        text: "Stay tuned for updates and announcements!",
        muted: true,
      })}
    `;

    return createEmailLayout(content, {
      preheader: `Welcome to TEDx 2026, ${recipientName}!`,
      header: header({ title: "TEDx 2026" }),
      footer: footer({
        companyName: "TEDx 2026",
        socialLinks: {
          facebook: "https://facebook.com/tedx",
          twitter: "https://twitter.com/tedx",
          instagram: "https://instagram.com/tedx",
        },
      }),
    });
  },

  greeting: (params) => {
    const { name } = params;

    const content = `
      ${heading({ text: `Hi ${name}!`, level: 1 })}
      ${paragraph({
        text: "Hope you're having a great day. We wanted to reach out and say hello!",
      })}
    `;

    return createEmailLayout(content, {
      preheader: `Hi ${name}!`,
      header: header({ title: "TEDx 2026" }),
      footer: footer({
        companyName: "TEDx 2026",
      }),
    });
  },

  order: (params) => {
    const { name, orderId, orderTotal, orderDate, trackingUrl } = params;

    const content = `
      ${heading({ text: `Order Confirmation #${orderId}`, level: 1 })}
      ${paragraph({
        text: `Hi ${name},`,
      })}
      ${paragraph({
        text: "Thank you for your order! We've received your purchase and are processing it now.",
      })}
      ${section(
        highlightBox(
          `${heading({ text: "Order Details", level: 3 })}
          ${paragraph({ text: `<strong>Order Number:</strong> #${orderId}`, muted: false })}
          ${orderDate ? paragraph({ text: `<strong>Order Date:</strong> ${orderDate}`, muted: false }) : ""}
          ${orderTotal ? paragraph({ text: `<strong>Total:</strong> ${orderTotal}`, muted: false }) : ""}`,
          { backgroundColor: "#F5F5F5", borderColor: "#6B1414" }
        ),
        "24px 0"
      )}
      ${trackingUrl ? button({ href: trackingUrl, text: "Track Your Order", variant: "primary" }) : ""}
      ${spacer(24)}
      ${paragraph({
        text: "If you have any questions about your order, please don't hesitate to contact us.",
        muted: true,
      })}
    `;

    return createEmailLayout(content, {
      preheader: `Order #${orderId} confirmed`,
      header: header({ title: "TEDx 2026" }),
      footer: footer({
        companyName: "TEDx 2026",
        unsubscribeUrl: "https://example.com/unsubscribe",
      }),
    });
  },

  passwordReset: (params) => {
    const { name, resetUrl, expiryHours = 24 } = params;

    const content = `
      ${heading({ text: "Reset Your Password", level: 1 })}
      ${paragraph({
        text: `Hi ${name},`,
      })}
      ${paragraph({
        text: "We received a request to reset your password. Click the button below to create a new password.",
      })}
      ${spacer(24)}
      ${button({ href: resetUrl, text: "Reset Password", variant: "primary" })}
      ${spacer(24)}
      ${section(
        highlightBox(
          paragraph({
            text: `This link will expire in ${expiryHours} hours. If you didn't request this password reset, you can safely ignore this email.`,
            muted: false,
          })
        ),
        "0"
      )}
    `;

    return createEmailLayout(content, {
      preheader: "Reset your password",
      header: header({ title: "TEDx 2026" }),
      footer: footer({
        companyName: "TEDx 2026",
      }),
    });
  },

  eventReminder: (params) => {
    const { name, eventName, eventDate, eventLocation, eventUrl } = params;

    const content = `
      ${heading({ text: `Don't Forget: ${eventName}`, level: 1 })}
      ${paragraph({
        text: `Hi ${name},`,
      })}
      ${paragraph({
        text: `This is a friendly reminder about the upcoming ${eventName}. We can't wait to see you there!`,
      })}
      ${section(
        highlightBox(
          `${heading({ text: "Event Details", level: 3 })}
          ${paragraph({ text: `<strong>Event:</strong> ${eventName}`, muted: false })}
          ${paragraph({ text: `<strong>Date:</strong> ${eventDate}`, muted: false })}
          ${paragraph({ text: `<strong>Location:</strong> ${eventLocation}`, muted: false })}`,
          { backgroundColor: "#FFF9F0", borderColor: "#D9C366" }
        ),
        "24px 0"
      )}
      ${eventUrl ? button({ href: eventUrl, text: "View Event Details", variant: "primary" }) : ""}
      ${spacer(24)}
      ${paragraph({
        text: "See you soon!",
        muted: true,
      })}
    `;

    return createEmailLayout(content, {
      preheader: `Reminder: ${eventName} on ${eventDate}`,
      header: header({ title: "TEDx 2026" }),
      footer: footer({
        companyName: "TEDx 2026",
        socialLinks: {
          facebook: "https://facebook.com/tedx",
          twitter: "https://twitter.com/tedx",
          instagram: "https://instagram.com/tedx",
        },
      }),
    });
  },
};

/**
 * Creates a complete email template with layout and styling
 */
export const createTemplate = <K extends TemplatesKey>(
  type: K,
  params: TemplateMap[K]
): string => {
  return renderers[type](params);
};
