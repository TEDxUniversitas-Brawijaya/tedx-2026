/**
 * Reusable email components for TEDx 2026
 * All components return inline-styled HTML strings for email compatibility
 */

import { colors, typography } from "./layout";

/**
 * Creates a spacer for vertical spacing
 */
export const spacer = (height: number): string => {
  return `<tr>
    <td height="${height}" style="height: ${height}px; line-height: ${height}px; font-size: 1px;">&nbsp;</td>
  </tr>`;
};

/**
 * Creates a horizontal divider
 */
export const divider = (
  options: { color?: string; height?: number } = {}
): string => {
  const { color = colors.light.border, height = 1 } = options;

  return `<tr>
    <td style="padding: 20px 0;">
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td style="border-top: ${height}px solid ${color}; line-height: 1px; font-size: 1px;">&nbsp;</td>
        </tr>
      </table>
    </td>
  </tr>`;
};

type ButtonProps = {
  href: string;
  text: string;
  variant?: "primary" | "secondary";
  fullWidth?: boolean;
};

/**
 * Creates a CTA button with proper styling for email clients
 */
export const button = (props: ButtonProps): string => {
  const { href, text, variant = "primary", fullWidth = false } = props;

  const isPrimary = variant === "primary";
  const bgColor = isPrimary ? colors.red : "transparent";
  const textColor = isPrimary ? colors.white : colors.red;
  const borderColor = colors.red;

  const align = fullWidth ? "stretch" : "center";

  return `<table role="presentation" border="0" cellpadding="0" cellspacing="0" ${fullWidth ? 'width="100%"' : ""} style="margin: 0 auto;">
    <tr>
      <td align="${align}" style="border-radius: 6px; background-color: ${bgColor}; border: 2px solid ${borderColor};">
        <a href="${href}" target="_blank" rel="noopener" style="display: inline-block; padding: 14px 32px; font-family: ${typography.fontFamilyHeading}; font-size: ${typography.sizes.base}; font-weight: 600; color: ${textColor}; text-decoration: none; border-radius: 6px; ${fullWidth ? "width: 100%; box-sizing: border-box; text-align: center;" : ""}">${text}</a>
      </td>
    </tr>
  </table>`;
};

type HeadingProps = {
  text: string;
  level?: 1 | 2 | 3;
  align?: "left" | "center" | "right";
  color?: string;
};

/**
 * Creates a heading with proper typography
 */
export const heading = (props: HeadingProps): string => {
  const { text, level = 1, align = "left", color = colors.light.text } = props;

  const sizes = {
    1: { fontSize: typography.sizes["2xl"], lineHeight: "44px" },
    2: { fontSize: typography.sizes.xl, lineHeight: "32px" },
    3: { fontSize: typography.sizes.lg, lineHeight: "28px" },
  };

  const { fontSize, lineHeight } = sizes[level];

  return `<h${level} class="h${level}" style="margin: 0 0 16px 0; padding: 0; font-family: ${typography.fontFamilyHeading}; font-size: ${fontSize}; line-height: ${lineHeight}; font-weight: 700; color: ${color}; text-align: ${align};">${text}</h${level}>`;
};

type ParagraphProps = {
  text: string;
  align?: "left" | "center" | "right";
  color?: string;
  muted?: boolean;
};

/**
 * Creates a paragraph with proper spacing
 */
export const paragraph = (props: ParagraphProps): string => {
  const { text, align = "left", color, muted = false } = props;

  const textColor =
    color || (muted ? colors.light.textMuted : colors.light.text);

  return `<p style="margin: 0 0 16px 0; padding: 0; font-family: ${typography.fontFamily}; font-size: ${typography.sizes.base}; line-height: 24px; color: ${textColor}; text-align: ${align};" ${muted ? 'class="text-muted"' : ""}>${text}</p>`;
};

type LinkProps = {
  href: string;
  text: string;
  color?: string;
};

/**
 * Creates a styled link
 */
export const link = (props: LinkProps): string => {
  const { href, text, color = colors.red } = props;

  return `<a href="${href}" target="_blank" rel="noopener" style="color: ${color}; text-decoration: underline; font-weight: 600;">${text}</a>`;
};

/**
 * Creates a section container for grouping content
 */
export const section = (content: string, padding = "0"): string => {
  return `<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
    <tr>
      <td style="padding: ${padding};">
        ${content}
      </td>
    </tr>
  </table>`;
};

type HeaderProps = {
  logoUrl?: string;
  logoAlt?: string;
  title?: string;
};

/**
 * Creates a header with TEDx branding
 */
