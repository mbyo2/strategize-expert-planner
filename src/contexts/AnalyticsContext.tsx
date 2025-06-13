
import React, { createContext, useContext, ReactNode } from 'react';

interface AnalyticsContextType {
  trackEvent: (event: string, properties?: Record<string, any>) => void;
  trackPageView: (page: string) => void;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export const AnalyticsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const trackEvent = (event: string, properties?: Record<string, any>) => {
    // In a real app, this would send events to your analytics service
    console.log('Analytics Event:', event, properties);
  };

  const trackPageView = (page: string) => {
    // In a real app, this would track page views
    console.log('Page View:', page);
  };

  const value = {
    trackEvent,
    trackPageView
  };

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
};

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within AnalyticsProvider');
  }
  return context;
};
