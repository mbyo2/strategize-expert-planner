
import React from 'react';
import { Button } from '@/components/ui/button';

const SkipToContent: React.FC = () => {
  const handleSkipToContent = () => {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.focus();
      mainContent.scrollIntoView();
    }
  };

  return (
    <Button
      onClick={handleSkipToContent}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50"
      variant="outline"
    >
      Skip to main content
    </Button>
  );
};

export default SkipToContent;
