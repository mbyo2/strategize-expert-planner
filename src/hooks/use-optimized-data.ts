
import { UseQueryOptions, useQuery } from '@tanstack/react-query';
import { DefinedUseQueryResult, UseQueryResult } from '@tanstack/react-query';
import { useCallback } from 'react';
import { startMeasure, endMeasure } from '@/utils/performanceMonitoring';

const useOptimizedData = <TData, TError = Error>({
  queryKey,
  queryFn,
  options = {},
  timeoutMs = 5000,
  initialData,
  measurementName,
}: {
  queryKey: string[];
  queryFn: () => Promise<TData>;
  options?: Omit<UseQueryOptions<TData, TError, TData>, 'queryKey' | 'queryFn'>;
  timeoutMs?: number;
  initialData?: TData;
  measurementName?: string;
}): UseQueryResult<TData, TError> => {
  // Add performance measurement to query function
  const wrappedQueryFn = useCallback(async () => {
    if (measurementName) {
      startMeasure(measurementName);
    }
    
    try {
      const result = await Promise.race([
        queryFn(),
        new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error('Query timeout')), timeoutMs);
        }),
      ]);
      
      return result;
    } finally {
      if (measurementName) {
        endMeasure(measurementName);
      }
    }
  }, [queryFn, timeoutMs, measurementName]);
  
  // Create error handler method instead of using meta.onError
  const handleError = (error: Error) => {
    console.error(`Query error for ${queryKey.join('/')}:`, error);
    // Additional error handling as needed
  };
  
  // Define query options with proper error handling approach
  const queryOptions: UseQueryOptions<TData, TError, TData> = {
    ...options,
    enabled: options.enabled !== undefined ? options.enabled : true,
    staleTime: options.staleTime || 1000 * 60, // 1 minute by default
    retry: options.retry !== undefined ? options.retry : 1,
    meta: {
      ...(options.meta || {}),
      errorHandler: (error: Error) => {
        handleError(error);
        // Call the original error handler if provided
        if (options.meta?.errorHandler) {
          options.meta.errorHandler(error);
        }
      }
    }
  };
  
  if (initialData !== undefined) {
    return useQuery({
      queryKey,
      queryFn: wrappedQueryFn,
      initialData,
      ...queryOptions,
    }) as DefinedUseQueryResult<TData, TError>;
  }
  
  return useQuery({
    queryKey,
    queryFn: wrappedQueryFn,
    ...queryOptions,
  });
};

export default useOptimizedData;
