
// Utility functions for performance monitoring
export const startMeasure = (measureName: string) => {
  performance.mark(`${measureName}-start`);
};

export const endMeasure = (measureName: string) => {
  performance.mark(`${measureName}-end`);
  performance.measure(
    measureName,
    `${measureName}-start`,
    `${measureName}-end`
  );
  
  // Log the performance measure
  const measures = performance.getEntriesByName(measureName);
  const lastMeasure = measures[measures.length - 1];
  console.log(`Performance: ${measureName} took ${lastMeasure.duration}ms`);
  
  // Clear the marks and measures
  performance.clearMarks(`${measureName}-start`);
  performance.clearMarks(`${measureName}-end`);
  performance.clearMeasures(measureName);
};

// Fix type issue with layout shift entries
interface LayoutShiftAttribution {
  node: Node;
  previousRect: DOMRectReadOnly;
  currentRect: DOMRectReadOnly;
}

// Define the extended performance entry type for LayoutShift
interface LayoutShiftEntry extends PerformanceEntry {
  hadRecentInput: boolean;
  lastInputTime: number;
  value: number;
  sources: Array<LayoutShiftAttribution>;
}

// Define the extended performance entry type for LongTask
interface LongTaskEntry extends PerformanceEntry {
  processingStart?: number;
  processingEnd?: number;
  startTime: number;
  duration: number;
}

export const observeLongTasks = () => {
  if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        // Properly type-cast the entry
        const longTaskEntry = entry as LongTaskEntry;
        if (longTaskEntry.processingStart) {
          console.log('Long Task Detected', entry.name, entry.duration, longTaskEntry.processingStart);
        } else {
          console.log('Long Task Detected', entry.name, entry.duration);
        }
      });
    });

    observer.observe({ type: 'longtask', buffered: true });
  }
};

// Create a function to observe layout shifts
export const observeLayoutShifts = () => {
  if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        // Properly type-cast the entry
        const layoutShiftEntry = entry as LayoutShiftEntry;
        
        // Only log unexpected layout shifts
        if (!layoutShiftEntry.hadRecentInput) {
          console.warn('Layout shift detected:', layoutShiftEntry.value.toFixed(4), entry);
        }
      });
    });

    observer.observe({ type: 'layout-shift', buffered: true });
  }
};
