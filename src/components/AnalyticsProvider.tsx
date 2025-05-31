
import React, { useEffect } from 'react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useSimpleAuth } from '@/hooks/useSimpleAuth';
import { useLocation } from 'react-router-dom';

interface AnalyticsProviderProps {
  children: React.ReactNode;
}

const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({ children }) => {
  const { session } = useSimpleAuth();
  const { trackPageView } = useAnalytics(session.user?.id);
  const location = useLocation();

  // Track page views
  useEffect(() => {
    if (session.user) {
      const pageName = location.pathname.replace('/', '') || 'home';
      trackPageView(pageName, {
        full_path: location.pathname + location.search,
        timestamp: new Date().toISOString()
      });
    }
  }, [location.pathname, location.search, session.user, trackPageView]);

  return <>{children}</>;
};

export default AnalyticsProvider;
