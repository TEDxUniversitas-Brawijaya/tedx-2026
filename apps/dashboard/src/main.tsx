import { Toaster } from "@tedx-2026/ui/components/sonner";
import { ThemeProvider } from "@tedx-2026/ui/components/theme-provider";
import { TooltipProvider } from "@tedx-2026/ui/components/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import ReactDOM from "react-dom/client";
import { routeTree } from "./routeTree.gen";
import { queryClient } from "./shared/lib/query-client";

const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  defaultPendingComponent: () => {
    // TODO: Replace with proper loading state
    return <div>Loading...</div>;
  },
  defaultNotFoundComponent: () => {
    // TODO: Replace with proper 404 page
    return <div>Not Found</div>;
  },
  Wrap({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <TooltipProvider>
            {children}
            <Toaster richColors />
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    );
  },
});

declare module "@tanstack/react-router" {
  // biome-ignore lint/style/useConsistentTypeDefinitions: false positive
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<RouterProvider router={router} />);
}
