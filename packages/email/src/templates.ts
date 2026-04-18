import { detailMerchOrderTable, detailTicketOrderTable } from "./components";
import { createEmailLayout } from "./layout";

export type TemplateMap = {
  merchOrder: {
    orderId: string;
    items: {
      name: string;
      quantity: number;
      variants?: { label: string; value: string }[];
      price: number;
    }[];
  };
  merchOrderExpired: {
    orderId: string;
    items: {
      name: string;
      quantity: number;
      variants?: { label: string; value: string }[];
      price: number;
    }[];
  };
  merchOrderRejected: {
    orderId: string;
    items: {
      name: string;
      quantity: number;
      variants?: { label: string; value: string }[];
      price: number;
    }[];
    reason: string;
  };
  ticketOrder: {
    orderId: string;
    // this is singular since ticket order only has 1 ticket item
    item: {
      name: string;
      quantity: number;
      price: number;

      tickets: {
        eventName: string;
        eventDate: string;
        whatsappGroupUrl: string;
      }[];
    };
    refundUrl: string;
  };
  ticketOrderExpired: {
    orderId: string;
    item: {
      name: string;
      quantity: number;
      price: number;
    };
  };
  ticketOrderRejected: {
    orderId: string;
    item: {
      name: string;
      quantity: number;
      price: number;
    };
    reason: string;
  };
};

export type TemplatesKey = keyof TemplateMap;

type Renderers = {
  [K in TemplatesKey]: (params: TemplateMap[K]) => string;
};

