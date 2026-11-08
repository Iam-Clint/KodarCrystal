import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ApiError } from "@/lib/backend/client";

export function BackendQueryProvider({ children }: { children: React.ReactNode }) {
  // A fresh cache per mounted tree also prevents SSR requests sharing user data.
  const [client] = useState(() => new QueryClient({ defaultOptions: {
    queries: { staleTime: 30_000, retry: (count, error) => count < 2 && (!(error instanceof ApiError) || error.status === 0 || error.status >= 500) },
    mutations: { retry: false },
  } }));
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
