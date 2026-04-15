// Date label mapper: provides frontend date text fallback by ticket product ID.
const ticketDateLabelByProductId: Record<string, string> = {
  prod_ticket_main_event: "Main Event â€¢ 31 Mei 2026",
  prod_ticket_propa_day1: "Propaganda 3 â€¢ Day 1 â€¢ 29 Mei 2026",
  prod_ticket_bundle_main_plus_merch_pick: "Main Event Bundle â€¢ 31 Mei 2026",
  prod_ticket_bundle_vip_waiting: "VIP Bundle â€¢ Coming Soon",
  prod_ticket_partner_passthrough: "Partner Allocation",
};

export const getTicketDateLabel = (
  productId: string,
  fallback?: string | null
) => {
  return ticketDateLabelByProductId[productId] ?? fallback ?? "Jadwal menyusul";
};
