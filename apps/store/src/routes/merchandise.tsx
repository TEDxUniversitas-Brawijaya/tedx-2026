import { createFileRoute } from "@tanstack/react-router";
import MerchContainer from "../features/merchandise/container/merch-container";

export const Route = createFileRoute("/merchandise")({
  component: RouteComponent,
});

function RouteComponent() {
  return <MerchContainer />;
}
