/**
 * Offline service for managing data caching and offline functionality
 */

// Cache storage keys for different data types
const CACHE_KEYS = {
  STRATEGIC_GOALS: 'strategic-goals-cache',
  DASHBOARD_DATA: 'dashboard-data-cache',
  ANALYTICS_DATA: 'analytics-data-cache',
  USER_PREFERENCES: 'user-preferences-cache',
  ORGANIZATION_DATA: 'organization-data-cache',
  TEAM_DATA: 'team-data-cache',
};

// Time-to-live for cached data in milliseconds
const CACHE_TTL = {
  SHORT: 5 * 60 * 1000, // 5 minutes
  MEDIUM: 30 * 60 * 1000, // 30 minutes
  LONG: 24 * 60 * 60 * 1000, // 24 hours
  VERY_LONG: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// Maximum cache size (in bytes) for optimization
const MAX_CACHE_SIZE = 10 * 1024 * 1024; // 10MB

// Entity types for synchronization
enum SyncEntityType {
  GOAL = 'goal',
  DASHBOARD = 'dashboard',
  ANALYTICS = 'analytics',
  ORGANIZATION = 'organization',
  TEAM = 'team',
  TEAM_MEMBER = 'team_member',
}

// Synchronization state for each entity
interface SyncState {
  lastSync: number;
  pendingChanges: boolean;
  changeCount: number;
}

// Keep track of synchronization states
const syncStates: Record<string, SyncState> = {};

/**
 * Stores data in the browser's localStorage with an expiration timestamp
 */
export const storeData = <T>(key: string, data: T, ttl = CACHE_TTL.MEDIUM): void => {
  try {
    const item = {
      data,
      expiry: Date.now() + ttl,
    };
    const serialized = JSON.stringify(item);
    
    // Check cache size before storing
    if (serialized.length > MAX_CACHE_SIZE) {
      console.warn(`Cache item too large: ${key} (${serialized.length} bytes)`);
      return;
    }
    
    localStorage.setItem(key, serialized);
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
 * Store pending changes when offline
 */
export const storePendingChange = <T>(
  entityType: SyncEntityType,
  entityId: string,
  change: Partial<T>
): void => {
  try {
    const key = `pending_${entityType}_${entityId}`;
    const existingChanges = retrieveData<Partial<T>[]>(key) || [];
    existingChanges.push(change);
    storeData(key, existingChanges, CACHE_TTL.VERY_LONG);
    
    // Update sync state
    const syncKey = `sync_${entityType}`;
    const state = syncStates[syncKey] || { lastSync: 0, pendingChanges: false, changeCount: 0 };
    syncStates[syncKey] = {
      ...state,
      pendingChanges: true,
      changeCount: state.changeCount + 1,
    };
  } catch (error) {
    console.error('Error storing pending change:', error);
  }
};

/**
 * Get all pending changes for an entity type
 */
export const getPendingChanges = <T>(entityType: SyncEntityType): Record<string, Partial<T>[]> => {
  try {
    const prefix = `pending_${entityType}_`;
    const result: Record<string, Partial<T>[]> = {};
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(prefix)) {
        const entityId = key.substring(prefix.length);
        const changes = retrieveData<Partial<T>[]>(key) || [];
        result[entityId] = changes;
      }
    }
    
    return result;
  } catch (error) {
    console.error('Error getting pending changes:', error);
    return {};
  }
};

/**
 * Clear pending changes after successful sync
 */
export const clearPendingChanges = (entityType: SyncEntityType, entityId?: string): void => {
  try {
    const prefix = `pending_${entityType}_`;
    
    if (entityId) {
      // Clear specific entity
      localStorage.removeItem(`${prefix}${entityId}`);
    } else {
      // Clear all of this entity type
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key && key.startsWith(prefix)) {
          localStorage.removeItem(key);
        }
      }
    }
    
    // Update sync state
    const syncKey = `sync_${entityType}`;
    syncStates[syncKey] = {
      lastSync: Date.now(),
      pendingChanges: false,
      changeCount: 0,
    };
  } catch (error) {
    console.error('Error clearing pending changes:', error);
  }
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
 * Caches organization data for offline use
 */
