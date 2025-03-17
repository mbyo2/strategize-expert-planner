
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Shield, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header: React.FC = () => {
  return (
    <header className="border-b border-border sticky top-0 z-50 w-full glass-effect">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Shield className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold tracking-tight banking-gradient bg-clip-text text-transparent">
            Intantiko
          </span>
        </div>
        
        <div className="flex items-center space-x-4">
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Dashboard
            </Link>
            <Link to="/industry" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Industry
            </Link>
            <Link to="/planning" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Planning
            </Link>
            <Link to="/resources" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Resources
            </Link>
          </nav>
          
          <Button variant="ghost" size="icon" className="text-foreground">
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
