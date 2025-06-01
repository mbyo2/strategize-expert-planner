
import { supabase } from '@/integrations/supabase/client';
import { DatabaseService } from './databaseService';

export interface AnalyticsEvent {
  id?: string;
  user_id: string;
  event_type: string;
  event_data?: Record<string, any>;
  session_id?: string;
  page_url?: string;
  user_agent?: string;
  created_at?: string;
}

export class AnalyticsTrackingService {
  private static sessionId: string = Math.random().toString(36).substring(7);
  private static eventQueue: AnalyticsEvent[] = [];
  private static isProcessing = false;

  /**
   * Track a user action or event
   */
  static async trackEvent(
    eventType: string,
    eventData?: Record<string, any>,
    userId?: string
  ): Promise<void> {
    try {
      // Get current user if not provided
      if (!userId) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          console.warn('No user found for analytics tracking');
          return;
        }
        userId = user.id;
      }

      const event: AnalyticsEvent = {
        user_id: userId,
        event_type: eventType,
        event_data: eventData,
        session_id: this.sessionId,
        page_url: window.location.href,
        user_agent: navigator.userAgent
      };

      // Add to queue for batch processing
      this.eventQueue.push(event);

      // Process queue if not already processing
      if (!this.isProcessing) {
        this.processEventQueue();
      }
    } catch (error) {
      console.error('Error tracking analytics event:', error);
    }
  }

  /**
   * Process queued events in batches
   */
  private static async processEventQueue(): Promise<void> {
    if (this.eventQueue.length === 0 || this.isProcessing) return;

    this.isProcessing = true;
    const eventsToProcess = this.eventQueue.splice(0, 10);

    try {
      // Take up to 10 events from the queue
      if (eventsToProcess.length > 0) {
        // Convert AnalyticsEvent to match database record format
        const eventsForDb = eventsToProcess.map(event => ({
          id: crypto.randomUUID(),
          ...event,
          created_at: new Date().toISOString()
        }));
        
        await DatabaseService.batchCreate('analytics_events', eventsForDb);
      }
    } catch (error) {
      console.error('Error processing analytics event queue:', error);
      // Put events back in queue if processing failed
      this.eventQueue.unshift(...eventsToProcess);
    } finally {
      this.isProcessing = false;
      
      // Process remaining events if any
      if (this.eventQueue.length > 0) {
        setTimeout(() => this.processEventQueue(), 1000);
      }
    }
  }

  /**
   * Track page views
   */
  static async trackPageView(pageName: string, additionalData?: Record<string, any>): Promise<void> {
    await this.trackEvent('page_view', {
      page_name: pageName,
      ...additionalData
    });
  }

  /**
   * Track user interactions
   */
  static async trackInteraction(
    elementType: string,
    elementId: string,
    action: string,
    additionalData?: Record<string, any>
  ): Promise<void> {
    await this.trackEvent('user_interaction', {
      element_type: elementType,
      element_id: elementId,
      action,
      ...additionalData
    });
  }

  /**
   * Track feature usage
   */
  static async trackFeatureUsage(
    featureName: string,
    action: string,
    additionalData?: Record<string, any>
  ): Promise<void> {
    await this.trackEvent('feature_usage', {
      feature_name: featureName,
      action,
      ...additionalData
    });
  }

  /**
   * Track performance metrics
   */
  static async trackPerformance(
    metricName: string,
    value: number,
    unit: string,
    additionalData?: Record<string, any>
  ): Promise<void> {
    await this.trackEvent('performance_metric', {
      metric_name: metricName,
      value,
      unit,
      ...additionalData
    });
  }

  /**
   * Get analytics data for current user
   */
  static async getUserAnalytics(
    userId: string,
    startDate?: string,
    endDate?: string
  ): Promise<AnalyticsEvent[]> {
    try {
      const filters: any = { user_id: userId };
      
      if (startDate) {
        // Apply date filter in the query
      }

      const { data } = await DatabaseService.fetchData<AnalyticsEvent & { id: string }>(
        'analytics_events',
        { limit: 100, sortBy: 'created_at', sortOrder: 'desc' },
        filters
      );

      return data;
    } catch (error) {
      console.error('Error fetching user analytics:', error);
      return [];
    }
  }

  /**
   * Get aggregated analytics data
   */
  static async getAnalyticsSummary(
    startDate?: string,
    endDate?: string
  ): Promise<{
    totalEvents: number;
    uniqueUsers: number;
    topEvents: Array<{ event_type: string; count: number }>;
    topPages: Array<{ page_url: string; count: number }>;
  }> {
    try {
      // This would be better implemented as a database function
      // For now, we'll return mock data
      return {
        totalEvents: 0,
        uniqueUsers: 0,
        topEvents: [],
        topPages: []
      };
    } catch (error) {
      console.error('Error fetching analytics summary:', error);
      return {
        totalEvents: 0,
        uniqueUsers: 0,
        topEvents: [],
        topPages: []
      };
    }
  }

  /**
   * Initialize analytics tracking for the session
   */
  static initialize(): void {
    // Track session start
    this.trackEvent('session_start');

    // Track page unload
    window.addEventListener('beforeunload', () => {
      this.trackEvent('session_end');
    });

    // Track errors
    window.addEventListener('error', (event) => {
      this.trackEvent('javascript_error', {
        error_message: event.message,
        filename: event.filename,
        line_number: event.lineno,
        column_number: event.colno
      });
    });
  }
}
