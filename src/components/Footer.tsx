
import React from 'react';
import { Shield } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const Footer: React.FC = () => {
  const isMobile = useIsMobile();
  
  return (
    <footer className="border-t border-border py-4 sm:py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Shield className="h-5 w-5 text-primary mr-2" />
            <span className="text-base sm:text-lg font-semibold banking-gradient bg-clip-text text-transparent">
              Intantiko
            </span>
          </div>
          
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-8">
            <div className="text-xs sm:text-sm text-muted-foreground">
              © {new Date().getFullYear()} Intantiko. All rights reserved.
            </div>
            <div className="flex space-x-3 sm:space-x-4">
              <a href="#" className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors">Privacy</a>
              <a href="#" className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors">Terms</a>
              <a href="#" className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
