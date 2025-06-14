
import React from 'react';
import { QueryClient as TanstackQueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new TanstackQueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

interface QueryClientProps {
  children: React.ReactNode;
}

const QueryClient: React.FC<QueryClientProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

export default QueryClient;
