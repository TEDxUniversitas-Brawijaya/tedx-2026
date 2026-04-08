import { QueryClient } from "@tanstack/react-query";
import SuperJSON from "superjson";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
    dehydrate: {
      serializeData: SuperJSON.serialize,
    },
    hydrate: {
      deserializeData: SuperJSON.deserialize,
    },
  },
});
