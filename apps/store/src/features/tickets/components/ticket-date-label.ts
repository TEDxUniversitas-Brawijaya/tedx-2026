const ticketDateLabelByProductId: Record<string, string> = {
  prod_tkt_p3d1: "Propaganda 3 • Day 1 • 10 Agustus 2026",
  prod_tkt_p3d2: "Propaganda 3 • Day 2 • 11 Agustus 2026",
  prod_tkt_main: "Main Event • 17 Agustus 2026",
  prod_tkt_b_1: "2 Day Pass Propaganda 3 • 10-11 Agustus 2026",
  prod_tkt_b_2: "Main Event + Keychain • 17 Agustus 2026",
  prod_tkt_b_3: "Main Event + Socks • 17 Agustus 2026",
  prod_tkt_b_4: "Main Event + Stickers • 17 Agustus 2026",
};

export const getTicketDateLabel = (
  productId: string,
  fallback?: string | null
) => {
  return ticketDateLabelByProductId[productId] ?? fallback ?? "Jadwal menyusul";
};
