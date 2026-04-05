import { authClient } from "@/shared/lib/auth";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: RouteComponent,
  beforeLoad: async () => {
    const session = await authClient.getSession();
    if (!session.data) {
      redirect({
        to: "/auth/login",
        throw: true,
      });
    }
    return { session };
  },
});

function RouteComponent() {
  return <div>Hello "/"!</div>;
}
