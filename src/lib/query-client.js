import { QueryClient } from '@tanstack/react-query';

export const queryClientInstance = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,           // 1 min
      gcTime: 5 * 60 * 1000,          // 5 min
      refetchOnWindowFocus: false,
      retry: (failureCount, err) => {
        // Don't retry 401/403/404 — they'll never succeed
        if (err?.status === 401 || err?.status === 403 || err?.status === 404) return false;
        return failureCount < 2;
      },
    },
    mutations: {
      retry: false,
    },
  },
});
