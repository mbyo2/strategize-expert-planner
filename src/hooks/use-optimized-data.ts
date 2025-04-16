
import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { useState, useCallback, useEffect } from 'react';
import { startMeasure, endMeasure } from '@/utils/performanceMonitoring';
import { toast } from 'sonner';

/**
 * Custom hook for optimized data fetching that includes:
 * - Performance monitoring
 * - Smart refetching based on visibility
 * - Automatic error handling
 */
export function useOptimizedQuery<TData, TError = Error>(
  queryKey: string[],
  queryFn: () => Promise<TData>,
  options?: Omit<UseQueryOptions<TData, TError, TData>, 'queryKey' | 'queryFn'>
) {
  const measureKey = `query:${queryKey.join('.')}`;
  const enhancedQueryFn = async () => {
    startMeasure(measureKey);
    try {
      const result = await queryFn();
      return result;
    } finally {
      endMeasure(measureKey);
    }
  };

  // Track document visibility for smart refetching
  const [isVisible, setIsVisible] = useState(!document.hidden);
  
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Create proper meta object with errorHandler
  const metaWithErrorHandler = {
    ...(options?.meta || {}),
    errorHandler: (error: TError) => {
      console.error(`Query error for ${queryKey.join('.')}:`, error);
      toast.error('Data loading error', {
        description: (error as Error).message || 'Failed to load data',
      });
      if (options?.meta?.errorHandler) {
        options.meta.errorHandler(error);
      }
    }
  };

  return useQuery({
    queryKey,
    queryFn: enhancedQueryFn,
    // Only refetch on window focus if the document is visible
    refetchOnWindowFocus: isVisible,
    // Merge in custom options and meta
    ...(options || {}),
    meta: metaWithErrorHandler
  });
}

/**
 * Custom hook for optimized data mutations that includes:
 * - Performance monitoring
 * - Automatic error handling
 * - Success messages
 */
export function useOptimizedMutation<TData, TVariables, TError = Error, TContext = unknown>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: Omit<UseMutationOptions<TData, TError, TVariables, TContext>, 'mutationFn'>
) {
  const queryClient = useQueryClient();
  const [operationId] = useState(() => Math.random().toString(36).substring(2, 9));
  const measureKey = `mutation:${operationId}`;

  const enhancedMutationFn = async (variables: TVariables) => {
    startMeasure(measureKey);
    try {
      return await mutationFn(variables);
    } finally {
      endMeasure(measureKey);
    }
  };

  // Create proper meta object with errorHandler
  const metaWithErrorHandler = {
    ...(options?.meta || {}),
    errorHandler: (error: TError) => {
      console.error('Mutation error:', error);
      toast.error('Operation failed', {
        description: (error as Error).message || 'Failed to complete operation',
      });
      if (options?.meta?.errorHandler) {
        options.meta.errorHandler(error);
      }
    }
  };

  return useMutation({
    mutationFn: enhancedMutationFn,
    // Combine with user options
    ...(options || {}),
    // Use our enhanced meta
    meta: metaWithErrorHandler
  });
}
