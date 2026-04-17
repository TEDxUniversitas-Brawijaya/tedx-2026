export const header = (): string => {
  return `
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td style="background-color: #242424;">
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="position: relative;">
            <tr>
              <td valign="middle" align="left" style="padding: 20px 48px;">
                <img src="https://tedxuniversitasbrawijaya.com/email/logo.png" alt="Logo TEDxUniversitasBrawijaya" width="228" height="60" style="display: block; width: 228px; max-width: 100%; height: 60px;" />
              </td>
              <td valign="top" align="right" style="padding: 0; position: absolute; bottom: 0; right: 0;">
                <img src="https://tedxuniversitasbrawijaya.com/email/chandelier-1.png" alt="Chandelier" width="165" height="162" style="display: block; width: 165px; max-width: 100%; height: 162px;" />
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;
};

export const footer = (): string => {
  return `
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td style="padding: 16px 52px 80px 52px;">
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td width="24" valign="middle">
                <span style="font-weight: 600; color: #545454; letter-spacing: 1px;">CONTACT PERSON</span>
              </td>
            </tr>
            <tr><td height="16"></td></tr>
            <tr>
              <td width="24" valign="middle">
                <span>081251784430 - Akmal</span>
              </td>
            </tr>
            <tr>
              <td width="24" valign="middle">
                <span>087744408583 - Sekar</span>
              </td>
            </tr>
          </table>

          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="padding: 16px 0px;"></table>

          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-top: 1px solid #757575;"></table>

          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="padding: 16px 0px;"></table>

          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td width="30" valign="middle">
                <img src="https://tedxuniversitasbrawijaya.com/email/mdi_instagram.png" width="30" height="30" alt="IG" />
              </td>
              <td width="8"></td>
              <td valign="middle">
                <span style="font-weight: 600;">@tedxuniversitasbrawijaya</span>
              </td>
            </tr>
            <tr><td height="8"></td></tr>
            <tr>
              <td width="30" valign="middle">
                <img src="https://tedxuniversitasbrawijaya.com/email/ic_baseline-email.png" width="30" height="30" alt="Email" />
              </td>
              <td width="8"></td>
              <td valign="middle">
                <span style="font-weight: 600;">tedxub2026@gmail.com</span>
              </td>
            </tr>
          </table>

          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="padding: 16px 0px;"><table/>

          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td width="24" valign="middle">
                <span style="font-style: italic;">Salam hangat,</span>
                </td>
            </tr>
            <tr>
              <td width="24" valign="middle">
                <span style="font-weight: 600;">Tim TEDXUniversitas Brawijaya</span>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;
};

export const detailMerchOrderTable = (
  orderId: string,
  items: {
    name: string;
    quantity: number;
    size?: string;
    price: number;
  }[]
) => {
  const rows = items.map((item) => {
    const price = (item.price * item.quantity).toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    });

    return `
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-bottom: 1px solid #C6C6C6; padding: 12px 0px;">
        <tr>
          <td width="60%" valign="middle" >
            <span style="font-weight: 600;">${item.name} (x${item.quantity})</span>
            <br />
            <span style="font-weight: 600;">${item.size ? `Size: ${item.size}` : ""}</span>
          </td>
          <td width="40%" valign="middle" align="right">
            <span style="font-weight: 600;">${price}</span>
          </td>
        </tr>
      </table>
    `;
  });

  const totalPrice = items
    .reduce((sum, item) => sum + item.price * item.quantity, 0)
    .toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    });

  return `
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F2F2F2; border-radius: 12px; overflow: hidden; padding: 32px 24px 24px 24px;">
      <tr>
        <td>
          <span style="font-size: 1.5rem">Detail Order (${orderId})</span>
        </td>
      </tr>

      <tr><td height="16"></td></tr>

      <tr><td><table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-top: 1px solid #dc2625;"></table></td></tr>

      <tr><td height="16"></td></tr>

      <tr>
        <td width="100%" valign="middle" align="center">
          ${rows.join("")}
        </td>
      </tr>

      <tr><td height="16"></td></tr>

      <tr>
        <td style="border-bottom: 1px solid #C6C6C6; padding-bottom: 12px;">
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td width="60%" valign="middle">
                <span style="font-weight: 600;">Total</span>
              </td>
              <td width="40%" valign="middle" align="right">
                <span style="font-weight: 600;">${totalPrice}</span>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
`;
};

export const detailTicketOrderTable = (
  orderId: string,
  ticket: {
    name: string;
    quantity: number;
    price: number;
  }
) => {
  const price = ticket.price.toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  });

  return `
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F2F2F2; border-radius: 12px; overflow: hidden; padding: 32px 24px 24px 24px;">
      <tr>
        <td>
          <span style="font-size: 1.5rem">Detail Order (${orderId})</span>
        </td>
      </tr>

      <tr><td height="16"></td></tr>

      <tr><td><table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-top: 1px solid #dc2625;"></table></td></tr>

      <tr><td height="16"></td></tr>

      <tr>
        <td width="100%" valign="middle" align="center">
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-bottom: 1px solid #C6C6C6; padding: 12px 0px;">
            <tr>
              <td width="40%" valign="middle" >
                <span style="font-weight: 600;">Tiket yang Dibeli</span>
              </td>
              <td width="60%" valign="middle" align="right">
                <span style="font-weight: 600; text-align: right;">${ticket.name}</span>
              </td>
            </tr>
          </table>
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-bottom: 1px solid #C6C6C6; padding: 12px 0px;">
            <tr>
              <td width="40%" valign="middle" >
                <span style="font-weight: 600;">Jumlah Tiket</span>
              </td>
              <td width="60%" valign="middle" align="right">
                <span style="font-weight: 600; text-align: right;">${ticket.quantity}</span>
              </td>
            </tr>
          </table>
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-bottom: 1px solid #C6C6C6; padding: 12px 0px;">
            <tr>
              <td width="40%" valign="middle" >
                <span style="font-weight: 600;">Harga</span>
              </td>
              <td width="60%" valign="middle" align="right">
                <span style="font-weight: 600; text-align: right;">${price} (x${ticket.quantity})</span>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <tr><td height="16"></td></tr>

      <tr>
        <td style="border-bottom: 1px solid #C6C6C6; padding-bottom: 12px;">
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td width="60%" valign="middle">
                <span style="font-weight: 600;">Total</span>
              </td>
              <td width="40%" valign="middle" align="right">
                <span style="font-weight: 600;">${price}</span>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
`;
};