const renderers: Renderers = {
  merchOrder: (params) => {
    const { orderId, items } = params;

    const content = `
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td>
            <span>Halo!</span>
          </td>
        </tr>
        <tr><td height="16"></td></tr>
        <tr>
          <td>
            <span>
              Terima kasih atas antusiasme kamu dalam pembelian official merchandise TEDxUniversitasBrawijaya 2026!
            </span>
          </td>
        </tr>
        <tr><td height="16"></td></tr>
        <tr>
          <td>
            <span>
              Pembayaran kamu telah berhasil diproses. Saat ini, pesanan kamu sedang masuk dalam tahap pemrosesan. Mohon kesediaannya menunggu beberapa waktu sampai merchandise-mu siap untuk diambil. Jika ada pertanyaan mengenai detail pesanan atau pengambilan, jangan ragu untuk menghubungi contact person yang tertera pada email ini.
            </span>
          </td>
        </tr>
        <tr><td height="16"></td></tr>
        <tr>
          <td>
            <span>
              Terima kasih!
            </span>
          </td>
        </tr>
      </table>

      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="padding: 16px 0px;"></table>

      ${detailMerchOrderTable(orderId, items)}
    `;

    return createEmailLayout(content, {
      preheader: "Terima kasih atas pesanan merchandise Anda!",
    });
  },
  merchOrderExpired: (params) => {
    const { orderId, items } = params;

    const content = `
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td>
            <span>Halo!</span>
          </td>
        </tr>
        <tr><td height="16"></td></tr>
        <tr>
          <td>
            <span>
              Terima kasih atas antusiasme kamu dalam pembelian official merchandise TEDxUniversitasBrawijaya 2026!
            </span>
          </td>
        </tr>
        <tr><td height="16"></td></tr>
        <tr>
          <td>
            <span>
              Kami ingin menginformasikan bahwa pesanan kamu tidak dapat diproses lebih lanjut karena pembayaran yang dilakukan tidak terverifikasi oleh sistem kami. Oleh karena itu, status pesanan kamu saat ini telah kadaluarsa (expired).
            </span>
          </td>
        </tr>
        <tr><td height="16"></td></tr>
        <tr>
          <td>
            <span>
              Kamu tetap memiliki kesempatan untuk melakukan pemesanan ulang dengan mengikuti prosedur pembayaran yang benar.
            </span>
          </td>
        </tr>
        <tr><td height="16"></td></tr>
        <tr>
          <td>
            <span>
              Apabila kamu merasa terjadi kesalahan atau memiliki kendala terkait proses pembayaran, silakan hubungi contact person yang tertera di bawah ini.
            </span>
          </td>
        </tr>
        <tr><td height="16"></td></tr>
        <tr>
          <td>
            <span>Terima kasih atas pengertianmu.</span>
          </td>
        </tr>
      </table>

      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="padding: 16px 0px;"></table>

      ${detailMerchOrderTable(orderId, items)}
    `;

    return createEmailLayout(content, {
      preheader: "Pesanan merchandise Anda telah kadaluarsa",
    });
  },
  merchOrderRejected: (params) => {
    const { orderId, items, reason } = params;

    const content = `
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td>
            <span>Halo!</span>
          </td>
        </tr>
        <tr><td height="16"></td></tr>
        <tr>
          <td>
            <span>
              Terima kasih atas antusiasme kamu dalam pembelian official merchandise TEDxUniversitasBrawijaya 2026!
            </span>
          </td>
        </tr>
        <tr><td height="16"></td></tr>
        <tr>
          <td>
            <span>
              Kami ingin menginformasikan bahwa pesanan kamu tidak dapat diproses lebih lanjut karena pembayaran yang dilakukan tidak valid. Oleh karena itu, status pesanan kamu saat ini ditolak (rejected) karena <span style="font-weight: 700;">${reason}</span>.
            </span>
          </td>
        </tr>
        <tr><td height="16"></td></tr>
        <tr>
          <td>
            <span>
              Kamu tetap memiliki kesempatan untuk melakukan pemesanan ulang dengan mengikuti prosedur pembayaran yang benar.
            </span>
          </td>
        </tr>
        <tr><td height="16"></td></tr>
        <tr>
          <td>
            <span>
              Apabila kamu merasa terjadi kesalahan atau memiliki kendala terkait proses pembayaran, silakan hubungi contact person yang tertera di bawah ini.
            </span>
          </td>
        </tr>
        <tr><td height="16"></td></tr>
        <tr>
          <td>
            <span>Terima kasih atas pengertianmu.</span>
          </td>
        </tr>
      </table>

      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="padding: 16px 0px;"></table>

      ${detailMerchOrderTable(orderId, items)}
    `;

    return createEmailLayout(content, {
      preheader: "Pesanan merchandise Anda telah kadaluarsa",
    });
  },
  ticketOrder: (params) => {
    const { orderId, item, refundUrl } = params;

    const content = `
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td>
            <span>Halo!</span>
          </td>
        </tr>
        <tr><td height="16"></td></tr>
        <tr>
          <td>
            <span>
              Terima kasih atas antusiasme kamu untuk menjadi bagian dari perjalanan bertumbuh bersama TEDxUniversitasBrawijaya 2026!
            </span>
          </td>
        </tr>
        <tr><td height="16"></td></tr>
        <tr>
          <td>
            <span>
              Pembayaran kamu telah berhasil diproses. Tiket ini adalah pintu masuk-mu menuju ruang tempat berbagai kisah dari perjalanan hidup dipertemukan. Pastikan kamu menyimpan tiket ini dengan aman dan membawanya saat hari penukaran tiket dan/atau Hari-H acara diselenggarakan.
            </span>
          </td>
        </tr>
        <tr><td height="16"></td></tr>
        <tr>
          <td>
            <span>
              Kami sangat menantikan kehadiran dan cerita yang akan kamu bawa. Siapkan dirimu untuk saling mendengar dan membangun makna baru di rumah kita nanti!
            </span>
          </td>
        </tr>
        <tr><td height="16"></td></tr>
        <tr><td style="border-top: 1px solid #ccc;"></td></tr>
        <tr><td height="16"></td></tr>
        <tr>
          <td>
            <span>
              Gabung grup WhatsApp peserta untuk info terbaru, jadwal, dan pengumuman acara mengenai ${item.tickets.map((t) => `${t.eventName} (${t.eventDate})`).join(", ")}!
            </span>
          </td>
        </tr>
        <tr><td height="4"></td></tr>
        <tr>
          <td align="left">
            ${item.tickets
              .map(
                (t) => `
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="display: inline-block; margin-right: 8px; margin-bottom: 8px;">
              <tr>
                <td bgcolor="#0E5454" style="border-radius: 8px;">
                  <a href="${t.whatsappGroupUrl}" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 12px 20px; color: #ffffff; text-decoration: none;">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td valign="middle">
                          <img src="https://tedxuniversitasbrawijaya.com/email/ic_baseline-whatsapp.png" width="16" height="16" alt="Whatsapp" />
                        </td>
                        <td width="8"></td>
                        <td valign="middle" style="color: #ffffff; font-size: 14px;">
                          Gabung Grup WhatsApp ${t.eventName} (${t.eventDate})
                        </td>
                      </tr>
                    </table>
                  </a>
                </td>
              </tr>
            </table>
            `
              )
              .join("")}
          </td>
        </tr>
        <tr><td height="16"></td></tr>
        <tr><td style="border-top: 1px solid #ccc;"></td></tr>
        <tr><td height="16"></td></tr>
        <tr>
          <td>
            <span>
              Apabila kamu memiliki kendala dan ingin mengajukan pengembalian dana (refund) tiket, silakan kunjungi laman refund <a href="${refundUrl}" target="_blank" rel="noopener noreferrer" style="color: #DC2625; text-decoration: none; font-weight: 700;">disini</a>.
            </span>
          </td>
        </tr>
        <tr><td height="16"></td></tr>
        <tr>
          <td>
            <span>Terima kasih!</span>
          </td>
        </tr>
      </table>

      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="padding: 16px 0px;"></table>

      ${detailTicketOrderTable(orderId, item)}
    `;

    return createEmailLayout(content, {
      preheader: "Terima kasih atas pesanan tiket Anda!",
    });
  },
  ticketOrderExpired: (params) => {
    const { orderId, item } = params;

    const content = `
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td>
            <span>Halo!</span>
          </td>
        </tr>
        <tr><td height="16"></td></tr>
        <tr>
          <td>
            <span>
              Terima kasih atas antusiasme kamu untuk menjadi bagian dari perjalanan bertumbuh bersama TEDxUniversitasBrawijaya 2026!
            </span>
          </td>
        </tr>
        <tr><td height="16"></td></tr>
        <tr>
          <td>
            <span>
              Kami ingin menginformasikan bahwa pesanan kamu tidak dapat diproses lebih lanjut karena pembayaran yang dilakukan tidak terverifikasi oleh sistem kami. Oleh karena itu, status pesanan kamu saat ini telah kadaluarsa (expired).
            </span>
          </td>
        </tr>
        <tr><td height="16"></td></tr>
        <tr>
          <td>
            <span>
              Kamu tetap memiliki kesempatan untuk melakukan pemesanan ulang dengan mengikuti prosedur pembayaran yang benar.
            </span>
          </td>
        </tr>
        <tr><td height="16"></td></tr>
        <tr>
          <td>
            <span>
              Apabila kamu merasa terjadi kesalahan atau memiliki kendala terkait proses pembayaran, silakan hubungi contact person yang tertera di bawah ini.
            </span>
          </td>
        </tr>
        <tr><td height="16"></td></tr>
        <tr>
          <td>
            <span>Terima kasih atas pengertianmu.</span>
          </td>
        </tr>
      </table>

      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="padding: 16px 0px;"></table>

      ${detailTicketOrderTable(orderId, item)}
    `;

    return createEmailLayout(content, {
      preheader: "Pesanan tiket Anda telah kadaluarsa",
    });
  },
  ticketOrderRejected: (params) => {
    const { orderId, item, reason } = params;

    const content = `
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td>
            <span>Halo!</span>
          </td>
        </tr>
        <tr><td height="16"></td></tr>
        <tr>
          <td>
            <span>
              Terima kasih atas antusiasme kamu untuk menjadi bagian dari perjalanan bertumbuh bersama TEDxUniversitasBrawijaya 2026!
            </span>
          </td>
        </tr>
        <tr><td height="16"></td></tr>
        <tr>
          <td>
            <span>
              Kami ingin menginformasikan bahwa pesanan kamu tidak dapat diproses lebih lanjut karena pembayaran yang dilakukan tidak valid. Oleh karena itu, status pesanan kamu saat ini ditolak (rejected) karena <span style="font-weight: 700;">${reason}</span>.
            </span>
          </td>
        </tr>
        <tr><td height="16"></td></tr>
        <tr>
          <td>
            <span>
              Kamu tetap memiliki kesempatan untuk melakukan pemesanan ulang dengan mengikuti prosedur pembayaran yang benar.
            </span>
          </td>
        </tr>
        <tr><td height="16"></td></tr>
        <tr>
          <td>
            <span>
              Apabila kamu merasa terjadi kesalahan atau memiliki kendala terkait proses pembayaran, silakan hubungi contact person yang tertera di bawah ini.
            </span>
          </td>
        </tr>
        <tr><td height="16"></td></tr>
        <tr>
          <td>
            <span>Terima kasih atas pengertianmu.</span>
          </td>
        </tr>
      </table>

      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="padding: 16px 0px;"></table>

      ${detailTicketOrderTable(orderId, item)}
    `;

    return createEmailLayout(content, {
      preheader: "Pesanan tiket Anda ditolak",
    });
  },
};

export const createTemplate = <K extends TemplatesKey>(
  type: K,
  params: TemplateMap[K]
): string => {
  return renderers[type](params);
};
