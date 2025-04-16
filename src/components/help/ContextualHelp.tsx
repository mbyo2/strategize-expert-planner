
import React, { useState } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ContextualHelpProps {
  content: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  className?: string;
  iconClassName?: string;
  ariaLabel?: string;
  showDot?: boolean;
}

const ContextualHelp: React.FC<ContextualHelpProps> = ({
  content,
  side = 'top',
  className,
  iconClassName,
  ariaLabel = 'Help information',
  showDot = false,
}) => {
  const [hasBeenSeen, setHasBeenSeen] = useState(false);
  
  const handleOpen = () => {
    setHasBeenSeen(true);
  };
  
  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger 
          className={cn("inline-flex items-center justify-center hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary", className)}
          onClick={handleOpen}
          aria-label={ariaLabel}
        >
          <span className="relative">
            <HelpCircle className={cn("h-4 w-4 text-muted-foreground hover:text-primary transition-colors", iconClassName)} />
            
            {showDot && !hasBeenSeen && (
              <span className="absolute -top-1 -right-1 h-2 w-2 bg-primary rounded-full" />
            )}
          </span>
        </TooltipTrigger>
        <TooltipContent 
          side={side} 
          className="max-w-xs p-3"
          sideOffset={5}
        >
          {typeof content === 'string' ? (
            <p className="text-sm">{content}</p>
          ) : (
            content
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ContextualHelp;
