
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { ChevronLeft, ChevronRight, X, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

export type TourStep = {
  title: string;
  description: string;
  target?: string; // CSS selector for the element to highlight
  placement?: 'top' | 'right' | 'bottom' | 'left' | 'center';
  image?: string;
};

interface OnboardingTourProps {
  tourId: string;
  steps: TourStep[];
  onComplete?: () => void;
  onSkip?: () => void;
}

const OnboardingTour: React.FC<OnboardingTourProps> = ({
  tourId,
  steps,
  onComplete,
  onSkip,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [hasCompletedTour, setHasCompletedTour] = useLocalStorage(`tour-${tourId}-completed`, false);
  const [highlightedElement, setHighlightedElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // Start the tour if it hasn't been completed
    if (!hasCompletedTour && steps.length > 0) {
      // Delay opening to allow page to render completely
      const timer = setTimeout(() => setIsOpen(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [hasCompletedTour, steps]);

  useEffect(() => {
    if (isOpen && steps[currentStep]?.target) {
      const element = document.querySelector(steps[currentStep].target!) as HTMLElement;
      setHighlightedElement(element);
      
      if (element) {
        // Scroll element into view with smooth behavior
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Add highlight effect to the element
        element.classList.add('ring-2', 'ring-primary', 'ring-offset-2', 'z-50');
      }
    }

    return () => {
      // Remove any highlights when step changes
      highlightedElement?.classList.remove('ring-2', 'ring-primary', 'ring-offset-2', 'z-50');
    };
  }, [currentStep, isOpen, steps]);

  const handleNext = () => {
    highlightedElement?.classList.remove('ring-2', 'ring-primary', 'ring-offset-2', 'z-50');
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      completeTour();
    }
  };

  const handlePrevious = () => {
    highlightedElement?.classList.remove('ring-2', 'ring-primary', 'ring-offset-2', 'z-50');
    
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const completeTour = () => {
    setIsOpen(false);
    setHasCompletedTour(true);
    highlightedElement?.classList.remove('ring-2', 'ring-primary', 'ring-offset-2', 'z-50');
    onComplete?.();
  };

  const skipTour = () => {
    setIsOpen(false);
    highlightedElement?.classList.remove('ring-2', 'ring-primary', 'ring-offset-2', 'z-50');
    onSkip?.();
  };

  const restartTour = () => {
    setHasCompletedTour(false);
    setCurrentStep(0);
    setIsOpen(true);
  };

  if (!steps.length) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px] p-0 gap-0 overflow-hidden">
          <div className="bg-primary/5 p-1">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground pl-2">
                Step {currentStep + 1} of {steps.length}
              </span>
              <button 
                onClick={skipTour}
                className="p-1 rounded-full hover:bg-background/80"
                aria-label="Close tour"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          <DialogHeader className="px-6 pt-4">
            <DialogTitle>{steps[currentStep]?.title}</DialogTitle>
            <DialogDescription className="pt-2">
              {steps[currentStep]?.description}
            </DialogDescription>
          </DialogHeader>
          
          {steps[currentStep]?.image && (
            <div className="px-6 py-3">
              <img 
                src={steps[currentStep].image} 
                alt={`Tutorial step ${currentStep + 1}`} 
                className="w-full rounded-md border"
              />
            </div>
          )}
          
          <DialogFooter className="bg-muted/50 p-4 flex-row flex justify-between">
            <div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={skipTour}
                className="text-muted-foreground"
              >
                Skip tutorial
              </Button>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevious}
                disabled={currentStep === 0}
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Previous
              </Button>
              <Button size="sm" onClick={handleNext}>
                {currentStep < steps.length - 1 ? (
                  <>
                    Next
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </>
                ) : (
                  'Finish'
                )}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Floating button to restart the tour if already completed */}
      {hasCompletedTour && (
        <Button
          variant="outline"
          size="sm"
          onClick={restartTour}
          className="fixed bottom-20 right-4 z-50 gap-2 hover:bg-primary hover:text-primary-foreground"
        >
          <BookOpen className="h-4 w-4" />
          <span className="sr-only md:not-sr-only md:inline-flex">Tutorial</span>
        </Button>
      )}
    </>
  );
};

export default OnboardingTour;