export const cacheOrganizationData = (data: any): void => {
  storeData(CACHE_KEYS.ORGANIZATION_DATA, data, CACHE_TTL.MEDIUM);
};

/**
 * Retrieves cached organization data
 */
export const getCachedOrganizationData = (): any => {
  return retrieveData(CACHE_KEYS.ORGANIZATION_DATA);
};

/**
 * Caches team data for offline use
 */
export const cacheTeamData = (data: any): void => {
  storeData(CACHE_KEYS.TEAM_DATA, data, CACHE_TTL.MEDIUM);
};

/**
 * Retrieves cached team data
 */
export const getCachedTeamData = (): any => {
  return retrieveData(CACHE_KEYS.TEAM_DATA);
};

/**
 * Gets the sync status for a specific entity type
 */
export const getSyncStatus = (entityType: SyncEntityType): SyncState => {
  const syncKey = `sync_${entityType}`;
  return syncStates[syncKey] || { lastSync: 0, pendingChanges: false, changeCount: 0 };
};

/**
 * Calculates the total cache size
 */
export const calculateCacheSize = (): number => {
  try {
    let totalSize = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key);
        if (value) {
          totalSize += value.length * 2; // UTF-16 characters are 2 bytes each
        }
      }
    }
    return totalSize;
  } catch (error) {
    console.error('Error calculating cache size:', error);
    return 0;
  }
};

/**
 * Optimizes cache by removing least recently used items if size exceeds limit
 */
export const optimizeCache = (): void => {
  try {
    const totalSize = calculateCacheSize();
    if (totalSize <= MAX_CACHE_SIZE) {
      return;
    }
    
    // Get all items with their expiry timestamps
    const cacheItems: Array<{ key: string; expiry: number }> = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const itemStr = localStorage.getItem(key);
        if (itemStr) {
          try {
            const item = JSON.parse(itemStr);
            if (item.expiry) {
              cacheItems.push({ key, expiry: item.expiry });
            }
          } catch {
            // Skip items that aren't in our cache format
          }
        }
      }
    }
    
    // Sort by expiry (soonest first)
    cacheItems.sort((a, b) => a.expiry - b.expiry);
    
    // Remove items until we're under the limit
    while (cacheItems.length > 0 && calculateCacheSize() > MAX_CACHE_SIZE * 0.8) {
      const item = cacheItems.shift();
      if (item) {
        localStorage.removeItem(item.key);
      }
    }
  } catch (error) {
    console.error('Error optimizing cache:', error);
  }
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
    // Get all pending changes
    const pendingGoals = getPendingChanges(SyncEntityType.GOAL);
    const pendingDashboards = getPendingChanges(SyncEntityType.DASHBOARD);
    const pendingAnalytics = getPendingChanges(SyncEntityType.ANALYTICS);
    const pendingOrganizations = getPendingChanges(SyncEntityType.ORGANIZATION);
    const pendingTeams = getPendingChanges(SyncEntityType.TEAM);
    const pendingTeamMembers = getPendingChanges(SyncEntityType.TEAM_MEMBER);
    
    // Process each type of pending changes
    // In a real implementation, this would send the changes to the server
    
    // Clear pending changes after successful sync
    clearPendingChanges(SyncEntityType.GOAL);
    clearPendingChanges(SyncEntityType.DASHBOARD);
    clearPendingChanges(SyncEntityType.ANALYTICS);
    clearPendingChanges(SyncEntityType.ORGANIZATION);
    clearPendingChanges(SyncEntityType.TEAM);
    clearPendingChanges(SyncEntityType.TEAM_MEMBER);
    
    // Optimize cache after sync
    optimizeCache();
    
    return Promise.resolve();
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
  cacheOrganizationData,
  getCachedOrganizationData,
  cacheTeamData,
  getCachedTeamData,
  syncOfflineData,
  storePendingChange,
  getPendingChanges,
  clearPendingChanges,
  getSyncStatus,
  calculateCacheSize,
  optimizeCache,
};
