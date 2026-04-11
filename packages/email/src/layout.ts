/**
 * Email layout infrastructure for TEDx 2026
 * Uses table-based layout for maximum email client compatibility
 */

// Brand colors from globals.css converted to hex for email compatibility
export const colors = {
  // TEDx brand colors
  red: "#6B1414", // primary brand color
  redLight: "#C73737", // lighter red for accents
  black: "#424242", // text color
  white: "#F5F5F5", // background color
  green: "#4F7359", // accent color
  brown: "#A4825A", // accent color
  yellow: "#D9C366", // accent color

  // Light mode colors
  light: {
    background: "#FFFFFF",
    text: "#252525",
    textMuted: "#6B6B6B",
    border: "#E8E8E8",
  },

  // Dark mode colors
  dark: {
    background: "#252525",
    text: "#F8F8F8",
    textMuted: "#A3A3A3",
    border: "rgba(255, 255, 255, 0.1)",
  },
} as const;

// Typography settings
export const typography = {
  fontFamily:
    'Manrope, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  fontFamilyHeading:
    'Raleway, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  sizes: {
    xs: "11px",
    sm: "13px",
    base: "16px",
    lg: "18px",
    xl: "24px",
    "2xl": "36px",
    "3xl": "48px",
  },
} as const;

export type LayoutOptions = {
  preheader?: string;
  header?: string;
  footer?: string;
};

/**
 * Creates the base HTML email structure with proper DOCTYPE and meta tags
 */
export const createEmailLayout = (
  content: string,
  options: LayoutOptions = {}
): string => {
  const { preheader, header, footer } = options;

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="x-apple-disable-message-reformatting" />
  <meta name="format-detection" content="telephone=no,address=no,email=no,date=no" />
  <meta name="color-scheme" content="light dark" />
  <meta name="supported-color-schemes" content="light dark" />
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style type="text/css">
    /* Reset styles */
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }

    /* Base styles */
    body {
      margin: 0 !important;
      padding: 0 !important;
      width: 100% !important;
      height: 100% !important;
      background-color: ${colors.light.background};
      font-family: ${typography.fontFamily};
    }

    /* Dark mode support */
    @media (prefers-color-scheme: dark) {
      body {
        background-color: ${colors.dark.background} !important;
      }
      .email-container {
        background-color: ${colors.dark.background} !important;
      }
      .email-content {
        background-color: ${colors.dark.background} !important;
        color: ${colors.dark.text} !important;
      }
      .text-muted {
        color: ${colors.dark.textMuted} !important;
      }
      .border {
        border-color: ${colors.dark.border} !important;
      }
      /* Keep brand colors consistent in dark mode */
      .brand-color {
        color: ${colors.redLight} !important;
      }
    }

    /* Responsive styles */
    @media only screen and (max-width: 600px) {
      .email-container {
        width: 100% !important;
        max-width: 100% !important;
      }
      .mobile-padding {
        padding-left: 16px !important;
        padding-right: 16px !important;
      }
      .mobile-stack {
        display: block !important;
        width: 100% !important;
      }
      .mobile-hide {
        display: none !important;
      }
      .mobile-center {
        text-align: center !important;
      }
      /* Responsive font sizes */
      .h1 { font-size: 32px !important; line-height: 40px !important; }
      .h2 { font-size: 24px !important; line-height: 32px !important; }
      .h3 { font-size: 20px !important; line-height: 28px !important; }
    }

    /* Link styles */
    a {
      color: ${colors.red};
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: ${colors.light.background};">
  ${preheader ? `<div style="display: none; max-height: 0; overflow: hidden; mso-hide: all;">${preheader}</div>` : ""}

  <!-- 100% background wrapper -->
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: ${colors.light.background};">
    <tr>
      <td align="center" style="padding: 20px 0;">

        <!-- 600px container -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" class="email-container" style="max-width: 600px; width: 100%;">

          ${header || ""}

          <!-- Main content -->
          <tr>
            <td class="email-content" style="background-color: #FFFFFF; padding: 40px 32px; font-family: ${typography.fontFamily}; font-size: ${typography.sizes.base}; line-height: 24px; color: ${colors.light.text};">
              ${content}
            </td>
          </tr>

          ${footer || ""}

        </table>

      </td>
    </tr>
  </table>
</body>
</html>`;
};
