
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

const SkipToContent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Show skip link on Tab press
      if (e.key === 'Tab') {
        setIsVisible(true);
      }
    };

    const handleMouseMove = () => {
      // Hide skip link when mouse is used
      setIsVisible(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Find main content
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      // Focus the main content
      mainContent.setAttribute('tabindex', '-1');
      mainContent.focus();
      
      // Remove tabindex after focus
      setTimeout(() => {
        mainContent.removeAttribute('tabindex');
      }, 1000);
    }
  };

  return (
    <a
      href="#main-content"
      onClick={handleClick}
      className={cn(
        "sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 z-50",
        "focus:bg-primary focus:text-primary-foreground p-3 m-3 transition-opacity",
        isVisible ? "opacity-100" : "opacity-0"
      )}
    >
      Skip to content
    </a>
  );
};

export default SkipToContent;
