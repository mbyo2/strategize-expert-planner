
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Keyboard } from 'lucide-react';

interface Shortcut {
  keys: string[];
  description: string;
  category: string;
}

const KeyboardShortcuts: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const shortcuts: Shortcut[] = [
    { keys: ['Alt', 'H'], description: 'Open help center', category: 'Navigation' },
    { keys: ['Alt', 'M'], description: 'Open main menu', category: 'Navigation' },
    { keys: ['Alt', 'S'], description: 'Open search', category: 'Navigation' },
    { keys: ['Ctrl', 'K'], description: 'Command palette', category: 'Navigation' },
    { keys: ['Ctrl', 'Shift', 'A'], description: 'Open accessibility menu', category: 'Accessibility' },
    { keys: ['Ctrl', 'Shift', 'T'], description: 'Toggle tactical mode', category: 'Accessibility' },
    { keys: ['Ctrl', 'Shift', 'C'], description: 'Toggle high contrast', category: 'Accessibility' },
    { keys: ['Escape'], description: 'Close dialog/modal', category: 'General' },
    { keys: ['Tab'], description: 'Navigate forward', category: 'General' },
    { keys: ['Shift', 'Tab'], description: 'Navigate backward', category: 'General' },
  ];

  const groupedShortcuts = shortcuts.reduce((acc, shortcut) => {
    if (!acc[shortcut.category]) {
      acc[shortcut.category] = [];
    }
    acc[shortcut.category].push(shortcut);
    return acc;
  }, {} as Record<string, Shortcut[]>);

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      // Open keyboard shortcuts with Ctrl+Shift+?
      if (event.ctrlKey && event.shiftKey && event.key === '?') {
        event.preventDefault();
        setIsOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeydown);
    return () => document.removeEventListener('keydown', handleKeydown);
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="fixed bottom-4 left-4 z-50"
          aria-label="View keyboard shortcuts"
        >
          <Keyboard className="h-4 w-4" />
          <span className="sr-only">Keyboard shortcuts</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="h-5 w-5" />
            Keyboard Shortcuts
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {Object.entries(groupedShortcuts).map(([category, shortcuts]) => (
            <div key={category}>
              <h3 className="font-semibold mb-3">{category}</h3>
              <div className="space-y-2">
                {shortcuts.map((shortcut, index) => (
                  <div key={index} className="flex items-center justify-between py-2 px-3 rounded-lg border">
                    <span className="text-sm">{shortcut.description}</span>
                    <div className="flex items-center gap-1">
                      {shortcut.keys.map((key, keyIndex) => (
                        <React.Fragment key={keyIndex}>
                          <Badge variant="outline" className="text-xs px-2 py-1">
                            {key}
                          </Badge>
                          {keyIndex < shortcut.keys.length - 1 && (
                            <span className="text-xs text-muted-foreground">+</span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div className="text-sm text-muted-foreground border-t pt-4">
            <p>Press <Badge variant="outline" className="mx-1">Ctrl</Badge> + <Badge variant="outline" className="mx-1">Shift</Badge> + <Badge variant="outline" className="mx-1">?</Badge> to open this dialog</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default KeyboardShortcuts;
