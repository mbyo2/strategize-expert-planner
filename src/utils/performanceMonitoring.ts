
/**
 * Utility for monitoring application performance
 */

type PerformanceMeasure = {
  name: string;
  startTime: number;
  duration?: number;
};

// Store active measurements
const activeMeasurements = new Map<string, number>();

/**
 * Start measuring a specific operation
 */
export const startMeasure = (name: string): void => {
  if (process.env.NODE_ENV === 'production') return;
  
  try {
    const startTime = performance.now();
    activeMeasurements.set(name, startTime);
    console.debug(`⏱️ Started measuring: ${name}`);
  } catch (error) {
    console.error('Error starting performance measurement:', error);
  }
};

/**
 * End measuring a specific operation and log the result
 */
export const endMeasure = (name: string, logThreshold = 100): number | null => {
  if (process.env.NODE_ENV === 'production') return null;
  
  try {
    const startTime = activeMeasurements.get(name);
    if (!startTime) {
      console.warn(`⚠️ No measurement started for: ${name}`);
      return null;
    }
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    // Only log if duration exceeds threshold
    if (duration > logThreshold) {
      console.warn(`⏱️ Slow operation detected: ${name} took ${duration.toFixed(2)}ms`);
    } else {
      console.debug(`⏱️ Completed: ${name} in ${duration.toFixed(2)}ms`);
    }
    
    // Clean up
    activeMeasurements.delete(name);
    
    return duration;
  } catch (error) {
    console.error('Error ending performance measurement:', error);
    return null;
  }
};

/**
 * Measure the execution time of an async function
 */
export const measureAsync = async <T>(
  name: string,
  fn: () => Promise<T>,
  logThreshold = 100
): Promise<T> => {
  startMeasure(name);
  try {
    return await fn();
  } finally {
    endMeasure(name, logThreshold);
  }
};

/**
 * Register performance observers for various metrics
 */
export const registerPerformanceObservers = (): (() => void) => {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
    return () => {}; // No-op cleanup function
  }

  const observers: PerformanceObserver[] = [];

  try {
    // Layout shifts observer
    if (PerformanceObserver.supportedEntryTypes.includes('layout-shift')) {
      const layoutShiftObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries() as PerformanceEntry[]) {
          const layoutShift = entry as any; // Type casting due to Layout Shift API
          if (!layoutShift.hadRecentInput && layoutShift.value >= 0.1) {
            console.warn('🔄 Large layout shift detected:', {
              value: layoutShift.value.toFixed(4),
              timestamp: entry.startTime.toFixed(0),
              url: window.location.pathname
            });
          }
        }
      });
      layoutShiftObserver.observe({ type: 'layout-shift', buffered: true });
      observers.push(layoutShiftObserver);
    }

    // Long tasks observer
    if (PerformanceObserver.supportedEntryTypes.includes('longtask')) {
      const longTaskObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          console.warn('⏰ Long task detected:', {
            duration: entry.duration.toFixed(2) + 'ms',
            timestamp: entry.startTime.toFixed(0),
            url: window.location.pathname
          });
        }
      });
      longTaskObserver.observe({ type: 'longtask', buffered: true });
      observers.push(longTaskObserver);
    }

    // First Input Delay observer
    if (PerformanceObserver.supportedEntryTypes.includes('first-input')) {
      const fidObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          const fid = entry.processingStart! - entry.startTime;
          console.info('🖱️ First Input Delay:', {
            delay: fid.toFixed(2) + 'ms',
            type: (entry as any).name // Type casting since name might not be in the type definition
          });
        }
      });
      fidObserver.observe({ type: 'first-input', buffered: true });
      observers.push(fidObserver);
    }
    
    console.info('✅ Performance observers registered');
  } catch (error) {
    console.error('Error registering performance observers:', error);
  }

  // Return cleanup function
  return () => {
    observers.forEach(observer => {
      try {
        observer.disconnect();
      } catch (e) {
        console.error('Error disconnecting observer:', e);
      }
    });
  };
};

/**
 * Hook to measure React component render performance
 * @deprecated Use the React DevTools Profiler instead
 */
export const logSlowRenders = (
  componentName: string,
  startTime: number,
  threshold = 16 // 60fps frame budget
): void => {
  if (process.env.NODE_ENV === 'production') return;
  
  const endTime = performance.now();
  const renderTime = endTime - startTime;
  
  if (renderTime > threshold) {
    console.warn(`🐢 Slow render detected: ${componentName} took ${renderTime.toFixed(2)}ms`);
  }
};
