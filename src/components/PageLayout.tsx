
import React from 'react';
import Header from './Header';

interface PageLayoutProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ title, subtitle, icon, children }) => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            {icon}
            <h1 className="text-3xl font-bold">{title}</h1>
          </div>
          {subtitle && (
            <p className="text-muted-foreground text-lg">{subtitle}</p>
          )}
        </div>
        {children}
      </main>
    </div>
  );
};

export default PageLayout;
