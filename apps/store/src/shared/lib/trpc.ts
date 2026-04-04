import type { TRPCRouter } from "@tedx-2026/api";
import { createTRPCClient, httpBatchStreamLink } from "@trpc/client";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import SuperJSON from "superjson";
import { queryClient } from "./query-client";

export const trpcClient = createTRPCClient<TRPCRouter>({
  links: [
    httpBatchStreamLink({
      url: `${import.meta.env.VITE_PUBLIC_API_URL || "http://localhost:3000"}/trpc`,
      transformer: SuperJSON,
      fetch(_url, options) {
        return fetch(_url, {
          ...options,
          credentials: "include",
        });
      },
    }),
  ],
});

export const trpc = createTRPCOptionsProxy<TRPCRouter>({
  client: trpcClient,
  queryClient,
});
