import { RefundPageContainer } from "@/features/refund/containers/refund-page-container";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/refund/$refundToken")({
  component: RouteComponent,
});

function RouteComponent() {
  const { refundToken } = Route.useParams();

  return <RefundPageContainer refundToken={refundToken} />;
}
