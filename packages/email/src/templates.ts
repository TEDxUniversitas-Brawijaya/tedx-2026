import { detailMerchOrderTable, detailTickerOrderTable } from "./components";
import { createEmailLayout } from "./layout";

export type TemplateMap = {
  merchOrder: {
    name: string;
    items: {
      name: string;
      quantity: number;
      size?: string;
      price: number;
    }[];
  };
  ticketOrder: {
    name: string;
    ticket: {
      name: string;
      quantity: number;
      price: number;
      whatsappGroupUrl: string;
    };
    refundUrl: string;
  };
};

export type TemplatesKey = keyof TemplateMap;

type Renderers = {
  [K in TemplatesKey]: (params: TemplateMap[K]) => string;
};

const renderers: Renderers = {
  merchOrder: (params) => {
    const { name, items } = params;

    const content = `
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td>
            <span>Halo ${name}!</span>
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

      ${detailMerchOrderTable(items)}
    `;

    return createEmailLayout(content, {
      preheader: "Terima kasih atas pesanan merchandise Anda!",
    });
  },
  ticketOrder: (params) => {
    const { name, ticket, refundUrl } = params;

    const content = `
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td>
            <span>Halo ${name}!</span>
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
              Gabung grup WhatsApp peserta untuk info terbaru, jadwal, dan pengumuman acara mengenai [nama tiket], [day ticket]!
            </span>
          </td>
        </tr>
        <tr><td height="4"></td></tr>
        <tr>
          <td align="left">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0">
              <tr>
                <td bgcolor="#0E5454" style="border-radius: 8px;">
                  <a href="${ticket.whatsappGroupUrl}" target="_blank" style="display: inline-block; padding: 16px 24px; color: #ffffff; text-decoration: none;">
                    Gabung Grup WhatsApp
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr><td height="16"></td></tr>
        <tr><td style="border-top: 1px solid #ccc;"></td></tr>
        <tr><td height="16"></td></tr>
        <tr>
          <td>
            <span>
              Apabila kamu memiliki kendala dan ingin mengajukan pengembalian dana (refund) tiket, silakan kunjungi laman refund <a href="${refundUrl}" target="_blank" style="color: #DC2625; text-decoration: none; font-weight: 700;">disini</a>.
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

      ${detailTickerOrderTable(ticket)}
    `;

    return createEmailLayout(content, {
      preheader: "Terima kasih atas pesanan tiket Anda!",
    });
  },
};

export const createTemplate = <K extends TemplatesKey>(
  type: K,
  params: TemplateMap[K]
): string => {
  return renderers[type](params);
};
