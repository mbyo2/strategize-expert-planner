
import React from 'react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  mobileClassName?: string;
  desktopClassName?: string;
}

const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  className,
  mobileClassName,
  desktopClassName
}) => {
  const isMobile = useIsMobile();

  const responsiveClass = isMobile ? mobileClassName : desktopClassName;

  return (
    <div className={cn(className, responsiveClass)}>
      {children}
    </div>
  );
};

export default ResponsiveContainer;
