// Ticket route entry: mounts the composition-only TicketsPage for storefront flow.
import { createFileRoute } from "@tanstack/react-router";
import { TicketsPage } from "@/features/tickets/components/tickets-page";

export const Route = createFileRoute("/tickets")({
  component: RouteComponent,
});

function RouteComponent() {
  return <TicketsPage />;
}
