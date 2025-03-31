
import React from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy } from '@dnd-kit/sortable';
import { restrictToParentElement } from '@dnd-kit/modifiers';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { useDashboardWidgets } from '@/hooks/useDashboardWidgets';
import DashboardWidgetRenderer from './widgets/DashboardWidgetRenderer';
import WidgetSelector from './widgets/WidgetSelector';
import { Widget, WidgetType } from './widgets/WidgetTypes';

const CustomizableDashboard: React.FC = () => {
  const { 
    widgets, 
    loading, 
    addWidget, 
    removeWidget, 
    resizeWidget, 
    reorderWidgets,
    resetWidgets 
  } = useDashboardWidgets();

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      reorderWidgets(active.id.toString(), over.id.toString());
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap justify-between items-center gap-2">
        <h2 className="text-xl font-semibold">Your Dashboard</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={resetWidgets}>
            <RotateCcw className="mr-2 h-4 w-4" /> Reset Layout
          </Button>
          <WidgetSelector onAddWidget={addWidget} />
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToParentElement]}
      >
        <SortableContext
          items={widgets.map(w => w.id)}
          strategy={rectSortingStrategy}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {widgets.map(widget => (
              <DashboardWidgetRenderer 
                key={widget.id}
                widget={widget} 
                onRemove={removeWidget}
                onResize={resizeWidget}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {widgets.length === 0 && (
        <div className="text-center py-16 border rounded-lg bg-muted/10">
          <h3 className="text-lg font-medium mb-2">Your dashboard is empty</h3>
          <p className="text-muted-foreground mb-4">Add widgets to customize your strategic overview</p>
          <WidgetSelector onAddWidget={addWidget} />
        </div>
      )}
    </div>
  );
};

export default CustomizableDashboard;
