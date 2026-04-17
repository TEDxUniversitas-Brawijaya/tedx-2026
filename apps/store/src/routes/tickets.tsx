import { createFileRoute } from "@tanstack/react-router";
import { TicketsHero } from "@/features/tickets/components/tickets-hero";
import { TicketCheckoutContainer } from "@/features/tickets/containers/ticket-checkout-container";
import { Footer } from "../shared/components/footer";
import { Navbar } from "../shared/components/navbar";

export const Route = createFileRoute("/tickets")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main>
      <Navbar />
      <TicketsHero />
      <TicketCheckoutContainer />
      <Footer />
    </main>
  );
}
