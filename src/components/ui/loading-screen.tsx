import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingScreenProps {
  message?: string;
  className?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message = "Loading...",
  className 
}) => {
  return (
    <div className={cn(
      "min-h-screen flex flex-col items-center justify-center bg-background",
      className
    )}>
      <div className="flex flex-col items-center gap-6 animate-fade-in">
        {/* Logo/Brand */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <div className="w-6 h-6 rounded-md bg-primary animate-pulse" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-primary/20 animate-ping" />
          </div>
          <span className="text-2xl font-bold text-foreground">Strategic Dashboard</span>
        </div>

        {/* Loading indicator */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-16 h-16">
            {/* Outer ring */}
            <div className="absolute inset-0 rounded-full border-4 border-muted" />
            {/* Spinning arc */}
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin" />
            {/* Inner pulse */}
            <div className="absolute inset-3 rounded-full bg-primary/10 animate-pulse" />
          </div>
          
          <p className="text-muted-foreground text-sm font-medium">{message}</p>
        </div>

        {/* Decorative dots */}
        <div className="flex gap-1.5 mt-2">
          <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 rounded-full bg-primary/80 animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
