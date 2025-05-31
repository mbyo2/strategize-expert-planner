
import { useState, useEffect } from 'react';
import { AnalyticsTrackingService, AnalyticsEvent } from '@/services/analyticsTrackingService';

export const useAnalytics = (userId?: string) => {
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    totalEvents: 0,
    uniqueUsers: 0,
    topEvents: [] as Array<{ event_type: string; count: number }>,
    topPages: [] as Array<{ page_url: string; count: number }>
  });

  // Initialize analytics on mount
  useEffect(() => {
    AnalyticsTrackingService.initialize();
  }, []);

  // Load user analytics
  useEffect(() => {
    const loadAnalytics = async () => {
      if (userId) {
        setLoading(true);
        try {
          const userEvents = await AnalyticsTrackingService.getUserAnalytics(userId);
          setEvents(userEvents);
          
          const summaryData = await AnalyticsTrackingService.getAnalyticsSummary();
          setSummary(summaryData);
        } catch (error) {
          console.error('Error loading analytics:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadAnalytics();
  }, [userId]);

  // Track functions
  const trackPageView = (pageName: string, additionalData?: Record<string, any>) => {
    return AnalyticsTrackingService.trackPageView(pageName, additionalData);
  };

  const trackInteraction = (elementType: string, elementId: string, action: string, additionalData?: Record<string, any>) => {
    return AnalyticsTrackingService.trackInteraction(elementType, elementId, action, additionalData);
  };

  const trackFeatureUsage = (featureName: string, action: string, additionalData?: Record<string, any>) => {
    return AnalyticsTrackingService.trackFeatureUsage(featureName, action, additionalData);
  };

  const trackPerformance = (metricName: string, value: number, unit: string, additionalData?: Record<string, any>) => {
    return AnalyticsTrackingService.trackPerformance(metricName, value, unit, additionalData);
  };

  return {
    events,
    summary,
    loading,
    trackPageView,
    trackInteraction,
    trackFeatureUsage,
    trackPerformance
  };
};
