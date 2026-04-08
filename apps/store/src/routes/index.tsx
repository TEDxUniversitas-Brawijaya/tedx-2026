import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  loader: () => {
    throw redirect({
      // TODO: Change to ticketing page when it's ready or just check the date
      to: "/merchandise",
    });
  },
});
