
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { WIDGET_TEMPLATES, WidgetType } from './WidgetTypes';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

interface WidgetSelectorProps {
  onAddWidget: (widgetType: WidgetType) => void;
}

const WidgetSelector: React.FC<WidgetSelectorProps> = ({ onAddWidget }) => {
  const { toast } = useToast();
  const [open, setOpen] = React.useState(false);

  const handleAddWidget = (type: WidgetType) => {
    onAddWidget(type);
    setOpen(false);
    toast({
      title: "Widget added",
      description: `${WIDGET_TEMPLATES[type].title} widget has been added to your dashboard.`
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Widget
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add widget to dashboard</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          {Object.entries(WIDGET_TEMPLATES).map(([key, widget]) => (
            <Button
              key={key}
              variant="outline"
              className="h-24 flex flex-col items-center justify-center gap-2"
              onClick={() => handleAddWidget(key as WidgetType)}
            >
              <span className="font-medium">{widget.title}</span>
              <span className="text-xs text-muted-foreground">
                {widget.size.charAt(0).toUpperCase() + widget.size.slice(1)}
              </span>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WidgetSelector;
