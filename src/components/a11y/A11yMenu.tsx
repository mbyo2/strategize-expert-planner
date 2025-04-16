
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Accessibility, 
  Sun, 
  Moon, 
  Type, 
  ZoomIn, 
  MousePointer2, 
  Languages, 
  EyeOff,
  PanelBottomClose
} from 'lucide-react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { cn } from '@/lib/utils';

interface A11yMenuProps {
  className?: string;
}

const A11yMenu: React.FC<A11yMenuProps> = ({ className }) => {
  const [open, setOpen] = useState(false);
  
  // A11y settings with localStorage persistence
  const [fontSize, setFontSize] = useLocalStorage('a11y-font-size', 100);
  const [highContrast, setHighContrast] = useLocalStorage('a11y-high-contrast', false);
  const [reducedMotion, setReducedMotion] = useLocalStorage('a11y-reduced-motion', false);
  const [dyslexicFont, setDyslexicFont] = useLocalStorage('a11y-dyslexic-font', false);
  const [focusMode, setFocusMode] = useLocalStorage('a11y-focus-mode', false);
  const [reduceTransparency, setReduceTransparency] = useLocalStorage('a11y-reduce-transparency', false);
  const [biggerCursor, setBiggerCursor] = useLocalStorage('a11y-bigger-cursor', false);
  
  // Apply accessibility settings using CSS variables and classes
  React.useEffect(() => {
    // Font size
    document.documentElement.style.setProperty('--a11y-font-scale', `${fontSize}%`);
    
    // High contrast
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
    
    // Reduced motion
    if (reducedMotion) {
      document.documentElement.classList.add('reduced-motion');
    } else {
      document.documentElement.classList.remove('reduced-motion');
    }
    
    // Dyslexic font
    if (dyslexicFont) {
      document.documentElement.classList.add('dyslexic-font');
    } else {
      document.documentElement.classList.remove('dyslexic-font');
    }
    
    // Focus mode
    if (focusMode) {
      document.documentElement.classList.add('focus-mode');
    } else {
      document.documentElement.classList.remove('focus-mode');
    }
    
    // Reduce transparency
    if (reduceTransparency) {
      document.documentElement.classList.add('reduce-transparency');
    } else {
      document.documentElement.classList.remove('reduce-transparency');
    }
    
    // Bigger cursor
    if (biggerCursor) {
      document.documentElement.classList.add('big-cursor');
    } else {
      document.documentElement.classList.remove('big-cursor');
    }
  }, [
    fontSize, 
    highContrast, 
    reducedMotion, 
    dyslexicFont, 
    focusMode, 
    reduceTransparency, 
    biggerCursor
  ]);
  
  return (
    <>
      <style jsx global>{`
        :root {
          --a11y-font-scale: 100%;
        }
        
        body {
          font-size: calc(var(--a11y-font-scale) * 0.01 * 1rem);
        }
        
        /* High contrast mode */
        .high-contrast {
          --background: 0 0% 100%;
          --foreground: 0 0% 0%;
          --primary: 240 100% 50%;
          --primary-foreground: 0 0% 100%;
          --secondary: 0 0% 90%;
          --secondary-foreground: 0 0% 0%;
          --muted: 0 0% 80%;
          --muted-foreground: 0 0% 0%;
          --accent: 240 100% 50%;
          --accent-foreground: 0 0% 100%;
          --destructive: 0 100% 50%;
          --destructive-foreground: 0 0% 100%;
          --border: 0 0% 0%;
          
          filter: contrast(1.4);
        }
        
        /* Reduced motion */
        .reduced-motion * {
          animation-duration: 0.001ms !important;
          transition-duration: 0.001ms !important;
        }
        
        /* Dyslexic font */
        .dyslexic-font * {
          font-family: 'Open Dyslexic', sans-serif !important;
          letter-spacing: 0.05em;
          word-spacing: 0.1em;
          line-height: 1.5;
        }
        
        /* Focus mode */
        .focus-mode div:not(:focus):not(:focus-within) {
          opacity: 0.85;
        }
        
        .focus-mode *:focus, 
        .focus-mode *:focus-within {
          outline: 3px solid var(--primary) !important;
          outline-offset: 2px !important;
        }
        
        /* Reduce transparency */
        .reduce-transparency * {
          opacity: 1 !important;
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
          background-color: unset !important;
        }
        
        .reduce-transparency .glass-effect {
          background-color: var(--background) !important;
        }
        
        /* Big cursor */
        .big-cursor, 
        .big-cursor * {
          cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M4 11.5l5.5-5.5 5 5 1 1'/%3E%3Cpath d='M17 7l-5.5 5.5'/%3E%3Cpath d='M21 11l-5.5 5.5-5-5'/%3E%3C/svg%3E"), auto;
        }
        
        .big-cursor a, 
        .big-cursor button {
          cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 13l2 2 8-10'/%3E%3C/svg%3E"), pointer;
        }
      `}</style>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "fixed bottom-52 right-4 z-50 gap-2 hover:bg-primary hover:text-primary-foreground",
              className
            )}
            aria-label="Accessibility options"
          >
            <Accessibility className="h-4 w-4" />
            <span className="sr-only md:not-sr-only md:inline-flex">Accessibility</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Accessibility className="h-5 w-5" />
              Accessibility Settings
            </DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="display">
            <TabsList className="grid grid-cols-3 mt-2">
              <TabsTrigger value="display" className="flex gap-2">
                <Sun className="h-4 w-4" />
                <span className="hidden sm:inline">Display</span>
              </TabsTrigger>
              <TabsTrigger value="reading" className="flex gap-2">
                <Type className="h-4 w-4" />
                <span className="hidden sm:inline">Reading</span>
              </TabsTrigger>
              <TabsTrigger value="motion" className="flex gap-2">
                <MousePointer2 className="h-4 w-4" />
                <span className="hidden sm:inline">Motion</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="display" className="space-y-4 mt-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="font-size" className="flex items-center gap-2">
                    <ZoomIn className="h-4 w-4" />
                    Text Size
                  </Label>
                  <span className="text-sm">{fontSize}%</span>
                </div>
                <Slider
                  id="font-size"
                  min={75}
                  max={200}
                  step={5}
                  value={[fontSize]}
                  onValueChange={(value) => setFontSize(value[0])}
                  className="w-full"
                />
              </div>
              
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="high-contrast" className="flex items-center gap-2">
                  <Sun className="h-4 w-4" />
                  High Contrast Mode
                </Label>
                <Switch
                  id="high-contrast"
                  checked={highContrast}
                  onCheckedChange={setHighContrast}
                />
              </div>
              
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="reduce-transparency" className="flex items-center gap-2">
                  <PanelBottomClose className="h-4 w-4" />
                  Reduce Transparency
                </Label>
                <Switch
                  id="reduce-transparency"
                  checked={reduceTransparency}
                  onCheckedChange={setReduceTransparency}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="reading" className="space-y-4 mt-4">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="dyslexic-font" className="flex items-center gap-2">
                  <Type className="h-4 w-4" />
                  Dyslexia Friendly Font
                </Label>
                <Switch
                  id="dyslexic-font"
                  checked={dyslexicFont}
                  onCheckedChange={setDyslexicFont}
                />
              </div>
              
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="focus-mode" className="flex items-center gap-2">
                  <EyeOff className="h-4 w-4" />
                  Focus Mode
                </Label>
                <Switch
                  id="focus-mode"
                  checked={focusMode}
                  onCheckedChange={setFocusMode}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="motion" className="space-y-4 mt-4">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="reduced-motion" className="flex items-center gap-2">
                  <MousePointer2 className="h-4 w-4" />
                  Reduced Motion
                </Label>
                <Switch
                  id="reduced-motion"
                  checked={reducedMotion}
                  onCheckedChange={setReducedMotion}
                />
              </div>
              
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="bigger-cursor" className="flex items-center gap-2">
                  <MousePointer2 className="h-4 w-4" />
                  Larger Cursor
                </Label>
                <Switch
                  id="bigger-cursor"
                  checked={biggerCursor}
                  onCheckedChange={setBiggerCursor}
                />
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6">
            <Button 
              variant="outline" 
              onClick={() => {
                setFontSize(100);
                setHighContrast(false);
                setReducedMotion(false);
                setDyslexicFont(false);
                setFocusMode(false);
                setReduceTransparency(false);
                setBiggerCursor(false);
              }}
              className="w-full"
            >
              Reset to Defaults
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default A11yMenu;
