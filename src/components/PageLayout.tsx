
import React from 'react';
import Navigation from './Navigation';
import FadeIn from './FadeIn';
import { cn } from '@/lib/utils';

interface PageLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children, title, subtitle, className }) => {
  return (
    <div className="flex min-h-screen">
      <Navigation />
      
      <main className={cn("flex-1 px-4 lg:px-8 py-8", className)}>
        {(title || subtitle) && (
          <header className="mb-8 pb-4 border-b">
            <FadeIn delay={100}>
              {title && <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>}
              {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
            </FadeIn>
          </header>
        )}
        
        <FadeIn delay={200} className="h-full">
          {children}
        </FadeIn>
      </main>
    </div>
  );
};

export default PageLayout;
