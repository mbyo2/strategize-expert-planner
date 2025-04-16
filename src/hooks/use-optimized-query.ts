
import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useIsMobile } from './use-mobile';
import { isOnline, retrieveData, storeData } from '@/services/offlineService';
import { toast } from 'sonner';

interface OptimizedQueryOptions<TData, TError> extends Omit<UseQueryOptions<TData, TError, TData>, 'queryKey' | 'queryFn'> {
  cacheKey: string;
  mobilePriority?: 'high' | 'medium' | 'low';
  offlineCapable?: boolean;
}

/**
 * Custom hook for optimized data loading with mobile and offline support
 */
export function useOptimizedQuery<TData, TError = Error>(
  queryKey: string[],
  queryFn: () => Promise<TData>,
  options: OptimizedQueryOptions<TData, TError>
): UseQueryResult<TData, TError> & { isOfflineData: boolean } {
  const { 
    cacheKey, 
    mobilePriority = 'medium', 
    offlineCapable = false,
    ...queryOptions 
  } = options;
  
  const isMobile = useIsMobile();
  const [isOfflineData, setIsOfflineData] = useState(false);
  
  // Calculate stale time based on priority and device type
  const getOptimizedStaleTime = () => {
    if (!isMobile) return 1000 * 60 * 5; // 5 minutes for desktop
    
    switch (mobilePriority) {
      case 'high': return 1000 * 60 * 1; // 1 minute for high priority on mobile
      case 'medium': return 1000 * 60 * 10; // 10 minutes for medium priority on mobile
      case 'low': return 1000 * 60 * 30; // 30 minutes for low priority on mobile
      default: return 1000 * 60 * 5; // Default to 5 minutes
    }
  };
  
  // Enhanced query function that handles offline data
  const enhancedQueryFn = async () => {
    try {
      // If offline and offline capable, try to get cached data
      if (!isOnline() && offlineCapable) {
        const cachedData = retrieveData<TData>(cacheKey);
        if (cachedData) {
          setIsOfflineData(true);
          return cachedData;
        }
        throw new Error('No offline data available');
      }
      
      // Online or not offline capable, fetch fresh data
      const data = await queryFn();
      
      // Cache the data for offline use if feature is enabled
      if (offlineCapable) {
        storeData(cacheKey, data);
      }
      
      setIsOfflineData(false);
      return data;
    } catch (error) {
      // If online fetch fails, try to get cached data as fallback
      if (offlineCapable) {
        const cachedData = retrieveData<TData>(cacheKey);
        if (cachedData) {
          setIsOfflineData(true);
          toast.warning('Using cached data. Some information may be outdated.');
          return cachedData;
        }
      }
      throw error;
    }
  };
  
  // Use react-query with our optimized configuration
  const queryResult = useQuery<TData, TError, TData>({
    queryKey,
    queryFn: enhancedQueryFn,
    staleTime: getOptimizedStaleTime(),
    ...queryOptions,
  });
  
  // Add network status handler that refreshes data when coming back online
  useEffect(() => {
    if (offlineCapable) {
      const handleOnline = () => {
        if (isOfflineData) {
          queryResult.refetch();
          toast.success('Back online! Refreshing data...');
        }
      };
      
      window.addEventListener('online', handleOnline);
      return () => window.removeEventListener('online', handleOnline);
    }
  }, [offlineCapable, isOfflineData, queryResult]);
  
  return { ...queryResult, isOfflineData };
}
