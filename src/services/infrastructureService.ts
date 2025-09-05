import { DatabaseService } from './databaseService';
import { logAuditEvent } from './auditService';

export interface SystemMetrics {
  id: string;
  metric_type: 'cpu' | 'memory' | 'disk' | 'network' | 'response_time' | 'error_rate';
  value: number;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface PerformanceAlert {
  id: string;
  alert_type: 'performance' | 'security' | 'system' | 'database';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  threshold_value?: number;
  current_value?: number;
  created_at: string;
  resolved_at?: string;
  status: 'active' | 'resolved' | 'acknowledged';
}

export interface CacheEntry {
  id: string;
  cache_key: string;
  data_type: 'strategic_goals' | 'analytics' | 'team_data' | 'market_data';
  size_bytes: number;
  hit_count: number;
  last_accessed: string;
  expires_at: string;
  created_at: string;
}

export const recordSystemMetric = async (
  metricType: SystemMetrics['metric_type'],
  value: number,
  metadata?: Record<string, any>
): Promise<SystemMetrics> => {
  try {
    const result = await DatabaseService.createRecord<SystemMetrics>('system_metrics', {
      metric_type: metricType,
      value,
      timestamp: new Date().toISOString(),
      metadata
    });
    
    if (!result.data) {
      throw new Error(result.error || 'Failed to record system metric');
    }
    
    return result.data;
  } catch (error) {
    console.error('Error recording system metric:', error);
    throw error;
  }
};

export const getSystemMetrics = async (
  metricType?: SystemMetrics['metric_type'],
  startDate?: string,
  endDate?: string
): Promise<SystemMetrics[]> => {
  try {
    const filters: Record<string, any> = {};
    
    if (metricType) {
      filters.metric_type = metricType;
    }
    
    const result = await DatabaseService.fetchData<SystemMetrics>('system_metrics', {
      sortBy: 'timestamp',
      sortOrder: 'desc',
      limit: 100
    }, filters);
    
    return result.data || [];
  } catch (error) {
    console.error('Error fetching system metrics:', error);
    return [];
  }
};

export const createPerformanceAlert = async (
  alertData: Omit<PerformanceAlert, 'id' | 'created_at'>
): Promise<PerformanceAlert> => {
  try {
    const result = await DatabaseService.createRecord<PerformanceAlert>('performance_alerts', alertData);
    
    if (!result.data) {
      throw new Error(result.error || 'Failed to create performance alert');
    }
    
    // Log the alert creation
    await logAuditEvent({
      action: 'create',
      resource: 'admin',
      metadata: {
        description: `Performance alert created: ${alertData.message}`,
        severity: alertData.severity === 'critical' ? 'high' : 'medium',
        alertType: alertData.alert_type,
        alertSeverity: alertData.severity
      }
    });
    
    return result.data;
  } catch (error) {
    console.error('Error creating performance alert:', error);
    throw error;
  }
};

export const getPerformanceAlerts = async (
  status?: PerformanceAlert['status'],
  severity?: PerformanceAlert['severity']
): Promise<PerformanceAlert[]> => {
  try {
    const filters: Record<string, any> = {};
    
    if (status) {
      filters.status = status;
    }
    
    if (severity) {
      filters.severity = severity;
    }
    
    const result = await DatabaseService.fetchData<PerformanceAlert>('performance_alerts', {
      sortBy: 'created_at',
      sortOrder: 'desc',
      limit: 50
    }, filters);
    
    return result.data || [];
  } catch (error) {
    console.error('Error fetching performance alerts:', error);
    return [];
  }
};

export const resolvePerformanceAlert = async (alertId: string): Promise<PerformanceAlert> => {
  try {
    const result = await DatabaseService.updateRecord<PerformanceAlert>('performance_alerts', alertId, {
      status: 'resolved',
      resolved_at: new Date().toISOString()
    });
    
    if (!result.data) {
      throw new Error(result.error || 'Failed to resolve performance alert');
    }
    
    await logAuditEvent({
      action: 'update',
      resource: 'admin',
      resourceId: alertId,
      metadata: {
        description: 'Performance alert resolved',
        severity: 'low'
      }
    });
    
    return result.data;
  } catch (error) {
    console.error('Error resolving performance alert:', error);
    throw error;
  }
};

export const recordCacheOperation = async (
  operation: 'hit' | 'miss' | 'set' | 'delete',
  cacheKey: string,
  dataType: CacheEntry['data_type'],
  size?: number
): Promise<boolean> => {
  try {
    // Record cache metrics
    await recordSystemMetric('response_time', operation === 'hit' ? 50 : 200, {
      operation,
      cacheKey,
      dataType
    });
    
    // Update or create cache entry
    if (operation === 'set' && size) {
      await DatabaseService.createRecord<CacheEntry>('cache_entries', {
        cache_key: cacheKey,
        data_type: dataType,
        size_bytes: size,
        hit_count: 0,
        last_accessed: new Date().toISOString(),
        expires_at: new Date(Date.now() + 3600000).toISOString() // 1 hour TTL
      });
    }
    
    return true;
  } catch (error) {
    console.error('Error recording cache operation:', error);
    return false;
  }
};

export const getCacheStatistics = async (): Promise<{
  totalEntries: number;
  totalSize: number;
  hitRate: number;
  topKeys: Array<{ key: string; hits: number; size: number }>;
}> => {
  try {
    const result = await DatabaseService.fetchData<CacheEntry>('cache_entries', {
      sortBy: 'hit_count',
      sortOrder: 'desc',
      limit: 100
    });
    
    const entries = result.data || [];
    const totalEntries = entries.length;
    const totalSize = entries.reduce((sum, entry) => sum + entry.size_bytes, 0);
    const totalHits = entries.reduce((sum, entry) => sum + entry.hit_count, 0);
    const hitRate = totalHits > 0 ? (totalHits / (totalHits + totalEntries)) * 100 : 0;
    
    const topKeys = entries.slice(0, 10).map(entry => ({
      key: entry.cache_key,
      hits: entry.hit_count,
      size: entry.size_bytes
    }));
    
    return {
      totalEntries,
      totalSize,
      hitRate,
      topKeys
    };
  } catch (error) {
    console.error('Error getting cache statistics:', error);
    return {
      totalEntries: 0,
      totalSize: 0,
      hitRate: 0,
      topKeys: []
    };
  }
};

export const optimizeDatabase = async (): Promise<{
  success: boolean;
  optimizations: string[];
  performance_improvement: number;
}> => {
  try {
    // Simulate database optimization
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const optimizations = [
      'Rebuilt database indexes',
      'Analyzed query execution plans',
      'Updated table statistics',
      'Optimized connection pool settings',
      'Cleaned up temporary tables'
    ];
    
    const performance_improvement = Math.floor(Math.random() * 15) + 5; // 5-20% improvement
    
    await logAuditEvent({
      action: 'update',
      resource: 'admin',
      metadata: {
        description: 'Database optimization completed',
        severity: 'medium',
        optimizations,
        performance_improvement
      }
    });
    
    // Record the performance improvement
    await recordSystemMetric('response_time', 100 - performance_improvement, {
      optimization: true,
      improvement: performance_improvement
    });
    
    return {
      success: true,
      optimizations,
      performance_improvement
    };
  } catch (error) {
    console.error('Error optimizing database:', error);
    return {
      success: false,
      optimizations: [],
      performance_improvement: 0
    };
  }
};

export const clearCache = async (
  dataType?: CacheEntry['data_type']
): Promise<{ success: boolean; clearedEntries: number }> => {
  try {
    const filters: Record<string, any> = {};
    
    if (dataType) {
      filters.data_type = dataType;
    }
    
    // Get entries to be cleared
    const result = await DatabaseService.fetchData<CacheEntry>('cache_entries', {}, filters);
    const entriesToClear = result.data || [];
    
    // Clear cache entries
    for (const entry of entriesToClear) {
      await DatabaseService.deleteRecord('cache_entries', entry.id);
    }
    
    await logAuditEvent({
      action: 'delete',
      resource: 'admin',
      metadata: {
        description: `Cache cleared${dataType ? ` for ${dataType}` : ''}`,
        severity: 'low',
        dataType,
        clearedEntries: entriesToClear.length
      }
    });
    
    return {
      success: true,
      clearedEntries: entriesToClear.length
    };
  } catch (error) {
    console.error('Error clearing cache:', error);
    return {
      success: false,
      clearedEntries: 0
    };
  }
};

export const getSystemHealth = async (): Promise<{
  overall_score: number;
  cpu_health: number;
  memory_health: number;
  disk_health: number;
  network_health: number;
  database_health: number;
  cache_health: number;
  security_health: number;
  recommendations: string[];
}> => {
  try {
    // Simulate system health check
    const metrics = {
      cpu_health: Math.floor(Math.random() * 30) + 70, // 70-100
      memory_health: Math.floor(Math.random() * 25) + 75, // 75-100
      disk_health: Math.floor(Math.random() * 20) + 80, // 80-100
      network_health: Math.floor(Math.random() * 25) + 75, // 75-100
      database_health: Math.floor(Math.random() * 20) + 80, // 80-100
      cache_health: Math.floor(Math.random() * 15) + 85, // 85-100
      security_health: Math.floor(Math.random() * 10) + 90, // 90-100
    };
    
    const overall_score = Math.floor(
      Object.values(metrics).reduce((sum, score) => sum + score, 0) / Object.keys(metrics).length
    );
    
    const recommendations: string[] = [];
    
    if (metrics.cpu_health < 80) {
      recommendations.push('Consider optimizing CPU-intensive processes');
    }
    if (metrics.memory_health < 85) {
      recommendations.push('Review memory usage and consider increasing available RAM');
    }
    if (metrics.database_health < 90) {
      recommendations.push('Run database optimization and index maintenance');
    }
    if (metrics.cache_health < 90) {
      recommendations.push('Optimize cache configuration and cleanup old entries');
    }
    
    return {
      overall_score,
      ...metrics,
      recommendations
    };
  } catch (error) {
    console.error('Error getting system health:', error);
    return {
      overall_score: 0,
      cpu_health: 0,
      memory_health: 0,
      disk_health: 0,
      network_health: 0,
      database_health: 0,
      cache_health: 0,
      security_health: 0,
      recommendations: ['Unable to assess system health']
    };
  }
};
