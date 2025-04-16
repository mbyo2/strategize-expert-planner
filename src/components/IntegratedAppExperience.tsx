
import React, { useState } from 'react';
import { startMeasure, endMeasure } from "@/utils/performanceMonitoring";
import { Button } from './ui/button';
import { Info } from 'lucide-react';
import OnboardingTour, { TourStep } from './onboarding/OnboardingTour';
import HelpCenter from './help/HelpCenter';
import ContextualHelp from './help/ContextualHelp';
import FeedbackWidget from './feedback/FeedbackWidget';
import SkipToContent from './a11y/SkipToContent';
import KeyboardShortcuts from './a11y/KeyboardShortcuts';
import A11yMenu from './a11y/A11yMenu';
import { LanguageSwitcher } from '@/i18n';

const IntegratedAppExperience: React.FC = () => {
  const [helpOpen, setHelpOpen] = useState(false);
  
  // Define main app tour steps
  const mainAppTourSteps: TourStep[] = [
    {
      title: "Welcome to Intantiko",
      description: "This quick tour will help you get familiar with the platform. Let's get started!",
      placement: "center"
    },
    {
      title: "Navigation Menu",
      description: "Use the navigation menu to access different sections of the application.",
      target: "header",
      placement: "bottom"
    },
    {
      title: "Dashboard Overview",
      description: "Your dashboard provides a quick overview of your strategic planning progress, industry metrics, and key performance indicators.",
      target: "main",
      placement: "top"
    },
    {
      title: "Search Feature",
      description: "Use the search feature to quickly find content across the platform.",
      target: "header .container",
      placement: "bottom"
    },
    {
      title: "Need Help?",
      description: "Click the Help button to access documentation, tutorials, and support.",
      placement: "right"
    },
    {
      title: "Tour Complete!",
      description: "You've completed the basic tour. You can restart it anytime from the help menu.",
      placement: "center"
    }
  ];
  
  return (
    <>
      {/* Accessibility enhancements */}
      <SkipToContent />
      
      {/* The semantic markup and keyboard accessibility enhancements */}
      <section aria-label="Support tools" className="sr-only">
        <h2>Support and Assistance</h2>
        <p>Access help, provide feedback, and customize accessibility settings</p>
      </section>
      
      {/* User onboarding */}
      <OnboardingTour 
        tourId="main-app-tour"
        steps={mainAppTourSteps}
        onComplete={() => {
          console.log('Tour completed');
        }}
      />
      
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
