const ticketDateLabelByProductId: Record<string, string> = {
  prod_tkt_p3d1: "10-08-2026",
  prod_tkt_p3d2: "11-08-2026",
  prod_tkt_main: "17-08-2026",
  prod_tkt_b_1: "10-08-2026, 11-08-2026",
  prod_tkt_b_2: "10-08-2026, 17-08-2026",
  prod_tkt_b_3: "11-08-2026, 17-08-2026",
  prod_tkt_b_4: "10-08-2026, 11-08-2026, 17-08-2026",
};

export const getTicketDateLabel = (
  productId: string,
  fallback?: string | null
) => {
  return ticketDateLabelByProductId[productId] ?? fallback ?? "Jadwal menyusul";
};
