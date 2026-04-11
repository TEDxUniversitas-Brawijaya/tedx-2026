import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "../shared/components/coming-soon";
export const Route = createFileRoute("/merchandise")({
  component: RouteComponent,
});

function RouteComponent() {
  return <ComingSoon />;
}
