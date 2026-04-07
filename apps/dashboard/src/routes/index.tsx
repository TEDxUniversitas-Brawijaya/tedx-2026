import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  loader: ({ location }) => {
    if (location.pathname === "/") {
      redirect({
        to: "/dashboard",
        throw: true,
      });
    }
  },
});
