
import React from 'react';
import { WidgetProps } from './WidgetTypes';
import StrategicGoals from '../StrategicGoals';
import WidgetWrapper from './WidgetWrapper';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const StrategicGoalsWidget: React.FC<WidgetProps> = (props) => {
  const navigate = useNavigate();
  
  const handleQuickExport = () => {
    toast.info("Preparing strategic goals export...");
    
    // Simulate export generation
    setTimeout(() => {
      toast.success("Strategic goals exported successfully!");
    }, 1500);
  };

  const handleViewAllGoals = () => {
    navigate('/goals');
  };

  return (
    <WidgetWrapper {...props}>
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-medium">Strategic Goals</h3>
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleViewAllGoals}
              className="h-8 px-2 text-xs"
            >
              View All
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleQuickExport}
              className="h-8 px-2"
            >
              <Download className="h-3.5 w-3.5" />
              <span className="sr-only">Export</span>
            </Button>
          </div>
        </div>
        <div className="flex-grow overflow-auto">
          <StrategicGoals />
        </div>
      </div>
    </WidgetWrapper>
  );
};

export default StrategicGoalsWidget;
