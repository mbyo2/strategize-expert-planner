
/**
 * Offline service for managing data caching and offline functionality
 */

// Cache storage keys for different data types
const CACHE_KEYS = {
  STRATEGIC_GOALS: 'strategic-goals-cache',
  DASHBOARD_DATA: 'dashboard-data-cache',
  ANALYTICS_DATA: 'analytics-data-cache',
  USER_PREFERENCES: 'user-preferences-cache',
};

// Time-to-live for cached data in milliseconds
const CACHE_TTL = {
  SHORT: 5 * 60 * 1000, // 5 minutes
  MEDIUM: 30 * 60 * 1000, // 30 minutes
  LONG: 24 * 60 * 60 * 1000, // 24 hours
};

/**
 * Stores data in the browser's localStorage with an expiration timestamp
 */
export const storeData = <T>(key: string, data: T, ttl = CACHE_TTL.MEDIUM): void => {
  try {
    const item = {
      data,
      expiry: Date.now() + ttl,
    };
    localStorage.setItem(key, JSON.stringify(item));
  } catch (error) {
    console.error('Error storing offline data:', error);
  }
};

/**
 * Retrieves data from localStorage if it exists and hasn't expired
 */
export const retrieveData = <T>(key: string): T | null => {
  try {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) return null;
    
    const item = JSON.parse(itemStr);
    if (Date.now() > item.expiry) {
      localStorage.removeItem(key);
      return null;
    }
    
    return item.data as T;
  } catch (error) {
    console.error('Error retrieving offline data:', error);
    return null;
  }
};

/**
 * Check if the browser is currently online
 */
export const isOnline = (): boolean => {
  return navigator.onLine;
};

/**
 * Add a listener for online/offline status changes
 */
export const addConnectivityListener = (
  onOnline: () => void,
  onOffline: () => void
): () => void => {
  window.addEventListener('online', onOnline);
  window.addEventListener('offline', onOffline);
  
  // Return a cleanup function
  return () => {
    window.removeEventListener('online', onOnline);
    window.removeEventListener('offline', onOffline);
  };
};

/**
 * Caches the dashboard data for offline use
 */
export const cacheDashboardData = (data: any): void => {
  storeData(CACHE_KEYS.DASHBOARD_DATA, data, CACHE_TTL.MEDIUM);
};

/**
 * Retrieves cached dashboard data
 */
export const getCachedDashboardData = (): any => {
  return retrieveData(CACHE_KEYS.DASHBOARD_DATA);
};

/**
 * Caches strategic goals data for offline use
 */
export const cacheStrategicGoals = (data: any): void => {
  storeData(CACHE_KEYS.STRATEGIC_GOALS, data, CACHE_TTL.MEDIUM);
};

/**
 * Retrieves cached strategic goals data
 */
export const getCachedStrategicGoals = (): any => {
  return retrieveData(CACHE_KEYS.STRATEGIC_GOALS);
};

/**
 * Caches analytics data for offline use
 */
export const cacheAnalyticsData = (data: any): void => {
  storeData(CACHE_KEYS.ANALYTICS_DATA, data, CACHE_TTL.MEDIUM);
};

/**
 * Retrieves cached analytics data
 */
export const getCachedAnalyticsData = (): any => {
  return retrieveData(CACHE_KEYS.ANALYTICS_DATA);
};

/**
 * Synchronizes all available offline data with the server
 * Returns a promise that resolves when synchronization is complete
 */
export const syncOfflineData = async (): Promise<void> => {
  if (!isOnline()) {
    throw new Error('Cannot sync while offline');
  }
  
  try {
    // In a real implementation, this would send any locally modified data
    // to the server and fetch the latest data for offline use
    
    // For now, we'll simulate a successful sync
    return new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });
  } catch (error) {
    console.error('Error syncing offline data:', error);
    throw error;
  }
};

export default {
  CACHE_KEYS,
  storeData,
  retrieveData,
  isOnline,
  addConnectivityListener,
  cacheDashboardData,
  getCachedDashboardData,
  cacheStrategicGoals,
  getCachedStrategicGoals,
  cacheAnalyticsData,
  getCachedAnalyticsData,
  syncOfflineData,
};
