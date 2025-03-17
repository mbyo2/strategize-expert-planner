
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusIcon, ExpandIcon, MinusIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StrategySectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  collapsible?: boolean;
}

const StrategySection: React.FC<StrategySectionProps> = ({
  title,
  description,
  children,
  className,
  collapsible = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  
  return (
    <Card className={cn("shadow-subtle", className)}>
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle className="text-xl">{title}</CardTitle>
          {description && <CardDescription className="mt-1">{description}</CardDescription>}
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="icon">
            <PlusIcon className="h-4 w-4" />
            <span className="sr-only">Add</span>
          </Button>
          {collapsible && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <MinusIcon className="h-4 w-4" />
              ) : (
                <ExpandIcon className="h-4 w-4" />
              )}
              <span className="sr-only">
                {isExpanded ? "Collapse" : "Expand"}
              </span>
            </Button>
          )}
        </div>
      </CardHeader>
      {(!collapsible || isExpanded) && (
        <CardContent className="pt-2">
          <div className="animate-fade-in">{children}</div>
        </CardContent>
      )}
    </Card>
  );
};

export default StrategySection;
