
import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Keyboard } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ShortcutProps {
  keys: string[];
  description: string;
  category: string;
}

const KeyboardShortcuts: React.FC = () => {
  const [open, setOpen] = useState(false);
  
  // Listen for keyboard shortcut to open dialog
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Open shortcuts dialog when pressing Shift + ?
      if (event.shiftKey && event.key === '?') {
        event.preventDefault();
        setOpen(true);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  const shortcuts: ShortcutProps[] = [
    { keys: ['?'], description: 'Show keyboard shortcuts', category: 'General' },
    { keys: ['h'], description: 'Go to home dashboard', category: 'Navigation' },
    { keys: ['g', 'i'], description: 'Go to industry analysis', category: 'Navigation' },
    { keys: ['g', 'p'], description: 'Go to planning', category: 'Navigation' },
    { keys: ['g', 'g'], description: 'Go to goals', category: 'Navigation' },
    { keys: ['g', 'r'], description: 'Go to resources', category: 'Navigation' },
    { keys: ['g', 's'], description: 'Go to settings', category: 'Navigation' },
    { keys: ['g', 'a'], description: 'Go to analytics', category: 'Navigation' },
    { keys: ['s'], description: 'Focus search', category: 'General' },
    { keys: ['n'], description: 'Create new item', category: 'Actions' },
    { keys: ['e'], description: 'Edit current item', category: 'Actions' },
    { keys: ['d'], description: 'Delete current item', category: 'Actions' },
    { keys: ['r'], description: 'Refresh data', category: 'Actions' },
    { keys: ['ctrl', 's'], description: 'Save changes', category: 'Actions' },
    { keys: ['esc'], description: 'Close dialogs/menus', category: 'General' },
    { keys: ['f'], description: 'Toggle full screen view', category: 'Display' },
    { keys: ['ctrl', '+'], description: 'Zoom in', category: 'Display' },
    { keys: ['ctrl', '-'], description: 'Zoom out', category: 'Display' },
    { keys: ['ctrl', '0'], description: 'Reset zoom', category: 'Display' },
  ];
  
  // Group by category
  const shortcutsByCategory = shortcuts.reduce<Record<string, ShortcutProps[]>>((acc, shortcut) => {
    if (!acc[shortcut.category]) {
      acc[shortcut.category] = [];
    }
    acc[shortcut.category].push(shortcut);
    return acc;
  }, {});
  
  // Order of categories
  const categoryOrder = ['General', 'Navigation', 'Actions', 'Display'];
  
  // Sort categories
  const sortedCategories = Object.keys(shortcutsByCategory).sort(
    (a, b) => categoryOrder.indexOf(a) - categoryOrder.indexOf(b)
  );
  
  const Shortcut: React.FC<{ keys: string[] }> = ({ keys }) => {
    return (
      <div className="flex gap-1">
        {keys.map((key, index) => (
          <React.Fragment key={index}>
            <kbd className="px-2 py-1 text-xs bg-muted border rounded-md font-mono">
              {key}
            </kbd>
            {index < keys.length - 1 && key !== 'ctrl' && key !== 'alt' && key !== 'shift' && (
              <span className="text-muted-foreground">then</span>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };
  
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="fixed bottom-36 right-4 z-50 gap-2 hover:bg-primary hover:text-primary-foreground"
            aria-label="Keyboard shortcuts"
          >
            <Keyboard className="h-4 w-4" />
            <span className="sr-only md:not-sr-only md:inline-flex">Shortcuts</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-auto p-6">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Keyboard className="h-5 w-5" />
              Keyboard Shortcuts
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 mt-4">
            {sortedCategories.map(category => (
              <div key={category} className="space-y-2">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                  {category}
                </h3>
                <div className="space-y-2">
                  {shortcutsByCategory[category].map((shortcut, index) => (
                    <div key={index} className="flex justify-between items-center py-1">
                      <span className="text-sm">{shortcut.description}</span>
                      <Shortcut keys={shortcut.keys} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <p className="text-xs text-muted-foreground mt-6">
            Press <kbd className="px-1 py-0.5 text-xs bg-muted border rounded-md font-mono">Shift</kbd> + <kbd className="px-1 py-0.5 text-xs bg-muted border rounded-md font-mono">?</kbd> at any time to show this dialog.
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default KeyboardShortcuts;
