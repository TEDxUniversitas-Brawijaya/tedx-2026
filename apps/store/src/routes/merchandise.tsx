import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/merchandise")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/merchandise"!</div>;
}
