
import { UseQueryOptions, useQuery } from '@tanstack/react-query';

export function useOptimizedData<TData, TError>(
  queryKey: string[],
  queryFn: () => Promise<TData>,
  options?: Omit<UseQueryOptions<TData, TError, TData>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey,
    queryFn,
    ...options,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30,   // 30 minutes
    retry: 1,
    meta: {
      ...options?.meta,
      errorHandler: (error: Error) => {
        console.error('Query error:', error);
      }
    }
  });
}
