
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

export interface TourStep {
  title: string;
  description: string;
  target?: string;
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

interface OnboardingTourProps {
  tourId: string;
  steps: TourStep[];
  onComplete?: () => void;
  autoStart?: boolean;
}

const OnboardingTour: React.FC<OnboardingTourProps> = ({
  tourId,
  steps,
  onComplete,
  autoStart = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasCompletedTour, setHasCompletedTour] = useState(false);

  useEffect(() => {
    // Check if user has already completed this tour
    const completed = localStorage.getItem(`tour-${tourId}-completed`);
    if (completed) {
      setHasCompletedTour(true);
      return;
    }

    // Auto-start if specified and not completed
    if (autoStart && !hasCompletedTour) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1000); // Small delay to let the page load
      
      return () => clearTimeout(timer);
    }
  }, [tourId, autoStart, hasCompletedTour]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem(`tour-${tourId}-completed`, 'true');
    setHasCompletedTour(true);
    setIsOpen(false);
    setCurrentStep(0);
    onComplete?.();
  };

  const handleSkip = () => {
    handleComplete();
  };

  const progress = ((currentStep + 1) / steps.length) * 100;
  const currentStepData = steps[currentStep];

  if (hasCompletedTour) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg">{currentStepData?.title}</DialogTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {currentStep + 1} of {steps.length}
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSkip}
                className="h-6 w-6"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <Progress value={progress} className="w-full" />
        </DialogHeader>
        
        <DialogDescription className="text-base leading-relaxed">
          {currentStepData?.description}
        </DialogDescription>

        <DialogFooter className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex items-center gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          
          <div className="flex gap-2">
            <Button variant="ghost" onClick={handleSkip}>
              Skip Tour
            </Button>
            <Button onClick={handleNext} className="flex items-center gap-1">
              {currentStep === steps.length - 1 ? 'Complete' : 'Next'}
              {currentStep < steps.length - 1 && <ChevronRight className="h-4 w-4" />}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingTour;
