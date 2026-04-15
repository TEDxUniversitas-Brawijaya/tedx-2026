// Tickets page composer: stitches hero, products, checkout, and order detail sections.
import { TicketHeroStorySection } from "./ticket-hero-story-section";
import { TicketCheckoutContainer } from "../containers/ticket-checkout-container";
import { TicketOrderDetailContainer } from "../containers/ticket-order-detail-container";
import { TicketProductsContainer } from "../containers/ticket-products-container";

export const TicketsPage = () => {
  return (
    <main>
      <TicketHeroStorySection />
      <TicketProductsContainer />
      <TicketCheckoutContainer />
      <TicketOrderDetailContainer />
    </main>
  );
};
