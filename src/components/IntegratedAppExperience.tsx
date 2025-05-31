
import React, { useState } from 'react';
import { startMeasure, endMeasure } from "@/utils/performanceMonitoring";
import { Button } from './ui/button';
import { Info, Settings } from 'lucide-react';
import OnboardingTour, { TourStep } from './onboarding/OnboardingTour';
import HelpCenter from './help/HelpCenter';
import ContextualHelp from './help/ContextualHelp';
import FeedbackWidget from './feedback/FeedbackWidget';
import SkipToContent from './a11y/SkipToContent';
import KeyboardShortcuts from './a11y/KeyboardShortcuts';
import A11yMenu from './a11y/A11yMenu';
import UniversalAccess from './accessibility/UniversalAccess';
import { LanguageSwitcher } from '@/i18n';
import { useAuth } from '@/hooks/useAuthCompat';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const IntegratedAppExperience: React.FC = () => {
  const [helpOpen, setHelpOpen] = useState(false);
  const [accessibilityOpen, setAccessibilityOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  
  // Define main app tour steps
  const mainAppTourSteps: TourStep[] = [
    {
      title: "Welcome to Intantiko",
      description: "This platform is designed for everyone - from military personnel in battlefield conditions to civilians in everyday use. Let's explore its universal accessibility features!",
      placement: "center"
    },
    {
      title: "Universal Access",
      description: "Click the Universal Access button to configure the platform for your specific needs, including military/tactical modes, visual/hearing impairments, and LLM connectivity.",
      placement: "right"
    },
    {
      title: "Navigation Menu",
      description: "Use the navigation menu to access different sections. The interface adapts to your accessibility profile automatically.",
      target: "header",
      placement: "bottom"
    },
    {
      title: "Dashboard Overview",
      description: "Your dashboard provides strategic planning tools optimized for high-stress environments and accessible to all users.",
      target: "main",
      placement: "top"
    },
    {
      title: "AI Integration",
      description: "Connect to Large Language Models for AI-powered strategic analysis and decision support.",
      placement: "right"
    },
    {
      title: "Mission Complete!",
      description: "You're ready to use Intantiko in any environment, from boardrooms to battlefields. All features are designed for maximum accessibility and usability.",
      placement: "center"
    }
  ];
  
  // Only render support tools for authenticated users
  if (!isAuthenticated) {
    return null;
  }
  
  return (
    <>
      {/* Accessibility enhancements */}
      <SkipToContent />
      
      {/* The semantic markup and keyboard accessibility enhancements */}
      <section aria-label="Support tools" className="sr-only">
        <h2>Universal Access and Support</h2>
        <p>Access help, provide feedback, customize accessibility settings, and connect with AI systems</p>
      </section>
      
      {/* User onboarding */}
      <OnboardingTour 
        tourId="universal-access-tour"
        steps={mainAppTourSteps}
        onComplete={() => {
          console.log('Universal access tour completed');
        }}
      />
      
      {/* Universal Access Center */}
      <Dialog open={accessibilityOpen} onOpenChange={setAccessibilityOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="fixed bottom-20 right-4 z-50 gap-2 hover:bg-primary hover:text-primary-foreground"
            aria-label="Open Universal Access Center"
          >
            <Settings className="h-4 w-4" />
            <span className="sr-only md:not-sr-only md:inline-flex">Universal Access</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Universal Access Center
            </DialogTitle>
          </DialogHeader>
          <UniversalAccess />
        </DialogContent>
      </Dialog>
      
      {/* Help Center */}
      <HelpCenter 
        isOpen={helpOpen}
        onClose={() => setHelpOpen(false)}
      />
      
      <Button
        variant="outline"
        size="sm"
        className="fixed bottom-68 right-4 z-50 gap-2 hover:bg-primary hover:text-primary-foreground"
        onClick={() => setHelpOpen(true)}
        aria-label="Open help center"
      >
        <Info className="h-4 w-4" />
        <span className="sr-only md:not-sr-only md:inline-flex">Help</span>
      </Button>
      
      {/* Feedback collection */}
      <FeedbackWidget position="right" />
      
      {/* Keyboard shortcuts guide */}
      <KeyboardShortcuts />
      
      {/* Accessibility menu */}
      <A11yMenu />
      
      {/* Language switcher */}
      <LanguageSwitcher />
    </>
  );
};

export default IntegratedAppExperience;
