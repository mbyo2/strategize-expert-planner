
import { useState, useEffect } from 'react';
import { Widget, WidgetType, WIDGET_TEMPLATES } from '@/components/widgets/WidgetTypes';
import { v4 as uuidv4 } from 'uuid';

// Default widgets for new users
const DEFAULT_WIDGETS: Widget[] = [
  { 
    id: uuidv4(), 
    type: 'industry-metrics', 
    title: 'Industry Metrics', 
    size: 'large', 
    position: 0 
  },
  { 
    id: uuidv4(), 
    type: 'strategic-goals', 
    title: 'Strategic Goals', 
    size: 'medium', 
    position: 1 
  },
  { 
    id: uuidv4(), 
    type: 'market-changes', 
    title: 'Market Changes', 
    size: 'medium', 
    position: 2 
  },
];

export const useDashboardWidgets = () => {
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [loading, setLoading] = useState(true);

  // Load widgets from localStorage on mount
  useEffect(() => {
    const storedWidgets = localStorage.getItem('dashboard_widgets');
    if (storedWidgets) {
      setWidgets(JSON.parse(storedWidgets));
    } else {
      setWidgets(DEFAULT_WIDGETS);
    }
    setLoading(false);
  }, []);

  // Save widgets to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('dashboard_widgets', JSON.stringify(widgets));
    }
  }, [widgets, loading]);

  // Add a widget
  const addWidget = (type: WidgetType) => {
    const template = WIDGET_TEMPLATES[type];
    const newWidget: Widget = {
      id: uuidv4(),
      ...template,
      position: widgets.length,
    };
    
    setWidgets([...widgets, newWidget]);
  };

  // Remove a widget
  const removeWidget = (id: string) => {
    const updatedWidgets = widgets
      .filter(widget => widget.id !== id)
      .map((widget, index) => ({
        ...widget,
        position: index,
      }));
    
    setWidgets(updatedWidgets);
  };

  // Resize a widget
  const resizeWidget = (id: string, size: 'small' | 'medium' | 'large') => {
    const updatedWidgets = widgets.map(widget => 
      widget.id === id ? { ...widget, size } : widget
    );
    
    setWidgets(updatedWidgets);
  };

  // Reorder widgets
  const reorderWidgets = (activeId: string, overId: string) => {
    if (activeId === overId) return;

    setWidgets(widgets => {
      const oldIndex = widgets.findIndex(w => w.id === activeId);
      const newIndex = widgets.findIndex(w => w.id === overId);
      
      const reordered = [...widgets];
      const [removed] = reordered.splice(oldIndex, 1);
      reordered.splice(newIndex, 0, removed);
      
      // Update positions
      return reordered.map((widget, index) => ({
        ...widget,
        position: index,
      }));
    });
  };

  // Reset to default widgets
  const resetWidgets = () => {
    setWidgets(DEFAULT_WIDGETS);
  };
  
  return {
    widgets,
    loading,
    addWidget,
    removeWidget,
    resizeWidget,
    reorderWidgets,
    resetWidgets,
  };
};
