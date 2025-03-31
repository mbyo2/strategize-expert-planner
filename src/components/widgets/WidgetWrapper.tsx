
import React from 'react';
import { cn } from '@/lib/utils';
import { WidgetProps } from './WidgetTypes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GripVertical, X, Maximize, Minimize } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const WidgetWrapper: React.FC<WidgetProps> = ({ 
  widget, 
  onRemove,
  onResize 
}) => {
  const { 
    attributes, 
    listeners, 
    setNodeRef, 
    transform, 
    transition 
  } = useSortable({ id: widget.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  const toggleSize = () => {
    const newSize = widget.size === 'small' ? 'medium' : 
                   widget.size === 'medium' ? 'large' : 'small';
    onResize(widget.id, newSize);
  };

  const getWidgetSizeClass = () => {
    switch (widget.size) {
      case 'small': return 'col-span-1';
      case 'medium': return 'col-span-1 sm:col-span-2';
      case 'large': return 'col-span-1 sm:col-span-2 md:col-span-3';
      default: return 'col-span-1';
    }
  };

  return (
    <div 
      ref={setNodeRef}
      style={style}
      className={cn(getWidgetSizeClass())}
    >
      <Card className="h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 cursor-move" {...attributes} {...listeners}>
          <div className="flex items-center gap-2">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-sm font-medium">{widget.title}</CardTitle>
          </div>
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6"
              onClick={toggleSize}
            >
              {widget.size === 'large' ? 
                <Minimize className="h-3 w-3" /> : 
                <Maximize className="h-3 w-3" />
              }
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6"
              onClick={() => onRemove(widget.id)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Widget content will be rendered by the DashboardWidgetRenderer */}
        </CardContent>
      </Card>
    </div>
  );
};

export default WidgetWrapper;
