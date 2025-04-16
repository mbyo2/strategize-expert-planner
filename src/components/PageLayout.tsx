
import React, { useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import Navigation from './Navigation';
import MobileNavigation from './MobileNavigation';
import FadeIn from './FadeIn';
import CalendarIntegration from './CalendarIntegration';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Skeleton } from '@/components/ui/skeleton';
import { isOnline } from '@/services/offlineService';
import { useIsMountedRef } from '@/hooks/use-mounted-ref';
import { Button } from '@/components/ui/button';
import { Calendar, Download } from 'lucide-react';
import ReportGenerator from './ReportGenerator';
import ContextualHelp from './help/ContextualHelp';
import { useLanguage } from '@/i18n';

interface PageLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  icon?: React.ReactNode;
  loading?: boolean;
  showExportOptions?: boolean;
  helpText?: string;
}

const PageLayout: React.FC<PageLayoutProps> = ({ 
  children, 
  title, 
  subtitle, 
  className, 
  icon,
  loading = false,
  showExportOptions = false,
  helpText
}) => {
  const isMobile = useIsMobile();
  const isMounted = useIsMountedRef();
  const [isPageLoading, setIsPageLoading] = React.useState(loading);
  const isConnected = isOnline();
  const { t } = useLanguage();
  
  // Simulate data loading optimization for mobile
  useEffect(() => {
    if (loading) {
      // Add slight delay for mobile to improve perceived performance
      const timer = setTimeout(() => {
        if (isMounted.current) {
          setIsPageLoading(false);
        }
      }, isMobile ? 300 : 0);
      
      return () => clearTimeout(timer);
    }
  }, [loading, isMobile, isMounted]);
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Navigation />
      
      <main id="main-content" className={cn(
        "flex-1 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8",
        // Add extra padding at the bottom on mobile for the navigation
        isMobile && "pb-20",
        className
      )}>
        {(title || subtitle) && (
          <header className="mb-4 sm:mb-6 md:mb-8 pb-4 border-b">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <FadeIn delay={100}>
                <div>
                  {title && (
                    <h1 className={cn(
                      "font-semibold tracking-tight flex items-center",
                      isMobile ? "text-2xl" : "text-3xl"
                    )}>
                      {icon && <span className="mr-2">{icon}</span>}
                      {t(title) || title}
                      {helpText && (
                        <span className="ml-2">
                          <ContextualHelp content={helpText} />
                        </span>
                      )}
                    </h1>
                  )}
                  {subtitle && <p className="text-muted-foreground mt-1 text-sm sm:text-base">{t(subtitle) || subtitle}</p>}
                  
                  {!isConnected && (
                    <div className="mt-2 text-sm text-amber-600 dark:text-amber-400 flex items-center">
                      <span className="inline-block w-2 h-2 rounded-full bg-amber-500 mr-2"></span>
                      Offline mode - Some features may be limited
                    </div>
                  )}
                </div>
              </FadeIn>
              
              {showExportOptions && (
                <FadeIn delay={200}>
                  <div className="flex flex-wrap gap-2 justify-start sm:justify-end">
                    <CalendarIntegration />
                    <ReportGenerator triggerClassName="" />
                  </div>
                </FadeIn>
              )}
            </div>
          </header>
        )}
        
        <FadeIn delay={200} className="h-full">
          {isPageLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-[180px] w-full rounded-lg" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Skeleton className="h-[100px] rounded-lg" />
                <Skeleton className="h-[100px] rounded-lg" />
                <Skeleton className="h-[100px] rounded-lg" />
                <Skeleton className="h-[100px] rounded-lg" />
              </div>
            </div>
          ) : (
            children
          )}
        </FadeIn>
      </main>
      
      <MobileNavigation />
      <Footer />
    </div>
  );
};

export default PageLayout;
