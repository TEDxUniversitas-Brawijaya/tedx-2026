import { footer, header } from "./components";

export type LayoutOptions = {
  preheader?: string;
};

export const createEmailLayout = (
  content: string,
  options: LayoutOptions = {}
): string => {
  const { preheader } = options;

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="x-apple-disable-message-reformatting" />
  <meta name="format-detection" content="telephone=no,address=no,email=no,date=no" />
  <meta name="color-scheme" content="light only" />
  <meta name="supported-color-schemes" content="light" />

  <!--[if !mso]><!-->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:ital,wght@0,400;0,600;0,700;1,400&display=swap" rel="stylesheet" />
  <!--<![endif]-->

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
      font-family: "Hanken Grotesk", sans-serif;
      font-size: 1rem;
      line-height: normal;
      color: #242424;
      background-color: #FFFDF7;
    }

    /* Responsive padding and font sizes for mobile devices */
    @media only screen and (max-width: 600px) {
      .header-padding {
        padding: 16px 20px !important;
      }
      .content-padding {
        padding: 24px 20px 0 20px !important;
      }
      .footer-padding {
        padding: 16px 20px 40px 20px !important;
      }
      .detail-box {
        padding: 20px 16px !important;
      }
      .detail-title {
        font-size: 1.25rem !important;
      }
      .order-number {
        font-size: 0.875rem !important;
      }
      .table-header {
        font-size: 14px !important;
      }
      .table-content {
        font-size: 14px !important;
      }
    }
  </style>
</head>
<body>
  ${preheader ? `<div style="display: none; max-height: 0; overflow: hidden; mso-hide: all;">${preheader}</div>` : ""}
  <!-- 100% background wrapper -->
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
    <tr>
      <td>
        ${header()}
      </td>
    </tr>
    <tr>
      <td class="content-padding" style="padding: 40px 52px 0px 52px; background-color: #FFFDF7;">
        ${content}
      </td>
    </tr>
    <tr>
      <td>
        ${footer()}
      </td>
    </tr>
  </table>
</body>
</html>`;
};
