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

// Fix type issue with processingStart property
interface ExtendedPerformanceEntry extends PerformanceEntry {
  processingStart?: number;
}

export const observeLongTasks = () => {
  if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        // Enhanced type checking for processingStart
        const extendedEntry = entry as ExtendedPerformanceEntry;
        if (extendedEntry.processingStart) {
          console.log('Long Task Detected', entry.name, entry.duration, extendedEntry.processingStart);
        } else {
          console.log('Long Task Detected', entry.name, entry.duration);
        }
      });
    });

    observer.observe({ type: 'longtask', buffered: true });
  }
};