export const header = (props: HeaderProps = {}): string => {
  const { logoUrl, logoAlt = "TEDx", title = "TEDx 2026" } = props;

  return `<tr>
    <td class="email-header" style="background-color: ${colors.red}; padding: 24px 32px; text-align: center;">
      ${
        logoUrl
          ? `<img src="${logoUrl}" alt="${logoAlt}" width="120" height="auto" style="display: block; margin: 0 auto; max-width: 120px; height: auto;" />`
          : `<h1 style="margin: 0; padding: 0; font-family: ${typography.fontFamilyHeading}; font-size: ${typography.sizes.xl}; font-weight: 700; color: ${colors.white}; text-align: center;">${title}</h1>`
      }
    </td>
  </tr>`;
};

type FooterProps = {
  companyName?: string;
  address?: string;
  unsubscribeUrl?: string;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
};

/**
 * Creates a footer with company info and social links
 */
export const footer = (props: FooterProps = {}): string => {
  const {
    companyName = "TEDx 2026",
    address,
    unsubscribeUrl,
    socialLinks = {},
  } = props;

  const currentYear = new Date().getFullYear();

  const socialIconStyle = "display: inline-block; margin: 0 8px;";
  const socialLinkStyle = `display: inline-block; width: 32px; height: 32px; border-radius: 50%; background-color: ${colors.light.border}; text-align: center; line-height: 32px; text-decoration: none;`;

  return `<tr>
    <td class="email-footer" style="background-color: ${colors.light.background}; padding: 32px; text-align: center; border-top: 1px solid ${colors.light.border};">
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
        ${
          Object.keys(socialLinks).length > 0
            ? `<tr>
          <td align="center" style="padding-bottom: 16px;">
            ${
              socialLinks.facebook
                ? `<span style="${socialIconStyle}"><a href="${socialLinks.facebook}" target="_blank" rel="noopener" style="${socialLinkStyle}">f</a></span>`
                : ""
            }
            ${
              socialLinks.twitter
                ? `<span style="${socialIconStyle}"><a href="${socialLinks.twitter}" target="_blank" rel="noopener" style="${socialLinkStyle}">𝕏</a></span>`
                : ""
            }
            ${
              socialLinks.instagram
                ? `<span style="${socialIconStyle}"><a href="${socialLinks.instagram}" target="_blank" rel="noopener" style="${socialLinkStyle}">📷</a></span>`
                : ""
            }
            ${
              socialLinks.linkedin
                ? `<span style="${socialIconStyle}"><a href="${socialLinks.linkedin}" target="_blank" rel="noopener" style="${socialLinkStyle}">in</a></span>`
                : ""
            }
          </td>
        </tr>`
            : ""
        }
        <tr>
          <td align="center" style="padding-bottom: 8px;">
            <p style="margin: 0; padding: 0; font-family: ${typography.fontFamily}; font-size: ${typography.sizes.sm}; line-height: 20px; color: ${colors.light.textMuted};" class="text-muted">
              © ${currentYear} ${companyName}. All rights reserved.
            </p>
          </td>
        </tr>
        ${
          address
            ? `<tr>
          <td align="center" style="padding-bottom: 8px;">
            <p style="margin: 0; padding: 0; font-family: ${typography.fontFamily}; font-size: ${typography.sizes.sm}; line-height: 20px; color: ${colors.light.textMuted};" class="text-muted">
              ${address}
            </p>
          </td>
        </tr>`
            : ""
        }
        ${
          unsubscribeUrl
            ? `<tr>
          <td align="center">
            <p style="margin: 0; padding: 0; font-family: ${typography.fontFamily}; font-size: ${typography.sizes.sm}; line-height: 20px;">
              <a href="${unsubscribeUrl}" target="_blank" rel="noopener" style="color: ${colors.light.textMuted}; text-decoration: underline;">Unsubscribe</a>
            </p>
          </td>
        </tr>`
            : ""
        }
      </table>
    </td>
  </tr>`;
};

/**
 * Creates a two-column layout (responsive, stacks on mobile)
 */
export const columns = (leftContent: string, rightContent: string): string => {
  return `<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
    <tr>
      <td class="mobile-stack" width="50%" valign="top" style="padding-right: 16px;">
        ${leftContent}
      </td>
      <td class="mobile-stack" width="50%" valign="top" style="padding-left: 16px;">
        ${rightContent}
      </td>
    </tr>
  </table>`;
};

/**
 * Creates a highlight box for important information
 */
export const highlightBox = (
  content: string,
  options: { backgroundColor?: string; borderColor?: string } = {}
): string => {
  const { backgroundColor = "#FFF9F0", borderColor = colors.yellow } = options;

  return `<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
    <tr>
      <td style="background-color: ${backgroundColor}; border-left: 4px solid ${borderColor}; padding: 20px; border-radius: 6px;">
        ${content}
      </td>
    </tr>
  </table>`;
};
