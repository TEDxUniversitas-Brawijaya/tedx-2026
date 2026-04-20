export const header = (): string => {
  return `
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td class="header-bg" style="background-color: #242424;">
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="position: relative;">
            <tr>
              <td class="header-padding" valign="middle" align="left" style="padding: 20px 48px; position: relative; z-index: 2;">
                <img src="https://tedxuniversitasbrawijaya.com/email/logo.png" alt="Logo TEDxUniversitasBrawijaya" width="228" height="60" style="display: block; width: 228px; max-width: 100%; height: 60px; aspect-ratio: 3.78 / 1; object-fit: contain;" />
              </td>
              <td valign="top" align="right" style="padding: 0; position: absolute; bottom: 0; right: 0; z-index: 1;">
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
        <td class="footer-padding" style="padding: 16px 52px 80px 52px; background-color: #FFFDF7;">
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
                <a href="https://www.instagram.com/tedxuniversitasbrawijaya/" target="_blank" rel="noopener noreferrer" style="font-weight: 600; text-decoration: none; color: black;">@tedxuniversitasbrawijaya</a>
              </td>
            </tr>
            <tr><td height="8"></td></tr>
            <tr>
              <td width="30" valign="middle">
                <img src="https://tedxuniversitasbrawijaya.com/email/ic_baseline-email.png" width="30" height="30" alt="Email" />
              </td>
              <td width="8"></td>
              <td valign="middle">
                <a href="mailto:tedxub2026@gmail.com" target="_blank" rel="noopener noreferrer" style="font-weight: 600; text-decoration: none; color: black;">tedxub2026@gmail.com</a>
              </td>
            </tr>
          </table>

          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="padding: 16px 0px;"></table>

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
    variants?: { label: string; value: string }[];
    bundleProducts?: {
      name: string;
      variants?: { label: string; value: string }[];
    }[];
    price: number;
  }[]
) => {
  const rows = items.map((item) => {
    const price = item.price.toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    });

    const totalPrice = (item.price * item.quantity).toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    });

    const getDetail = (
      variants?: { label: string; value: string }[],
      bundleProducts?: {
        name: string;
        variants?: { label: string; value: string }[];
      }[]
    ) => {
      if (variants && variants.length > 0) {
        return variants.map((v) => `${v.label}: ${v.value}`).join(", ");
      }

      if (bundleProducts && bundleProducts.length > 0) {
        return bundleProducts
          .map((b) => {
            const variantText =
              b.variants && b.variants.length > 0
                ? `(${b.variants.map((v) => `${v.label}: ${v.value}`).join(", ")})`
                : "";

            return `${b.name} ${variantText}`;
          })
          .join(", ");
      }

      return null;
    };

    const detail = getDetail(item.variants, item.bundleProducts);

    return `
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-bottom: 1px solid #C6C6C6; padding: 12px 0px;">
        <tr>
          <td width="40%" valign="middle" align="left">
            <span class="table-content" style="font-size: 16px; text-align: left;">${item.name} ${detail ? `: ${detail}` : ""}</span>
          </td>
          <td width="20%" valign="middle" align="center">
            <span class="table-content" style="font-size: 16px; text-align: center;">${price}</span>
          </td>
          <td width="20%" valign="middle" align="center">
            <span class="table-content" style="font-size: 16px; text-align: center;">${item.quantity}</span>
          </td>
          <td width="20%" valign="middle" align="right">
            <span class="table-content" style="font-size: 16px; text-align: right;">${totalPrice}</span>
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
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="detail-box" style="background-color: #F2F2F2; border-radius: 12px; overflow: hidden; padding: 32px 24px 24px 24px;">
      <tr>
        <td>
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td align="left" width="50%" valign="middle">
                <span class="detail-title" style="font-size: 1.5rem">Detail Order</span>
              </td>
              <td align="right" width="50%" valign="middle">
                <span class="order-number" style="font-size: 1rem;">NO. PESANAN ${orderId}</span>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <tr><td height="16"></td></tr>

      <tr><td><table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-top: 1px solid #dc2625;"></table></td></tr>

      <tr><td height="16"></td></tr>

      <tr>
        <td width="100%" valign="middle" align="center">
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td width="40%" valign="middle" align="left">
                <span class="table-header" style="font-weight: 600; font-size: 18px;">Produk</span>
              </td>
              <td width="20%" valign="middle" align="center">
                <span class="table-header" style="font-weight: 600; font-size: 18px;">Harga Satuan</span>
              </td>
              <td width="20%" valign="middle" align="center">
                <span class="table-header" style="font-weight: 600; font-size: 18px;">Jumlah</span>
              </td>
              <td width="20%" valign="middle" align="right">
                <span class="table-header" style="font-weight: 600; font-size: 18px;">Total Harga</span>
              </td>
            </tr>
          </table>
          ${rows.join("")}
        </td>
      </tr>

      <tr><td height="16"></td></tr>

      <tr>
        <td style="border-bottom: 1px solid #C6C6C6; padding-bottom: 12px;">
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td width="60%" valign="middle">
                <span style="font-weight: 600;">Total Harga</span>
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
    bundleProducts?: {
      name: string;
      variants?: { label: string; value: string }[];
    }[];
  }
) => {
  const price = ticket.price.toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  });

  const totalPrice = (ticket.price * ticket.quantity).toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  });

  const getDetail = (
    bundleProducts?: {
      name: string;
      variants?: { label: string; value: string }[];
    }[]
  ) => {
    if (bundleProducts && bundleProducts.length > 0) {
      return bundleProducts
        .map((b) => {
          const variantText =
            b.variants && b.variants.length > 0
              ? `(${b.variants.map((v) => `${v.label}: ${v.value}`).join(", ")})`
              : "";

          return `${b.name} ${variantText}`;
        })
        .join(", ");
    }

    return null;
  };

  const detail = getDetail(ticket.bundleProducts);

  return `
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="detail-box" style="background-color: #F2F2F2; border-radius: 12px; overflow: hidden; padding: 32px 24px 24px 24px;">
      <tr>
        <td>
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td align="left" width="50%" valign="middle">
                <span class="detail-title" style="font-size: 1.5rem">Detail Order</span>
              </td>
              <td align="right" width="50%" valign="middle">
                <span class="order-number" style="font-size: 1rem;">NO. PESANAN ${orderId}</span>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <tr><td height="16"></td></tr>

      <tr><td><table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-top: 1px solid #dc2625;"></table></td></tr>

      <tr><td height="16"></td></tr>

      <tr>
        <td width="100%" valign="middle" align="center">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td width="40%" valign="middle" align="left">
                <span class="table-header" style="font-weight: 600; font-size: 18px;">Produk</span>
              </td>
              <td width="20%" valign="middle" align="center">
                <span class="table-header" style="font-weight: 600; font-size: 18px;">Harga Satuan</span>
              </td>
              <td width="20%" valign="middle" align="center">
                <span class="table-header" style="font-weight: 600; font-size: 18px;">Jumlah</span>
              </td>
              <td width="20%" valign="middle" align="right">
                <span class="table-header" style="font-weight: 600; font-size: 18px;">Total Harga</span>
              </td>
            </tr>
          </table>
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-bottom: 1px solid #C6C6C6; padding: 12px 0px;">
        <tr>
          <td width="40%" valign="middle" align="left">
            <span class="table-content" style="font-size: 16px; text-align: left;">${ticket.name} ${detail ? `: ${detail}` : ""}</span>
          </td>
          <td width="20%" valign="middle" align="center">
            <span class="table-content" style="font-size: 16px; text-align: center;">${price}</span>
          </td>
          <td width="20%" valign="middle" align="center">
            <span class="table-content" style="font-size: 16px; text-align: center;">${ticket.quantity}</span>
          </td>
          <td width="20%" valign="middle" align="right">
            <span class="table-content" style="font-size: 16px; text-align: right;">${totalPrice}</span>
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
                <span style="font-weight: 600;">Total Harga</span>
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
