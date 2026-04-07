import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/analytics")({
  loader: () => {
    throw redirect({
      // This is intentionally redirected to the public Umami dashboard
      href: "https://cloud.umami.is/share/gAicCLP053bs69bR",
    });
  },
});
