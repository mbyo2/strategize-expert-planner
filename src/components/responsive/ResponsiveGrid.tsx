
import React from 'react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface ResponsiveGridProps {
  children: React.ReactNode;
  className?: string;
  cols?: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
  gap?: string;
}

const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  className,
  cols = { mobile: 1, tablet: 2, desktop: 3 },
  gap = 'gap-4'
}) => {
  const isMobile = useIsMobile();

  const gridCols = `grid-cols-${cols.mobile} sm:grid-cols-${cols.tablet} lg:grid-cols-${cols.desktop}`;

  return (
    <div className={cn('grid', gridCols, gap, className)}>
      {children}
    </div>
  );
};

export default ResponsiveGrid;
