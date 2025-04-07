
import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Navigation from './Navigation';
import FadeIn from './FadeIn';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface PageLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  icon?: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children, title, subtitle, className, icon }) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Navigation />
      
      <main className={cn("flex-1 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8", className)}>
        {(title || subtitle) && (
          <header className="mb-4 sm:mb-6 md:mb-8 pb-4 border-b">
            <FadeIn delay={100}>
              {title && (
                <h1 className={cn(
                  "font-semibold tracking-tight flex items-center",
                  isMobile ? "text-2xl" : "text-3xl"
                )}>
                  {icon && <span className="mr-2">{icon}</span>}
                  {title}
                </h1>
              )}
              {subtitle && <p className="text-muted-foreground mt-1 text-sm sm:text-base">{subtitle}</p>}
            </FadeIn>
          </header>
        )}
        
        <FadeIn delay={200} className="h-full">
          {children}
        </FadeIn>
      </main>
      
      <Footer />
    </div>
  );
};

export default PageLayout;
